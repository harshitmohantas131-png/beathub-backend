const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { userToDTO } = require('../utils/dtos');
// 🔐 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};


// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user);
    const userDTO = userToDTO(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: userDTO
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // 2. Find user (IMPORTANT: include password)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 4. Generate token
    const token = generateToken(user);
    const userDTO = userToDTO(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userDTO
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userDTO = userToDTO(user);

    res.status(200).json({
      success: true,
      data: userDTO
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
