const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Extract token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in. Please log in to get access."
      });
    }

    // 3️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Your token has expired"
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // 4️⃣ Check user exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    // 5️⃣ Attach user
    req.user = currentUser;

    next();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};

module.exports = authenticate;