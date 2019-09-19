let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");

var http          = require('http')
var fs            = require('fs');
var Fabric_Client = require('fabric-client');
var util          = require('util');
var os            = require('os');

const { invoke } = require('../fabcar/javascript/invoke');
const { query } = require('../fabcar/javascript/query');
//let mongojs = require("mongojs");
//let db = mongojs("mongodb://localhost:27017/mydb");

let app = express();

 //View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

//Express Static Files
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Index PAge
app.get('/', function(req,res,next){
    res.render("index.html");
});

app.post('/api/postData', function(req, res, next){

    var data = req.body;
    //console.log(data);
	// var transaction= {
    //     name:req.body.name,
    //     email:req.body.email
    // }

    var params= {
        function : 'createCar',
        Key: req.body.Key,
        make: req.body.make,
        model: req.body.model,
        color:req.body.color,
        owner: req.body.owner
	}
    
    
       invoke(params).then(result=>{res.send({result:result})
       
   })
  .catch(err => res.status(err.status).json({
     message: err.message
  }))

});                                       
// API CALLS
// =======================================================================
app.get('/api/getData', function(req,res,next){

	var params= {};

    //query(params).then(result=>{res.send({result:result})
    query(params).then(result => {res.send(result)
    //query(params).then(result=>{res.json(result)
   })
  .catch(err => res.status(err.status).json({
     message: err.message
  }))

// query(params).then(function(err,result){
//     if(!err)
//         res.send({result});
// });

});
// =======================================================================

// Server Running on Localhost with PORT:3000
app.listen(3000, () => {
    console.log("Server Running on localhost 3000");
});
