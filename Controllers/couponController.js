const Coupon = require()

const checkCoupon = async (req, res) => {
    try {
        const { couponCode, currDate, session_id } = req.body;

        if (!session_id) {
            return res.status(404).json({ success: false, message: "session Id is required" })
        }

        if (!couponCode) {
            return res.status(400).json({ message: "Coupon is required" })
        }

        const record = await Coupon.findOne({ where: { couponCode } })
        if (!record) {
            return res.status(400).json({ message: "Invalid or Expired Coupon" })
        }

        const expiryDate = record.expiryDate

        if (currDate > expiryDate) {
            return res.status(404).json({ message: "Coupon is Expired or not Valid" })
        }

        if (couponCode == 'KNAP10') {

        }



    } catch (error) {

    }
}