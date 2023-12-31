import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config'
const app = express();
const port =  process.env.PORT || 7001
//middleware


app.use(cors())

app.use(express.json());

//connect to mongodb server
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASSWORD}@cluster0.fo1holf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Create a  database collection
    const All_Services = client.db("nexus-build-server").collection("all-services");
    //category database collection
    const Category  = client.db("nexus-build-server").collection("category");
    //user database
    const Order = client.db("nexus-build-server").collection("order");
    // insert a data to the database
    app.post("/all-services",async(req,res) => {
      const services = req.body
      const result = await All_Services.insertOne(services)
      res.send(result)
    })
    //read all data
    app.get("/all-services",async(req,res) => {
     //sorting by category
     let query ={}
  const category = req.query.category;
  console.log(category)
  if(category){
    query.category = category;
  }
console.log(query)
      const result = await All_Services.find(query).toArray();
      res.send(result)
    });
    //read  data by id
    app.get("/all-services/:id",async(req,res)=>{
      const id= req.params.id;
      const  query ={
        _id : new ObjectId(id),
      }
      const result = await All_Services.findOne(query);
      res.send(result);
    })
    // category api
    // insert a data to the database
    app.post("/category",async(req,res) => {
      const category = req.body
      const result = await Category.insertOne(category)
      res.send(result)
    })
    //read all data
    app.get("/category",async(req,res) => {
      const result = await Category.find().toArray();
      res.send(result)
    });
    //read  data by id
    app.get("/category/:id",async(req,res)=>{
      const id= req.params.id;
      const  query ={
        _id : new ObjectId(id),
      }
      const result = await Category.findOne(query);
      res.send(result);
    })
    //order api
    // insert a data to the database
    app.post("/order",async(req,res) => {
      const order = req.body
      const result = await Order.insertOne(order)
      res.send(result)
    })
    //read all data
    app.get("/order",async(req,res) => {
      const result = await Order.find().toArray();
      res.send(result)
    });

      // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


//home page
app.get('/', (req, res) => {
    res.send("Welcome to  my server!");
})
// exceed the server
app.listen(port,()=>{console.log(`server is listening on ${port}`)}); 