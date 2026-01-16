const express = require("express")
const app = express()
const dotenv = require("dotenv");
const sequelize = require("./config/Db")
const authRoutes = require("./routes/authRoute")
const cartRoutes = require("./routes/cartRoute")
const bodyParser = require('body-parser');
const cors = require('cors');
const paymentRouter = require("./routes/paymentRoute");
const basicRouter = require("./routes/basicRoute");

app.use(cors({origin: '*',methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],allowedHeaders: ['Content-Type', 'Authorization']}));

dotenv.config()

app.use(bodyParser.json());
app.use(express.json())
app.use("/api",basicRouter)
app.use("/api/auth", authRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/payment",paymentRouter)

sequelize.sync().then(() => console.log("✅ Database connected & synced")).then(() => console.log("✅ Models are  connected")
).catch(err => {
  console.error('Database connection error:', err);
});

const port = 3014;

// app.get('/',(req,res)=>{
//     res.send('Api is working fine')
// })

app.listen(port, (req, res) => {
  console.log(`app is listening at the port ${port}`);
})