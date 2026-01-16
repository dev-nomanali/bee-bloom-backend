const { where } = require("sequelize");
const Page = require("../models/Page")


const getPage = async (req, res) => {
    try {
        const { key } = req.params;
        if (!key) {
            return res.status(400).json({ message: "Page not found in param" })
        }

        const record = await Page.findOne({
            where: { key }
        })

        if (!record) {
            return res.status(204).json({ message: "Record not found" })
        }

        res.status(200).json({ message: "Record found successfully", record })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Sever Error", error: error });

    }
}


module.exports = getPage