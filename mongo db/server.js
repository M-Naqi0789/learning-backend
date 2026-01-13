const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));

app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// mongodb + mongoose 

// 1) CONNECTING TO THE DB

// native driver vs mongoose
// native = raw mongo, more control, more pain
// mongoose = ODM, schemas + validation, easier life

// connection string
// mongodb+srv://user:pass@cluster/db

// connect
// await mongoose.connect(process.env.MONGO_URI)

// events
// db.on("connected") -> we’re good
// db.on("error") -> something’s on fire
// db.on("disconnected") -> connection dropped


// 2) SCHEMAS & MODELS

// schema = shape of your data

// types
// String, Number, Boolean, Date
// ObjectId for references

// timestamps
// { timestamps: true }
// auto gives createdAt and updatedAt

// validation
// required, min, max, match
// plus custom validators

// virtuals
// fields that don’t exist in DB
// computed stuff like fullName

// methods
// functions on a single document

// statics
// functions on the model itself


// 3) CRUD 

// create
// Model.create()
// new Model().save()
// insertMany()

// read
// find()
// findOne()
// findById()

// update
// updateOne()
// findByIdAndUpdate()
// $set, $inc, $push, etc

// delete
// deleteOne()
// findByIdAndDelete()

// query helpers
// .sort()
// .limit()
// .skip()
// .select()


// 4) RELATIONS & STRUCTURE

// embed
// put data inside the document
// fast reads

// reference
// store ObjectId
// link to another collection

// populate
// mongoose fake-joins for referenced docs

// lean()
// skip mongoose wrappers
// get plain JS objects
// faster when you only need data

// transactions
// when multiple writes must all succeed or all fail
// ACID stuff


// 5) AGGREGATION 

// pipelines
// array of steps mongo runs in order

// $match -> filter
// $group -> group data
// $sort -> sort
// $project -> reshape fields
// $unwind -> explode arrays
// $lookup -> join collections

// accumulators
// $sum, $avg, $push, etc


// 6) PERFORMANCE

// indexes
// make queries fast
// single
// compound
// unique
// TTL (auto delete OTPs)

// explain()
// see if mongo is using index or doing full scan
// COLLSCAN = slow garbage

// capped collections
// fixed size logs

// connection pooling
// too many open connections = server dies


// 7) TOOLS

// Atlas
// cloud mongo
// clusters, users, IP whitelist

// Compass
// GUI to view and test data

// migrations
// because schemas change
// and prod data is scary

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));