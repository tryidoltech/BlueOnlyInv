const nodemailer = require("nodemailer");
const errorHanler = require("../error/errorHandler");

exports.sendmail = (req,res,next,url)=>{
const transport  = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    post:465,
    auth:{
        user:process.env.NODE_MAIL,
        pass:process.env.MAIL_PASS
    }
})
const mailoption = {
    from:"Garvit Jain pvt.lmtd",
    to:req.body.email,
    subject :"Password Reset Link ",
    // text:"Click the below link",
    html:`
    <h1>Click Link Below to reset your password</h1> <br/>
    <a href="${url}">Password Reset Link</a>
    `

}
transport.sendMail(mailoption,(err,info)=>{
    if(err) return next(new errorHanler(err,500))
    console.log(info);
return res.status(200).json({
    message:"Mail send successfully",
    url
})
})
}