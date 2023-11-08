const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;


// middleware below
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}));
app.use(express.json());

// ----------------------


// ----------------------
// mongodb connection
// ----------------------


// 1. connecting to the db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irfnbkn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// 2. running the func
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db("shareFood").collection("foods");
    const foodReqCollection = client.db("shareFood").collection("reqFoods");
    

    app.get('/foods', async(req, res) => {
        const query = req.query;
        const sort = parseInt(query.sort) || 1;
        const searchQuery  = query.search || '';
        let result;

        if(searchQuery){
          result = await foodCollection.find({name: searchQuery}).toArray();
        }
        else if(sort){
          result = await foodCollection.find().sort({date: sort}).toArray();
        }
        else{
          result = await foodCollection.find().toArray();
        }
        res.send(result);
        console.log(result,sort);
    })

    app.get('/foods/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await foodCollection.findOne(query);
      res.send(result);
    })

    app.post('/foods', async(req, res) =>{
        const foodDetails = req.body;
        const result = await foodCollection.insertOne(foodDetails);
        res.send({success: true, result});
    })

    app.patch('/foods/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedDoc = req.body;
      const query = {_id: new ObjectId(id)};
      const result = foodCollection.updateOne(query, updatedDoc) 
    })

    app.delete('/foods/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await foodCollection.deleteOne(query);
      res.send(result)
    })


    // food req api
    app.get('/foodReq', async(req, res) =>{
      const query = req.query.foodId;
      console.log("query req,", )
      const  result = await foodReqCollection.find({foodId: query}).toArray();
      console.log(result, query, ': query req: ');
      res.send(result);
    })

    
    app.post('/foodReq', async(req, res) =>{
      const reqDetail = req.body;
      const result = await foodReqCollection.insertOne(reqDetail);
      res.send({message: true});
    })


    
    // this will get foods according to their email
    app.get('/userFood', async(req, res) =>{
      const query = req.query.email;
      console.log(query);
      const result = await foodCollection.find({donatorEmail: query}).toArray();
      console.log(result)
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






app.get('/', (req, res) => res.send('Food Share server is running'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))