const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Coupon = require("../models/Coupon")
const adminAuth = require("../middleware/adminAuth")
const COOLDOWN_PERIOD = 10 * 60 * 1000;

const JWT_SECRET = "vinayakiscools"; // Use a strong secret key

// ✅ Register a New Admin
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new admin
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
});

// ✅ Admin Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username: admin.username, role: "admin" }, JWT_SECRET, { expiresIn: "2h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});


// Guest User Claim Coupon
router.get("/claim", async (req, res) => {
  const userIP = req.ip;
  const userSession = req.cookies.session_id || Math.random().toString(36).substring(7);

  const lastClaim = await Coupon.findOne({ claimedBy: userIP }).sort({ claimedAt: -1 });
  if (lastClaim && new Date() - lastClaim.claimedAt < COOLDOWN_PERIOD) {
      return res.status(429).json({ message: "You must wait before claiming another coupon." });
  }

  const coupon = await Coupon.findOne({ status: "available" });
  if (!coupon) return res.status(404).json({ message: "No available coupons" });

  coupon.status = "claimed";
  coupon.claimedBy = userIP;
  coupon.claimedAt = new Date();
  await coupon.save();

  res.cookie("session_id", userSession, { maxAge: COOLDOWN_PERIOD, httpOnly: true });
  res.json({ message: "Coupon claimed successfully", coupon: coupon.code });
});

// Admin: View Coupons
router.get("/admin/coupons", adminAuth, async (req, res) => {
    const coupons = await Coupon.find();
    res.json(coupons);
});

// Admin: Add Coupons
router.post("/admin/coupons", adminAuth, async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const newCoupon = new Coupon({ code });
    await newCoupon.save();
    res.status(201).json({ message: "Coupon added successfully", coupon: newCoupon });
});


module.exports = router;
