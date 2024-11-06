const express = require("express");
const {
  user,
  registerUser,
  signin,
  signout,
  userData,
  sendMail,
  changePassword,
  resetPassword,
  UpdateData,
  avatarupload,
  loginUser,
  getAllListings,
  addListing,
  uploadBill,
  getAllBill,
  getBillById,
  deleteBill,
} = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/auth");
const { authorizeRoles } = require("../jwt/sendToken");

const router = express.Router();

router.get("/", user);
// user data
router.get("/user", isAuthenticated, authorizeRoles("admin"), userData);
// login
router.post("/register", registerUser);
// POST signIn
router.post("/signin", loginUser);
// GET SIGNOUT
router.get("/logout", isAuthenticated, signout);
// reset password
router.post("/reset/password", isAuthenticated, resetPassword);
// password changed
router.post("/forgetlink/:id", changePassword);
// Upload Bill
router.post("/upload/bill",isAuthenticated,authorizeRoles("admin"),uploadBill)
// get all bills
router.get("/get/bill",isAuthenticated,getAllBill)
// get bill by id
router.get("/get/bill/:id",isAuthenticated,getBillById)
// Delete Bill
router.get("/delete/bill/:id",isAuthenticated,authorizeRoles("admin"),deleteBill)
router.get('/api/set-test-cookie', (req, res) => {
  res.cookie('testcookie', 'testvalue', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // True in production
    sameSite: 'None', // Required for cross-domain cookies
    maxAge: 5 * 60 * 1000, // 5 minutes
  });
  res.status(200).json({ success: true });
});
module.exports = router;
