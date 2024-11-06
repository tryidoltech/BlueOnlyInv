require("dotenv").config({path:"./.env"})
const express = require("express");
const app = express()

// db
require("./models/database.js").connectedDatabase()
// logger
const logger = require("morgan");
const allowedOrigins = ["http://localhost:5173","https://blueonly.vercel.app"];

// bodyparser
app.use(express.json());
app.use(express.urlencoded({extended:false}))
// cookie
const session = require("express-session")


const cookieParser = require("cookie-parser")
app.use(
    session({
        resave:false,
       saveUninitialized:true,
       secret:process.env.SESSION_SECRET
    })
)

// cors for conection
const cors = require("cors");
app.use(cors({origin:allowedOrigins,credentials:true}))
app.use(cookieParser())
// file upload
const fileupload = require("express-fileupload");
app.use(fileupload());
// error
const errorHanler = require("./error/errorHandler.js");
const { generatedErrror } = require("./middlewares/error.js");
app.use(logger("tiny"))

  

// routes
app.use("/api/v1/user",require("./routes/indexRoute.js" ))
// 
// error handeling



app.all("*",(req,res,next)=>{
    next(new errorHanler(`requested url not found ${req.url}`,404))
})
app.use(generatedErrror)



  


// SERVER PORT
app.listen(process.env.PORT,console.log(`port is running on ${process.env.PORT}`))