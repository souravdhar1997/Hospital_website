const UserModel = require('../model/User')

exports.checkEmail = (req,res,next)=>{
    UserModel.findOne({email:req.body.email})
    .then(data =>{
        if(data){
            req.flash("message2","email already exists")
            return res.redirect('/getRegistration')
        }
        const {name,email,password,cpassword}=req.body ;
        if(!(name && email && password && cpassword)){
            req.flash("message2","all inputs are required");
            return res.redirect('/getRegistration');
        }
        
        if(password !== cpassword){
            req.flash("message2","Incorrect password");
            return res.redirect('/getRegistration');
        }
        next()
    })
    .catch(err =>{
        console.log(err);
        next();
    })
}

