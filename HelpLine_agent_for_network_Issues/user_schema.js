const mongoose = require("mongoose");

const create_schema=mongoose.Schema;

//create schema for getting user_name for given phone number
const collection1=new create_schema({
  phone:{
    type: String,
    required: [true,"phone number if required"]
  },
  name:{
    type: String,
    required:[true,"Name of the user"]
  }
});

const collection2=new create_schema({
  phone:{
    type: Number,
    required: [true,"phone number is required"]
  },
  issue_of_the_user:{
    type: String
  },
  time_of_the_issue:{
    type: String
  },
  status: {
    type: String
  },
  token:{
    type: String
  }
});

//creating models for both collections
const model_coll_1=mongoose.model("list_of_users",collection1);
const model_coll_2=mongoose.model("list_of_troble",collection2);

//Exporting both the models
module.exports ={
  coll1:model_coll_1,
  coll2:model_coll_2
};
