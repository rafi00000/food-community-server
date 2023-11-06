const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    

    app.get('/foods', async(req, res) => {
        const query = req.query;
        const sort = parseInt(query.sort);
        const searchQuery  = query.search;
        const result = await foodCollection.find().sort({date: sort}).toArray();
        res.send(result);
        console.log(sort,searchQuery);
        
    })

    app.post('/foods', async(req, res) =>{
        const foodDetails = req.body;
        console.log('insert req: ', foodDetails);
        const result = await foodCollection.insertOne(foodDetails);
        res.send({success: true, result});
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