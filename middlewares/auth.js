const jwt = require("jsonwebtoken");
const errorHanler = require("../error/errorHandler");
const { CatchAsyncErrors } = require("./CatchAsyncerror");
const User = require("../models/userModel");
// const { token } = require("morgan");

exports.isAuthenticated = CatchAsyncErrors(async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new errorHanler("Please log in to access this resource", 401));
  }

  // Extract the token (remove 'Bearer ' from the beginning)
  const token = authHeader.split(" ")[1];

  if (!token || token === "null") {
    return next(new errorHanler("Please log in to access this resource", 401));
  }

  // Verify the token
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // Attach the user data to the request object
  req.user = await User.findById(decodedData.id);

  next();
});

exports.new = () => {};
// exports.isAuthenticated = CatchAsyncErrors(async (req,res,next)=>{

//    const {userToken} = req.cookies
//     if(!userToken){
//         return next(
//             new errorHanler("User Please login to Access",401)
//         )
//     }
//     const { id } = jwt.verify(userToken,process.env.JWT_SECRET);
//     req.id = id

//     next();
// })

// exports.isAuthenticatedOwner = CatchAsyncErrors(async (req,res,next)=>{
//    const {ownerToken} = req.cookies
//     if(!ownerToken){
//         return next(
//             new errorHanler("Owner Please login to access",401)
//         )
//     }
//     const { id } = jwt.verify(ownerToken,process.env.JWT_SECRET);
//     req.id = id

//     next();
// })
