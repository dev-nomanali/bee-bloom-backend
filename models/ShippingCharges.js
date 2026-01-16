const sequelize = require("../config/Db");
const { DataTypes } = require("sequelize");

const ShippingCharges = sequelize.define("shippingCharges", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    charges: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }

}, {
    tableName: "shippingcharges",
    timestamps: true                
});

module.exports = ShippingCharges