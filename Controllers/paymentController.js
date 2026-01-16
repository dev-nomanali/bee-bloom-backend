require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Orders, Cart, Product, User } = require("../models/index");
const nodemailer = require("nodemailer");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})

const createOrder = async (req, res) => {
    try {
        const { name, email, amount, address1, address2, city, state, zipCode, altPhone, session_id } = req.body;
        if (!amount) {
            return res.status(404).json({ message: "Amount Or Payment Type is Required" })
        }

        if (!session_id) {
            return res.status(401).json({ message: "session id required" })
        }

        if (!name || !email || !address1 || !address2 || !city || !state || !zipCode || !altPhone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }


        //         if (paymentType === "COD") {
        //             let totalAmount = 0;
        //             let totalQuantity = 0;

        //             const cartItems = await Cart.findAll({
        //                 where: { session_id: session_id },
        //                 include: [{ model: Product, as: 'product', attributes: ['price'] }]
        //             });

        //             const productsWithQty = cartItems.map(item => {
        //                 const itemPrice = item.product?.price || 0;
        //                 totalAmount += itemPrice * item.quantity;
        //                 totalQuantity += item.quantity;
        //                 return { id: item.productId, quantity: item.quantity };
        //             });

        //             const order = await Orders.create({
        //                 orderId: `COD_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
        //                 name: name,
        //                 email: email,
        //                 date: new Date(),
        //                 status: 'Pending',
        //                 amount: totalAmount,
        //                 quantity: totalQuantity,
        //                 paymentType: paymentType,
        //                 productIds: JSON.stringify(productsWithQty),
        //                 address1: address1,
        //                 address2: address2,
        //                 city: city,
        //                 state: state,
        //                 zipCode: zipCode,
        //                 altPhone: altPhone,
        //                 session_id: session_id
        //             });

        //             res.status(200).json({ success: true, message: "COD order placed successfully", order });

        //             const transporter = nodemailer.createTransport({
        //                 host: process.env.SMTP_HOST,
        //                 port: process.env.SMTP_PORT || 587,
        //                 secure: false,
        //                 auth: {
        //                     user: process.env.SMTP_USER,
        //                     pass: process.env.SMTP_PASS,
        //                 },
        //             })

        //             const mailOptions = {
        //                 from: `"Kinnaur Apple" <${process.env.SMTP_USER}>`,
        //                 to: email,
        //                 subject: "Order Confirmation - Kinnaur Apple",
        //                 html: `
        //     <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        //       <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
        //         <h1 style="margin: 0;">Kinnaur Apple</h1>
        //         <p style="margin: 5px 0 0;">Fresh from the Himalayas 🍎</p>
        //       </div>
        //       <div style="padding: 25px;">
        //         <h2 style="color: #4CAF50;">Thank You for Your Order!</h2>

        //         <p>Dear <strong>Sir/Mam</strong>,</p> 

        //         <p>
        //           We’re thrilled to let you know that we’ve received your order
        //           Your fresh and juicy <strong>Kinnaur apples</strong>
        //           are being carefully packed and will be on their way to you soon.
        //         </p>    
        //         <p>
        //           You’ll receive another email once your order is shipped.
        //           Thank you for choosing <strong>Kinnaur Apple</strong> — your trust means a lot to us!
        //         </p>

        //         <p style="margin-top: 25px;">Warm regards,<br/>
        //           <strong>The Kinnaur Apple Team</strong><br/>
        //           <a href="https://kinnaurapple.com" style="color: #4CAF50; text-decoration: none;">www.kinnaurapple.com</a>
        //         </p>
        //       </div>
        //       <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #555;">
        //         © 2025 Kinnaur Apple. All rights reserved.
        //       </div>
        //     </div>
        //   `,
        //             };

        //             await transporter.sendMail(mailOptions)
        //             console.log(`📧 Order confirmation email sent to ${email}`);
        //             return;

        //         }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `rcpt_${crypto.randomBytes(3).toString("hex")}`
        }

        const order = await razorpay.orders.create(options)
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not created" })
        }
        console.log(order);

        res.status(200).json({ success: true, order })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message })

    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, session_id, email, amount } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        let totalAmount = amount / 100;
        let totalQuantity = 0;

        const cartItems = await Cart.findAll({
            where: { session_id: session_id },
            include: [{ model: Product, as: 'product', attributes: ['price'] }]
        });

        cartItems.forEach((item) => {
            totalQuantity += item.quantity;
        });

        const productsWithQty = cartItems.map(item => ({
            id: item.productId,
            quantity: item.quantity
        }));

        await Orders.create({
            orderId: razorpay_order_id,
            name: name,
            email: email,
            date: new Date(),
            status: 'New',
            amount: totalAmount,
            quantity: totalQuantity,
            paymentType: 'Online',
            productIds: JSON.stringify(productsWithQty),
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            altPhone: req.body.altPhone,
            session_id: session_id
        });

        res.status(200).json({ success: true, message: "Payment verified successfully" });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        const mailOptions = {
            from: `"Kinnaur Apple" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Order Confirmation - Kinnaur Apple",
            html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Kinnaur Apple</h1>
        <p style="margin: 5px 0 0;">Fresh from the Himalayas 🍎</p>
      </div>
      <div style="padding: 25px;">
        <h2 style="color: #4CAF50;">Thank You for Your Order!</h2>
        
        <p>Dear <strong>Sir/Mam</strong>,</p> 
        
        <p>
          We’re thrilled to let you know that we’ve received your order
          Your fresh and juicy <strong>Kinnaur apples</strong>
          are being carefully packed and will be on their way to you soon.
        </p>    
        <p>
          You’ll receive another email once your order is shipped.
          Thank you for choosing <strong>Kinnaur Apple</strong> — your trust means a lot to us!
        </p>
        
        <p style="margin-top: 25px;">Warm regards,<br/>
          <strong>The Kinnaur Apple Team</strong><br/>
          <a href="https://kinnaurapple.com" style="color: #4CAF50; text-decoration: none;">www.kinnaurapple.com</a>
        </p>
      </div>
      <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #555;">
        © 2025 Kinnaur Apple. All rights reserved.
      </div>
    </div>
  `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Order confirmation email sent to ${email}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};





