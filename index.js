const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require ('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s0a6uh7.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('RepairRevivalists').collection('services');
    const bookingCollection = client.db('RepairRevivalists').collection('bookings');
    //booking or purched services

    //service card 
    app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //service Details
    app.get('/serviceDetails/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })

    //bookings
    app.post('/bookings',async(req,res)=>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    });

    //add services on post to database
    app.post('/addService',async(req,res)=>{
      const newService = req.body;
      console.log(newService);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('RepairRevivalists is running')
})

app.listen(port,()=>{
    console.log(`RepairRevivalists Server is running on port ${port}`);
})