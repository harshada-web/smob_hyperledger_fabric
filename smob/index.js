let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let mongojs = require("mongojs");
let db = mongojs("mongodb://localhost:27017/smob");

let app = express();

//Hyperledger 
const { invoke } = require('../fabcar/javascript/invoke');
const { query } = require('../fabcar/javascript/query');

//DB Collections
let user = db.user;
let item = db.item
let request = db.request;
let quotation = db.quotation;
let order = db.order;
let invoice = db.invoice;
let payment = db.payment;
let logistics = db.logistics;

let manufacture_inventory = db.manufacture_inventory;
let manufacture_request = db.manufacture_request;
let retman_quotation = db.retman_quotation;
let retman_order =  db.retman_order;
let retman_invoice = db.retman_invoice;
let retman_payment = db.retman_payment;

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

//Express Static Files
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/js')));
app.use(express.static(path.join(__dirname, 'client/css')));
app.use(express.static(path.join(__dirname, 'client/pics')));
app.use(express.static(path.join(__dirname, 'client/pages')));
app.use(express.static(path.join(__dirname, 'client/supplier')));
app.use(express.static(path.join(__dirname, 'client/supplier/css')));
app.use(express.static(path.join(__dirname, 'client/supplier/pages')));
app.use(express.static(path.join(__dirname, 'client/retailer')));
app.use(express.static(path.join(__dirname, 'client/retailer/css')));
app.use(express.static(path.join(__dirname, 'client/retailer/pages')));
app.use(express.static(path.join(__dirname, 'client/logistic')));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Index PAge
app.get('/', function(req,res,next){
    res.render("index.html");
});


// ================================== SMOB ==================================


// ================================== LOGIN PAGE ==================================

// User Login API 
app.get('/smob/login/data/:email', function(req,res,next){
    
    user.find({email:req.params.email}, function(err,data){
        if(!err)
            res.json(data);
        else
            res.json(err);
    });
});

// User Registration API 
app.post('/smob/login/data/reg', function(req,res,next){    
    let data = req.body;
    
    user.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});



// ================================== MANUFACTURER DASHBOARD PAGE ==================================

// GET All Supplier Inventory API
app.get('/smob/dashboard/inventory/data', function(req,res,next){
    item.find(function(err,data){
        if(!err)
            res.json(data);
    });
});

// GET Single item from supplier inventory API
app.get('/smob/dashboard/inventory/data/:id', function(req,res,next){
    item.find({item_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
    });
});

// GET Supplier detail API
app.get('/smob/dashboard/supplier/data/:id', function(req,res,next){
    user.find({user_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
    });
});

// POST a Request API
app.post('/postData/request', function(req,res,next){
    let post_data = req.body;
    //console.log(post_data);
    request.save(post_data, function(err,data){
       if(!err)
            res.json("1 Document Inserted : "+data);
    });
});



// ================================== MANUFACTURER REQUEST PAGE =======================

// GET All Request API
app.get('/smob/dashboard/req/data', function(req,res,next){
    request.find(function(err,data){
        if(!err)
            res.json(data);
    });
});


// ================================== MANUFACTURER -> SUPPLIER REQUEST PAGE =======================

// GET Single Request API
app.get('/smob/dashboard/req/data/:id', function(req,res,next){
    request.find({req_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
    });
});

// GET Single Quotation API
app.get('/smob/dashboard/req/quotation/:id', function(req,res,next){
    quotation.find({req_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
            next(err);
        }
    });
});

// GET Single Purchase Order API
app.get('/smob/dashboard/req/order/:id', function(req,res,next){
    order.find({req_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
                next(err);
        }
    });
});

// GET Single Invoice API
app.get('/smob/dashboard/req/invoice/:id', function(req,res,next){
    invoice.find({order_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
                next(err);
        }
    });
});

// GET Single Payment API
app.get('/smob/dashboard/req/payment/:id', function(req,res,next){
    payment.find({invoice_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
                next(err);
        }
    });
});


// Purchase Order API
app.post('/postData/smob/manufacturer/track', function(req,res,next){
    let data = req.body;
    //console.log(data);
    order.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});


app.post('/postData/smob/manufacturer/payment/track', function(req,res,next){
    let data = req.body;
    //console.log(data);
    payment.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// ============================== RETAILER ==================================

app.get('/smob/dashboard/manufacturer/inventory/data', function(req,res,next){
    manufacture_inventory.find(function(err,data){
        if(!err)
            res.json(data);
    });
});

// =============================
app.post('/postData/retailer/request', function(req,res,next){
    let data = req.body;
    //console.log(data);
    manufacture_request.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});


// ================================== RETAILER REQUEST PAGE =======================

// 
app.get('/smob/dashboard/retailer/req/data', function(req,res,next){
    manufacture_request.find(function(err,data){
        if(!err)
            res.json(data);
    });
});

app.get('/smob/dashboard/retailer/req/data/:id', function(req,res,next){
    manufacture_request.find({req_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
    });
});

// ================================== RETAILER REQUEST TRACK PAGE =======================

// Get Quotation Detail Track API
app.get('/smob/dashboard/retailer/quotation/:id', function(req,res,next){
    retman_quotation.find({req_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
            next(err);
        }
    });
});

// Get Order Detail Track API
app.get('/smob/dashboard/retailer/order/:id', function(req,res,next){
    retman_order.find({order_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
            next(err);
        }
    });
});

