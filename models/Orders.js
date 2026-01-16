const sequelize = require("../config/Db")
const { DataTypes } = require("sequelize")

// Added explicit model definition with table metadata
const Orders = sequelize.define('orders', {
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productIds: {
        type: DataTypes.JSON,
        allowNull: false
    },
    address1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    altPhone: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    session_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:false
    }

}, {
    tableName: 'orders',
    timestamps: true
})

module.exports = Orders