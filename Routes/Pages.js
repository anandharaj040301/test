const express=require('express');
const router=express.Router();
const userController=require("../Controllers/users");

router.get("/",(req,res)=>{
res.render("Home");
});

router.get("/Home", userController.isLoggedIn, (req,res)=>{
if(req.user){
    
    res.render("Home",{user:req.user});
}
else{
    res.redirect("/");
    }

});
    
router.get("/Login",(req,res)=>{
res.render("Login");

});
    
router.get("/Register",(req,res)=>{
res.render("Register");
});
    
router.get("/Profile", userController.isLoggedIn, (req,res)=>{
if(req.user){
    
    res.render("Profile",{user:req.user});
}
else{
res.redirect("/Login");
}

});

router.get("/Logout",(req,res)=>{
res.status(200).clearCookie('cookie',{
    path:'/'
});
req.session.destroy(function (err) {
    res.redirect('/');
  });
});


module.exports=router;