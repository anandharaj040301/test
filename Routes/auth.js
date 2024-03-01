const express=require("express");
const userController=require("../Controllers/users");
const router=express.Router();

router.post('/Register',userController.Register);
router.post('/Login',userController.Login);
router.get('/Logout',userController.Logout);
module.exports=router;