// Get Invoice Detail Track API
app.get('/smob/dashboard/retailer/invoice/:id', function(req,res,next){
    retman_invoice.find({invoice_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
            next(err);
        }
    });
});

// Get Payment Detail Track API
app.get('/smob/dashboard/retailer/payment/:id', function(req,res,next){
    retman_payment.find({payment_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
        else{
            next(err);
        }
    });
});

/////////////////////////////////////////////////////////////////////////////////////


// 
app.get('/smob/dashboard/manufacturer/inventory/data/:id', function(req,res,next){
    manufacture_inventory.find({item_id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
    });
});

// Update Retailer Status API
app.put('/smob/dashboard/retailer/req/track/update', function(req,res,next){
    let data = req.body;
    
    manufacture_request.update({req_id:data.req_id}, {$set: {status:data.status}}, function(err,data){
        if(!err)
            res.json("1 Document Updated");
            console.log("1 Document Updated");
    });
});

// POST Quoatation API
app.post('/postData/smob/retailer/quotation', function(req,res,next){
    let data = req.body;
    //console.log(data);
    retman_quotation.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});

// POST Invoice API
app.post('/postData/smob/retailer/invoice', function(req,res,next){
    let data = req.body;
    //console.log(data);
    retman_invoice.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});


// POST Purchase Order API
app.post('/postData/smob/retailer/po', function(req,res,next){
    let data = req.body;
    //console.log(data);
    retman_order.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});

// POST Payment API
app.post('/postData/smob/retailer/payment', function(req,res,next){
    let data = req.body;
    //console.log(data);
    retman_payment.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//======================== SUPPLIER ============================================

app.post('/postData/smob/supplier/dashboard/newData', function(req,res,next){
    let data = req.body;
    //console.log(data);
    item.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});

app.put('/smob/updateData', function(req,res,next){
    let data = req.body;

    request.update({req_id:data.req_id}, {$set: {status:data.status}}, function(err,data){
        if(!err)
            res.json("1 Document Updated");
            console.log("1 Document Updated");
    });
});


// ========================== SUPPLIER REQUEST TRACK ==================================

app.post('/postData/smob/supplier/track', function(req,res,next){
    let data = req.body;
    //console.log(data);
    quotation.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});


app.post('/postData/smob/supplier/invoice/track', function(req,res,next){
    let data = req.body;
    //console.log(data);
    invoice.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ LOGISTICS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// Get ALL LOGISTICS DATA
app.get('/smob/logistic/data', function(req,res,next){
    logistics.find(function(err,data){
        if(!err)
            res.json(data);
    });
});

// GET SINGLE LOGISTIC DATA
app.get('/smob/logistic/data/:id', function(req,res,next){
    logistics.find({id:req.params.id}, function(err,data){
        if(!err)
            res.json(data);
    });
});

// POST DATA OF LOGISTIC
app.post('/postData/smob/logistic/data', function(req,res,next){
    let data = req.body;
    //console.log(data);
    logistics.save(data, function(err,data){
        if(!err)
            res.json("1 Document Inserted : "+data);
    });
});

// UPDATE LOGISTIC STATUS
app.put('/smob/logistic/updateStatus', function(req,res,next){
    let data = req.body;

    logistics.update({id:data.id}, {$set: {status:data.status}}, function(err,data){
        if(!err)
            res.json("1 Document Updated");
            console.log("1 Document Updated");
    });
});

// UPDATE LOGISTIC STATUS & DATE
app.put('/smob/logistic/updateStatusDate', function(req,res,next){
    let data = req.body;

    logistics.update({id:data.id}, {$set: {status:data.status, expected_date:data.expected_date}}, function(err,data){
        if(!err)
            res.json("1 Document Updated");
            console.log("1 Document Updated");
    });
});

// ================================== SMOB ==================================

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ Hyperledger Fabric @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2

app.get('/api/hf/getData', function(req,res,next){

	var params= {};

    query(params).then(result => {res.send(result)
   })
  .catch(err => res.status(err.status).json({
     message: err.message
  }))


});


app.post('/api/hf/postData', function(req, res, next){

    var data = req.body;

    var params = {
        function : 'create',
        txid : data.txn_id
    }

    var maindata = {
        id : data.id,
        material : data.material,
        quantity : data.quantity,
        sender : data.sender,
        receiver : data.receiver,
        date : data.date,
        price : data.price

    }

    console.log(params);
    console.log(maindata);
    
    
       invoke(params, maindata).then(result=>{res.send({result:result})
   })
  .catch(err => res.status(err.status).json({
     message: err.message
  }))

});  

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//Run Server on localhost PORT:3000
app.listen(3000, () => {
    console.log("Server Running on localhost 3000");
});

