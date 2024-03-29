const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const testL = require('./testData.json');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuweya4.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("toyDB").collection("initialTest");
    app.get('/toys', async(req, res) => {

      const cursor = database.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/toys', async(req, res) => {

      const toy = req.body;
      const result = await database.insertOne(toy);
      res.send(result);
    })
    app.delete('/toys/:id', async(req, res) => {

      const id = req.params.id;
      console.log('Toy', id);
      const query = { _id: new ObjectId(id) };
      const result = await database.deleteOne(query);
      res.send(result);
    })
    app.put('/toys/:id', async(req, res) => {

      const id = req.params.id;
      const toy = req.body;
      console.log('Toy', id, toy);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToy = {
        $set: {
          quantity: toy.quantity, price: toy.price, details: toy.details
        },
      };
      const result = await database.updateOne(filter, updateToy, options);
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


app.get('/', (req, res) => {

  res.send('Hello World!')
})

app.get('/test', async(req, res) => {

  res.send(testL);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})