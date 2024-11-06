const Bill = require("../models/BillModel.js");

const errorHanler = require("../error/errorHandler");
const { sendToken } = require("../jwt/sendToken");
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");

const User = require("../models/userModel.js");

const { sendmail } = require("../nodemailer/nodemailer");
const path = require("path");
exports.user = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.find().exec();

  res.json({ message: "This is user Data", userData });
});
exports.registerUser = CatchAsyncErrors(async (req, res, next) => {
  const userModel = await new User(req.body).save();
  sendToken(userModel, 200, res);
});
exports.userData = CatchAsyncErrors(async (req, res, next) => {
  console.log("====================================");
  console.log(req.user.id);
  console.log("====================================");
  const userModel = await User.findById(req.user.id).exec();
  res.json({
    userModel,
    authenticated: true,
  });
});
exports.loginUser = CatchAsyncErrors(async (req, res, next) => {
  const userModel = await User.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!userModel) return next(new errorHanler("User not found", 500));
  const isMatch = userModel.comparepassword(req.body.password);

  if (!isMatch) return next(new errorHanler("Wrong password", 500));
  if (userModel.role !== "admin")
    return next(new errorHanler("Wrong Credentials", 500));
  sendToken(userModel, 201, res);
});
exports.signout = CatchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()), // Immediate expiration
    httpOnly: true,
    secure: true, // Uncomment if using HTTPS
    sameSite: "None", // Adjust this as per your requirement
  });
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
exports.sendMail = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.findOne({ email: req.body.email }).exec();
  console.log(userData);
  if (!userData) {
    return next(new errorHanler("User with this email does not exist ", 404));
  }
  const url = `http://localhost:3000/user/forgetlink/${userData._id}`;
  userData.resetpasswordToken = "1";
  userData.save();
  console.log(userData.resetpasswordToken);

  sendmail(req, res, next, url);
  res.json({ userData, url });
});
exports.changePassword = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.findById({ _id: req.params.id }).exec();

  if (!userData) {
    next(new errorHanler("User not exist"), 500);
  }

  if (userData.resetpasswordToken === "1") {
    userData.password = req.body.password;
    userData.resetpasswordToken = "0";
    userData.save();

    res.status(200).json({
      message: "Password Change Succesfully",
    });
  } else {
    res.status(400).json({
      message: "Link Expired",
    });
  }
});
exports.resetPassword = CatchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const userData = await User.findById({ _id: req.id }).select("+password");
  const isMatch = userData.comparepassword(req.body.oldpassword);
  console.log(userData);
  if (!isMatch) return next(new errorHanler("Wrong password", 500));
  if (isMatch) {
    userData.password = req.body.newpassword;
    await userData.save();
    sendToken(userData, 201, res);
  }
  res.status(200).json({ message: "Password is changed succesfully" });
});
exports.UpdateData = CatchAsyncErrors(async (req, res, next) => {
  // console.log("hello");
  const userData = await User.findByIdAndUpdate(req.id, req.body).exec();

  res.status(200).json({ message: "user updated successfully" });
});
exports.avatarupload = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.findById(req.id).exec();

  const file = req.files.avatar;
  const modifiedFileName = `demoImage-${Date.now()}${path.extname(file.name)}`;
  if (userData.avatar.fileId !== "") {
    await imagekit.deleteFile(userData.avatar.fileId);
  }
  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });
  userData.avatar = { fileId, url };
  await userData.save();
  res.json({ message: "Profile Image uploaded" });
});
exports.uploadBill = CatchAsyncErrors(async (req, res, next) => {
  try {
    const bill = await new Bill(req.body).save();
    const user = await User.findById(req.user.id);
    bill.user = user._id;
    user.bills.push(bill._id);
    await bill.save();
    await user.save();
    res.status(201).json({
      success: true,
      message: "Bill Saved Successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

exports.getAllBill = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("bills");

    res.status(200).json({
      bill: user.bills,
    });
  } catch (error) {
    res.send({
      error,
    });
  }
});
exports.getBillById = CatchAsyncErrors(async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    res.status(200).json({
      bill,
    });
  } catch (error) {
    res.error({
      error,
    });
  }
});
exports.deleteBill = CatchAsyncErrors(async (req, res, next) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
        success: false,
      });
    }
    const user = await User.findById(req.user.id);
    const updatedBills = user.bills.filter(
      (i) => i.toString() !== req.params.id
    );
    console.log(updatedBills);
    user.bills = updatedBills;
    await user.save();
    res.status(200).json({
      message: "Bill Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    
    res.json({
      error
    });
  }
});
