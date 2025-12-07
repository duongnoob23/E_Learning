const router = require("express").Router();
const ctrl = require("../controllers/paymentController");
const auth = require("../../middleware/authMiddleware");

router.post("/vnpay/create_payment", auth, ctrl.createVnpayPayment);
router.get("/vnpay_return", ctrl.vnpayReturn);

module.exports = router;
