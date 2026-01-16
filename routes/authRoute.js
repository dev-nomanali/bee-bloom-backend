const express = require("express");
const router = express.Router();
const { getAllProduct, getProductById, serachProduct } = require("../Controllers/productController");

router.get("/getAll", getAllProduct);
router.get("/:id",getProductById);
router.get('/product/search', serachProduct);

module.exports = router