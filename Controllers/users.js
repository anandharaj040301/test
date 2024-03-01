const mysql=require("mysql");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {promisify}=require("util");
const { error } = require("console");

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASS,
    database:process.env.DATABASE
});

exports.Login= async(req,res)=>{
try{
    const {email,password}=req.body;
    
    let hashedPassword=await bcrypt.hash(password,8);
    if(!email || !password){
      return res.status(400).render('Login',{msg:"Please Enter Email and Password", msg_type:"error"});
    }
    db.query("Select * from users where email=?;",[email],async (error,result)=>{
        if(error){
            console.log(error);
        }
        if(!(await bcrypt.compare(password, result[0].PASS))){
           return res.status(401).render('Login',{msg:"Email or Password Incorrect...", msg_type:"error"});
        }
        else{
            const id=result[0].ID;
            const token=jwt.sign({id:id},process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRES_IN,

            });
            console.log("token is: "+token);
            const cookieOptions= {
                expires:
                new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                httpOnly:true
            };
            res.cookie("cookie",token,cookieOptions);
            res.status(200).redirect("/Profile")
        }
                
    });
    

}catch(error){
    console.log(error);
}
};

exports.Register=(req,res)=>{

const {name,email,password,confirm_password}=req.body;

    db.query(
        "select email from users where email=?",
        [email],
        async (error,result)=>{
            if(error){
                console.log(error);
            }

            if (result.length>0){
                return res.render("Register",{msg:"* Email id alredy taken",msg_type:"error"});
            }

            else if (password!==confirm_password){
                return res.render("Register",{msg:"* Password does not match",msg_type:"error"});
            }
            let hashedPassword=await bcrypt.hash(password,8);
            //  console.log(hashedPassword); 

            db.query("insert into users set ?",{name:name,email:email,pass:hashedPassword},(error,result)=>{
                if(error){
                    console.log(error);
                }
                else{
                    console.log(result);
                    return res.render("Register",{msg:"* User registration Successful...!",msg_type:"good"})    
                }
            });
            
        });
};

exports.isLoggedIn = async (req,res,next)=>{
   // console.log(req.cookies);
    if(req.cookies.cookie){
        try{
        const decode=await promisify(jwt.verify)(
            req.cookies.cookie,
            process.env.JWT_SECRET
        );  
        console.log(decode);
        db.query("Select * from users where id=?",[decode.id], (err,result)=>{
            //console.log(result);
            if(!result){
                return next();
            }
            else{
                req.user=result[0];
                return next();
            }
        });
        }catch (error) {
           console.log(error);
             return next();
        }       
    }
    else{
        next();
    }
    
};

exports.Logout=async (req,res)=>{
res.cookie("cookie","logout",{
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
});
res.status(200).redirect("/");
};