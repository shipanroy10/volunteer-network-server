const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectID } = require('mongodb');

require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(cors())

const port = 5000




const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ydglb.mongodb.net/volunteer?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const worksCollection = client.db("volunteer").collection("networks");
  const bookingsCollection = client.db("volunteer").collection("orders");
  app.get('/works',(req,res)=>{
    // console.log(req.query.email);
    worksCollection.find({}).limit(20)
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.post('/addWorks',(req,res)=>{
    const works = req.body;
    console.log(works)
worksCollection.insertOne(works)
.then(result=>{
    console.log(result)
    res.send(result.insertedCount>0)
})
})


app.delete('/delete/:id',(req,res)=>{
    const workerId = ObjectID(req.params.id)
    console.log(workerId)
    bookingsCollection.deleteOne({_id:workerId})
    .then((result)=>{
       console.log(result)
    })
})

   

app.post('/addBook',(req,res)=>{
    const work = req.body;
    bookingsCollection.insertOne(work)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
    console.log(work)
})
app.get('/bookings',(req,res)=>{
    // console.log(req.query.email);
    bookingsCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})
app.get('/booking',(req,res)=>{
    bookingsCollection.find({})
    .toArray((err,docs)=>{
        res.send(docs)
    })
})




});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(port)