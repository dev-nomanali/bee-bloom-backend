// const jwt = require("jsonwebtoken")
// const User = require("../models/User");

// module.exports = async function auth(req, res, next) {

//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: 'Missing token' });

//     const token = authHeader.split(' ')[1];

//     try {
//         const payload = jwt.verify(token, 'your_jwt_secret_key');
//         const user = await User.findByPk(payload.id);
//         if (!user || user.token !== token) {
//             return res.status(401).json({ message: 'Invalid or expired token here' });
//         }
//         req.user = user;
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Invalid or expired token' });
//     }

// }