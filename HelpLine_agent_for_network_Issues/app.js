//Express FrameWork
const express = require('express');

//For converting the data to JSON
const bodyParser=require("body-parser");
//routing all api's
const route =require('./user_apis');
//For DataBase Connecion
const mongoose=require("mongoose");

//express app
const app = express();

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/UserTrouble",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise=global.Promise;

//middleware
app.use(bodyParser.json());

//root api
app.use('/user',route);

//error handling middleware(MiddleWare)
app.use((req,res)=>{
  console.log("error message");
    res.send({error:"404! Page not found"});
});

//Listen for request
app.listen(3000,()=>{
    console.log("server is running...");
});
