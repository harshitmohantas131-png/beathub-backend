const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

router.post("/register", register);
router.post("/login", login);

router.get('/profile', authenticate, authController.getProfile);

module.exports = router;