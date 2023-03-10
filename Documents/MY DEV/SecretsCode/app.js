//jshint esversion:6
require('dotenv').config()
const express = require ("express");
const ejs = require ("ejs");
const bodyParser = require ("body-parser");
const mongoose = require ("mongoose");
const encrypt = require ("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']  });

const User = mongoose.model("User", userSchema);

app.route("/")
 .get(function(req, res){
   res.render("home");
 });

app.route("/login")
   .get(function(req, res){
     res.render("login")
   })
   .post(function(req, res){
     const password = req.body.password;
     User.findOne({email: req.body.username}, function(err, foundlist){
       if (foundlist.password === password) {
         res.render("secrets");

       } else {
         console.log(err);
       }
     });
   });

app.route("/register")
   .get(function(req, res){
     res.render("register");
   })
   .post(function(req, res){
     const user = new User({
       email: req.body.username,
       password: req.body.password
     });
     user.save(function(err){
       if (err) {
         console.log(err);
       } else {
         res.redirect("/login");
       }
     });
   });










app.listen(3000, function(){
console.log("server started");
});
