const { DataTypes } = require("sequelize");
const sequelize = require("../config/Db")

const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true
    },
    resetOtp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetOtpExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
    phone:{
        type:DataTypes.BIGINT,
        allowNull:false,
    },
    address:{
        type:DataTypes.STRING(500),
        allowNull:false
    }
});

module.exports = User;
