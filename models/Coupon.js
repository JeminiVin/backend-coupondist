const mongoose = require("mongoose")


// Coupon Schema



const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    status: { type: String, enum: ["available", "claimed"], default: "available" },
    claimedBy: { type: String, default: null },
    claimedAt: { type: Date, default: null }
});
const Coupon = mongoose.model("Coupon", CouponSchema);
module.exports=Coupon