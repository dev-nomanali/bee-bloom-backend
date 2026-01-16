const express = require("express");

const cartRouter = express.Router();

const { addsToCart, removeFromCart, getCart, updateCartItem, clearCart, clearUserCart } = require("../Controllers/cartController")

cartRouter.delete("/clear", clearUserCart)
cartRouter.post("/add", addsToCart)
cartRouter.get("/getcart", getCart)
cartRouter.delete("/:productId", removeFromCart)
cartRouter.put("/update/:productId", updateCartItem)



module.exports = cartRouter