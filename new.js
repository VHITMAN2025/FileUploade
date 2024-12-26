const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect("mongodb+srv://vijjuroxxx143:0Z7DMARTXe8AuiAM@cluster0.swg7e.mongodb.net/Student")
const userSchema = mongoose.Schema({
    name:String,
    age:Number
})
const userModel = mongoose.model("emp",userSchema);
const emp1 = new userModel({
    name:"HITMAN",
    age:37
})
emp1.save();
app.listen("1234",()=>
{
    console.log("server is running");
})