const sequelize = require("../config/Db");
const { DataTypes } = require("sequelize");

const Coupon = sequelize.define("coupons", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    couponCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },

    discountPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
    },

    ValidTo: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    
    ValidFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }

}, {
    tableName: "coupons",
    timestamps: true      // createdAt & updatedAt auto managed
});

module.exports = Coupon