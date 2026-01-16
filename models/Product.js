const sequelize = require("../config/Db");
const { DataTypes } = require("sequelize")

const Product = sequelize.define("products", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    discount_price:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    weight:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    Availability:{
        type:DataTypes.STRING,
        allowNull:false
    },
})

module.exports = Product