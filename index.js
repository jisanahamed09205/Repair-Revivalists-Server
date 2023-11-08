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

      //service data get to update
      app.get('/updateService/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        res.send(result);
      })

      //service update
      app.put('/updatedService/:id',async(req,res)=>{
        const id =req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true};
        const updatedService = req.body;
        const service ={
          $set: {
                service_name: updatedService.service_name,
                userEmail: updatedService.userEmail,
                service_provider_name: updatedService.service_provider_name,
                service_provider_img: updatedService.service_provider_img,
                service_area: updatedService.service_area,
                service_description: updatedService.service_description,
                details: updatedService.details,
                service_price: updatedService.service_price,
                service_img: updatedService.service_img
          }
        }

        const result = await serviceCollection.updateOne(filter,service,options)
        res.send(result);

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
      const result = await serviceCollection.insertOne(newService)
      res.send(result)
    })

    //Delete Service
    app.delete('/service/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
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