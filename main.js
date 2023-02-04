const fs=require("fs")
const sql=require("mysql")
// const mysql=require("mysql2")
const express=require("express")
const main=express();
const path=require("path");
const bodyParser = require("body-parser");

main.set('view engine', 'ejs')
main.set('views', path.join(__dirname, 'views'))

main.use(bodyParser.urlencoded({extended:true}))

main.get("/",(req,res)=>{
    res.render("sign.ejs")  
})
main.get("/login",(req,res)=>{
    res.render("external.ejs")
})

const pool = sql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"system",
    // connectionLimit:10
})

main.post("/main.js",(req,res)=>{
    // res.send("this is the register dir")
    // const user_id=Date.now().toString;
    const username=req.body.Username
     const email=req.body.Email
     const password=req.body.Password

pool.getConnection((err,conn) =>{
    if(err){
        console.log("There was an error connecting to the database")
    }
    const query= 'INSERT INTO user (Username,Email,Password) VALUES (?,?,?)';
    conn.query(query,[username,email,password],(err)=>{
        if(err) throw err;
        console.log("data inserted successfully");
    })
    // conn.release();
    res.redirect('/login')
})
})
let credentials= 0;
main.post("/login",(req,res)=>{
    pool.query('SELECT * FROM user where email=?',req.body.email,(err,results)=>{
        if(err) throw err;
        credentials=results;
        if(credentials[0].email == req.body.Email && credentials[0].Password == req.body.password) {
            res.redirect("/profile")
        }
        else{
            res.send("Untrue credentials , re-enter accordingly")
        }
    })
})
main.get("/profile",(req,res)=>{
    res.render("profile")
})
main.post("/profile",(req,res)=>{

    pool.query(`UPDATE user SET Username = '${req.body.newusername}', Email = '${req.body.newemail}' WHERE Email=?`,credentials[0].Email,(err , data) => {
        if (err) throw err
        res.send('Successfully changed the username and email!')
    })
})
main.post


main.listen(2424,()=>{
    console.log("connected at 2424")
})
