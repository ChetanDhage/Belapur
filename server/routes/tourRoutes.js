const express = require("express");
const router = express.Router();
const {
  createTourBooking,
  getTourBookings,
} = require("../controllers/tourController");
const { validateTourBooking } = require("../middleware/validation");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/", validateTourBooking, createTourBooking);
router.get("/", protect, restrictTo("admin", "super-admin"), getTourBookings);

module.exports = router;
