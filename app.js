const express=require('express');
const mysql=require('mysql');
const dotenv=require('dotenv');
const path=require('path');
const hbs=require('hbs');
const cookieParser=require('cookie-parser')

const app=express();
dotenv.config({
    path:"./.env"
});

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASS,
    database:process.env.DATABASE,
    port:3306
});

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('Connection Successful');
    }
});

app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

const location=path.join(__dirname,"./public");
app.use(express.static(location));
app.set("view engine","hbs");

const partialPath=path.join(__dirname,"./views/partials");
hbs.registerPartials(partialPath);


app.use('/',require("./Routes/Pages"));

app.use('/auth',require("./Routes/auth"));
    

app.listen(5000,()=>{
console.log("Server Started");
}); 