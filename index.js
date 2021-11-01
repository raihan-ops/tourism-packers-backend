
const express=require('express');
const app=express();
const port= process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const cors= require('cors');
require('dotenv').config();
const ObjectId= require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lkoa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{

            await client.connect();
            const database=client.db('tourism');
            const TourismCollection= database.collection('places');
            const BookingCollection= database.collection('booking')
            const FinalBookingCollection=database.collection('finalBooking');

            // -------------------------------------------------------------------
            // get multiple item
            app.get('/places', async (req,res)=>{
                const cursor=TourismCollection.find({});
                const service= await cursor.toArray();

                res.send(service);
            })
            //get single item
            app.get('/places/:id', async (req, res)=>{
                const id=req.params.id;
                const query={_id:ObjectId(id)};
                const user= await TourismCollection.findOne(query);
    
                res.send(user);
            })

            // ---------------------------------------------------------------
            // booking post
            app.post('/myBooking', async(req,res)=>{
                const newUser = req.body;
            const result = await BookingCollection.insertOne(newUser);
            console.log('hitttinggggggg', req.body);
            res.send(result);
     
            })

            // booking get
            app.get('/myBooking', async (req,res)=>{
                const cursor=BookingCollection.find({});
                const service= await cursor.toArray();

                res.send(service);
            })


            // ----------------------------------------------------------------
            // delete single booking
            // find one
            app.get('/myBooking/:id', async (req, res)=>{
                const id=req.params.id;
                const query={_id:id};
                const user= await BookingCollection.findOne(query);
    
                res.send(user);
            })
            // delete one
            app.delete('/myBooking/:id', async (req, res)=>{
                const id=req.params.id;
                const query={_id:id};
                const user= await BookingCollection.deleteOne(query);
    
                res.send(user);
            })

    
            // clear booking
            app.delete('/myBooking', async (req,res)=>{   
             const result= await BookingCollection.deleteMany({})
                 res.send(result);
            })



            // ----------------------------------------------------------------------
            // final booking post
            app.post('/bookingList', async(req,res)=>{
                const newUser = req.body;
            const result = await FinalBookingCollection.insertOne(newUser);
            // console.log('hitttinggggggg 2ndd', req.body);
            res.send(result);
     
            })

            // final booking get
            app.get('/bookingList', async (req,res)=>{
                const cursor=FinalBookingCollection.find({});
                const service= await cursor.toArray();

                res.send(service);
            })


            // ------------------------------------------------------------
            // add places
            app.post('/places', async (req, res) => {
                const newUser = req.body;
                const result = await TourismCollection.insertOne(newUser);
                console.log('hitttinggggggg', req.body);
                res.json(result);
            })
            // single delete places
            app.delete('/places/:id', async (req, res)=>{
                const id=req.params.id;
                const query={_id:ObjectId(id)};
                const user= await TourismCollection.deleteOne(query);
    
                res.send(user);
            })

            app.put('/places/:id', async (req,res)=>{
                const id=req.params.id;
                const updatePlace=req.body;
                console.log(updatePlace);
                const query={_id:ObjectId(id)};
                const options={upsert: true};
                const updateDoc = {
                    $set: {
                     name:updatePlace.name,
                     details:updatePlace.details,
                     image:updatePlace.image,
                     fees:updatePlace.fees,
                     days:updatePlace.days,
                     review:updatePlace.review
                      
                    },
                  };
               
                  const result= await TourismCollection.updateOne(query,updateDoc,options)
               res.json(result);
            })


    }
    finally{

    }
}
run().catch(console.dir);



app.get ('/',(req,res)=>{
    res.send ("home is runnig");
})

app.listen(port,()=>{

    console.log("server is runnig",port);
})

