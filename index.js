var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
 
var app = express()
require('dotenv').config()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.use(cors())
 
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const assert = require('assert');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8jtul.mongodb.net/volunteer-work?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
client.connect(err => {
  // collection section-----------------------------------------------------------------------------------
  const collection = client.db("volunteer-work").collection("events");
  console.log('Database connected')

  app.post('/addEvents', (req, res) =>{
    collection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount < 0)
      console.log('Inserted Successfully');
    })
  })

  app.get('/events', (req, res) => {
    collection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

   app.get('/events/:id', (req, res) =>{
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })
// registers collection section------------------------------------------------------------------------------
  const registersCollection = client.db("volunteer-work").collection("registers");
  app.post('/register', (req, res) => {
      registersCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount < 0)
        console.log('Insert Item Successfully');
      })
  })
  app.get('/registerdEvents/:email', (req, res) => {
    registersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
// regiscollection section------------------------------------------------------------------------------------
const regisCollection = client.db("volunteer").collection("regis");
app.post('/regisData', (req, res) => {
  regisCollection.insertOne(req.body)
  .then(result => {
    res.send(result.insertedCount < 0)
    console.log('Inserted Successfully');
  })
})
app.get('/registerdData', (req, res) => {
  regisCollection.find({})
  .toArray((err, documents) => {
    res.send(documents)
  })
})
  
});



app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(4005, () => console.log('Lisening from port 4005'))