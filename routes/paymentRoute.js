const express = require("express")
const { createOrder, verifyPayment, cancelOrder } = require("../Controllers/paymentController")
const paymentRouter = express.Router()

paymentRouter.post("/create-order",createOrder)
paymentRouter.post("/verify-payment",  verifyPayment);
paymentRouter.post("/cancel-order/:orderId", cancelOrder)

module.exports = paymentRouter;