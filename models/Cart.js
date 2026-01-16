// models/Cart.js - CORRECTED VERSION
const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db'); // Same path as User and Product

const Cart = sequelize.define('carts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    // allowNull: false,
    allowNull: true,
    field: 'user_id' // database mein column name
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id' // database mein column name
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  session_id: {
    type: DataTypes.STRING(255), // Defines it as VARCHAR(255) in MySQL
    allowNull: true,              // Set to false if the session_id is mandatory
    unique: false                 // Set to true if you need this to be a unique identifier
    // defaultValue: 'some_default_value' // Optional default value
  }
}, {
  tableName: 'carts',
  timestamps: true,
  underscored: true // Yeh automatically snake_case use karega (created_at, updated_at)
});

module.exports = Cart;