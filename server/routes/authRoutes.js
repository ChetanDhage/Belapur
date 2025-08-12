const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");
const { validateLogin } = require("../middleware/validation");

router.post("/login", validateLogin, login);
router.get("/logout", logout);

module.exports = router;