const getOrders = async (req, res) => {
    try {
        const user = req.user;
        const userOrders = await Orders.findAll({
            where: { name: user.username || user.email },
            order: [['createdAt', 'DESC']]
        });

        if (!userOrders.length) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        const ordersWithProducts = [];

        for (const order of userOrders) {
            // productIds now contains objects [{id, quantity}, ...]
            const productData = Array.isArray(order.productIds)
                ? order.productIds
                : JSON.parse(order.productIds || "[]");

            const productIds = productData.map(p => p.id);

            // Fetch product details
            const products = await Product.findAll({
                where: { id: productIds },
                attributes: ["id", "name", "price", "image"]
            });

            // Attach product-specific quantities
            const productsWithQty = products.map(p => {
                const found = productData.find(pd => pd.id === p.id);
                return {
                    ...p.dataValues,
                    quantity: found ? found.quantity : 1
                };
            });

            ordersWithProducts.push(
                { orderId: order.orderId, date: order.date, status: order.status, amount: order.amount, products: productsWithQty, type: order.paymentType, address: order.address1 + order.address2 }
            );
        }

        return res.status(200).json({ success: true, orders: ordersWithProducts });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(404).json({ message: "Order id is required" })
        }

        const record = await Orders.findOne({
            where: { orderId }
        })

        if (!record) {
            return res.status(404).json({ message: "Record not found" })
        }

        const now = Date.now()
        const created = new Date(record.date).getTime()
        const hoursPassed = (now - created) / (1000 * 60 * 60);

        if (hoursPassed > 24) {
            return res.status(400).json({ success: false, message: "Order can no longer be canceled. 24 hours passed." });
        }

        record.status = "cancelled"
        await record.save();
        return res.json({ success: true, message: "Order cancelled successfully" });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}


module.exports = { createOrder, verifyPayment, getOrders, cancelOrder }