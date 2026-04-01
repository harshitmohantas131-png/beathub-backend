const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    // 1️⃣ Check if user exists (from authenticate)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in"
      });
    }

    // 2️⃣ Check role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    // 3️⃣ Allow access
    next();
  };
};

module.exports = authorize;