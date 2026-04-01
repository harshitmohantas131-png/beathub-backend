const express= require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const user = new User(req.body);
    await user.save();

    console.log("USER SAVED:", user);

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;