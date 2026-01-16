
const { where } = require('sequelize');
const { Cart, Product } = require('../models/index');
const Coupon = require("../models/Coupon")
const ShippingCharges = require("../models/ShippingCharges")

exports.addsToCart = async (req, res) => {
    try {
        const { quantity, productId, session_id } = req.body;
        if (!session_id) {
            return res.status(404).json({ success: false, message: "UserId is required" })
        }

        if (!productId) {
            return res.status(404).json({ success: false, message: "ProductId is required" })
        }

        const product = await Product.findByPk(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        let cartItem = await Cart.findOne({ where: { session_id, productId } })

        if (cartItem) {
            cartItem.quantity = parseInt(cartItem.quantity) + parseInt(quantity);
            await cartItem.save()
            return res.status(200).json({ message: "Quantity updated successfully" })
        } else {
            const newItem = await Cart.create({ session_id, productId, quantity: quantity })
            return res.status(200).json({ message: "Product added to cart", item: newItem })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went wrong" })
    }
}


exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, session_id } = req.body;

        if (!session_id) {
            return res.status(404).json({ success: false, message: "Session id is required" })
        }
        if (!productId) {
            return res.status(404).json({ success: false, message: "ProductId is required" })
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        const cartItem = await Cart.findOne({
            where: { session_id, productId }
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.json({ message: "Cart item updated successfully", updatedItem: cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// exports.getCart = async (req, res) => {
//     try {
//         const { session_id, couponCode, currDate, } = req.query
//         if (!session_id) {
//             return res.status(404).json({ success: false, message: "UserId is required" })
//         }

//         const cartItems = await Cart.findAll({
//             where: { session_id }, include: [{
//                 model: Product, as: 'product',
//                 attributes: ['id', 'name', 'price', 'image', 'description', 'quantity', 'weight']
//             }],
//             order: [['createdAt', 'DESC']]
//         });


//         if (!cartItems.length) {
//             return res.json({ message: "Your Cart is empty" })
//         }

//         let subtotal = 0;
//         let totalShippingCharges = 0;

//         let formattedCart = cartItems.map((item) => {
//             const itemTotal = item.product.price * item.quantity
//             subtotal = subtotal + itemTotal;

//             const weight = parseFloat(item.product.weight)
//             const shippingCharges = weight * item.quantity * 7;
//             totalShippingCharges += shippingCharges;

//             return {
//                 id: item.id,
//                 session_id: item.session_id,
//                 productId: item.productId,
//                 quantity: item.quantity,
//                 createdAt: item.createdAt,
//                 updatedAt: item.updatedAt,
//                 product: {
//                     id: item.product.id,
//                     name: item.product.name,
//                     price: item.product.price,
//                     image: item.product.image,
//                     description: item.product.description,
//                     quantity: item.product.quantity,
//                     weight: item.product.weight,
//                 },
//                 itemTotal: itemTotal,
//                 shippingCharges
//             }

//         })

//         let finalAmount = subtotal + totalShippingCharges;
//         let discountAmount = 0;

//         if (couponCode) {
//             const coupon = await Coupon.findOne({ where: { couponCode } });
//             if (!coupon) {
//                 return res.status(400).json({ message: "Invalid or Expired Coupon" });
//             }

//             const today = new Date().toISOString().split("T")[0]
//             if (today < coupon?.ValidFrom) {
//                 return res.status(400).json({ message: "Coupon in not valid yet" })
//             }

//             if (today > coupon?.ValidTo) {
//                 return res.status(400).json({ message: "Coupon is Expired" })
//             }

//             if (coupon?.discountPercent) {
//                 discountAmount = (subtotal * coupon?.discountPercent) / 100
//             }

//             finalAmount = (subtotal - discountAmount) + totalShippingCharges;

//         }

//         return res.status(200).json({
//             success: true,
//             data: {
//                 items: formattedCart,
//                 summary: {
//                     totalItems: cartItems.length,
//                     totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),

//                     subtotal,
//                     totalShippingCharges,

//                     couponApplied: couponCode || null,
//                     discount: discountAmount,

//                     totalAmount: finalAmount,
//                     grossAmount: subtotal + totalShippingCharges

//                 }
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }


// ------------------------------------------------

exports.getCart = async (req, res) => {
    try {
        const { session_id, couponCode, currDate } = req.query;

        if (!session_id) {
            return res.status(404).json({ success: false, message: "UserId is required" });
        }

        const cartItems = await Cart.findAll({
            where: { session_id },
            include: [{
                model: Product, as: 'product',
                attributes: ['id', 'name', 'price','discount_price','image', 'description', 'quantity', 'weight']
            }],
            order: [['createdAt', 'DESC']]
        });

        if (!cartItems.length) {
            return res.json({ message: "Your Cart is empty" });
        }

        let subtotal = 0;
        let totalShippingCharges = 0;
        const formattedCart = [];

        // Process each cart item
        for (const item of cartItems) {
            const itemTotal = Number(item.product.discount_price) * Number(item.quantity);
            subtotal += itemTotal;
            const weight = parseFloat(item.product.weight) || 0;
            const shippingChargeRecord = await ShippingCharges.findOne({
                where: { weight }
            });

            const shippingCharge = shippingChargeRecord ? Number(shippingChargeRecord.charges) : 0;
            const shippingChargesForItem = shippingCharge * Number(item.quantity);
            totalShippingCharges += shippingChargesForItem;

            formattedCart.push({
                id: item.id,
                session_id: item.session_id,
                productId: item.productId,
                quantity: item.quantity,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    discount_price : item?.product?.discount_price,
                    image: item.product.image,
                    description: item.product.description,
                    quantity: item.product.quantity,
                    weight: item.product.weight,
                },
                itemTotal: itemTotal,
                shippingCharges: shippingChargesForItem
            });
        }

        // Ensure numeric values
        subtotal = Number(subtotal);
        totalShippingCharges = Number(totalShippingCharges);

        let discountAmount = 0;
        let finalAmount = subtotal + totalShippingCharges;

        // Coupon validation
        if (couponCode) {
            const coupon = await Coupon.findOne({ where: { couponCode } });
            if (!coupon) {
                return res.status(400).json({ message: "Invalid or Expired Coupon" });
            }

            const todayStr = currDate 
                ? new Date(currDate).toISOString().split("T")[0] 
                : new Date().toISOString().split("T")[0];

            const validFrom = coupon.ValidFrom instanceof Date
                ? coupon.ValidFrom.toISOString().split("T")[0]
                : String(coupon.ValidFrom).split("T")[0];

            const validTo = coupon.ValidTo instanceof Date
                ? coupon.ValidTo.toISOString().split("T")[0]
                : String(coupon.ValidTo).split("T")[0];

            if (todayStr < validFrom) {
                return res.status(400).json({ message: "Coupon is not valid yet" });
            }

            if (todayStr > validTo) {
                return res.status(400).json({ message: "Coupon has expired" });
            }

            if (coupon.discountPercent) {
                discountAmount = (subtotal * Number(coupon.discountPercent)) / 100;
            }

            finalAmount = (subtotal - discountAmount) + totalShippingCharges;
        }

        return res.status(200).json({
            success: true,
            data: {
                items: formattedCart,
                summary: {
                    totalItems: cartItems.length,
                    totalQuantity: cartItems.reduce((sum, item) => sum + Number(item.quantity), 0),
                    subtotal: Number(subtotal.toFixed(2)),
                    totalShippingCharges: Number(totalShippingCharges.toFixed(2)),
                    couponApplied: couponCode || null,
                    discount: Number(discountAmount.toFixed(2)),
                    totalAmount: Number(finalAmount.toFixed(2)),
                    grossAmount: Number((subtotal + totalShippingCharges).toFixed(2))
                }
            }
        });

    } catch (error) {
        console.error('Cart Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { session_id } = req.query;
        const { productId } = req.params;

        if (!session_id) {
            return res.status(404).json({ success: false, message: "Sesssion id is required" })
        }

        if (!productId) {
            return res.status(404).json({ success: false, message: "ProductId is required" })
        }

        const removedItem = await Cart.destroy({ where: { session_id, productId } })
        if (!removedItem) {
            return res.status(404).json({ success: false, message: "Item not deleted" })
        }

        res.status(200).json({ success: true, message: "Item Deleted successfully", removedItem })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went wrong" })
    }
}



exports.clearUserCart = async (req, res) => {
    try {
        const { session_id } = req.query
        if (!session_id) {
            return res.status(404).json({ success: false, message: "Session id is required" })
        }
        const deleted = await Cart.destroy({ where: { session_id } })
        return res.status(200).json({ success: true, message: 'Cart cleared successfully', itemsRemoved: deleted });

    } catch (error) {
        console.error('Clear cart error:', error);
        return res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
    }
}