// models/index.js - CORRECTED VERSION
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Orders = require('./Orders'); // Added orders model

// User <-> Cart relationship
User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems', onDelete: 'CASCADE' });

Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product <-> Cart relationship
Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });

Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = { User, Product, Cart, Orders }; // Exported orders model