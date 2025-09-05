const express = require("express"); 
const router = express.Router();

const controller = require("../controllers/authClientController");

router.post("/login", controller.login);

router.post("/register", controller.register);

router.post("/verifyOtp/:type", controller.verifyOtp);

router.post("/forget-password", controller.forgetPassword);

module.exports = router;
