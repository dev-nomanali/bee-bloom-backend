const Product = require("../models/Product.js")
const { Op, where } = require("sequelize")

const getAllProduct = async (req, res) => {
    try {
        const allProducts = await Product.findAll();
        if (!allProducts) {
            return res.status(404).json({ message: "Products not found" })
        }
        res.status(201).json(allProducts)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({ message: "Id Not Found" })
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(401).json({ message: "Product  Not Found" })
        }

        res.status(200).json(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

const serachProduct = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(404).json({ message: "Name is Required" })
        }

        const record = await Product.findAll({
            where: {
                name: { [Op.like]: `%${name}%` }
            }
        });


        if (!record) {
            return res.status(404).json({ message: "Record not found" })
        }
        res.status(200).json({ message: "Record found successfully", record })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = { getAllProduct, getProductById, serachProduct }