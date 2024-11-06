const errorHanler = require("../error/errorHandler");
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");

exports.sendToken = (user, statusCode, res) => {
  // const token = user.getjwttoken();
  // const options = {
  //   expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  //   maxAge: 1000 * 60 * 60 * 5,
  // };
  // res
  //   .status(statusCode)
  //   .cookie("userToken", token, options)
  //   .json({ success: true, id: user._id, token });
  const token = user.getjwttoken();


  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 5,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, id: user._id, token });
};
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return next(
              new errorHanler(
                  `Role: ${req.user.role} is not allowed to access this resouce `,
                  403
              )
          );
      }

      next();
  };
};