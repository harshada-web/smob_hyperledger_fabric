const { main } = require("../fabcar/javascript/invoke");
router.post('/blockchain', cors(),async (req, res)=>{

    var transaction= {
        name:req.body.name,
        email:req.body.email
    }
    var params= {
        id:req.body.id,
        fun:"create",
        data:transaction
    }
       main(params).then(result=>{res.send({result:result})
   })
  .catch(err => res.status(err.status).json({
     message: err.message
  }))
      })