const { DataTypes } = require("sequelize")
const sequelize = require("../config/Db")

const Page = sequelize.define("pages",{
    key:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    content:{
        type:DataTypes.TEXT("long"),
        allowNull:false
    }
})

module.exports = Page