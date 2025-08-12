const { body, validationResult } = require("express-validator");
const { ErrorResponse } = require("../utils/errorResponse");

exports.validateTourBooking = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage("Please provide a valid phone number"),

  body("plan")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Plan is required")
    .isIn(["Individual Desk", "Dedicated Desk"])
    .withMessage("Invalid plan selected"),

  body("message")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 500 })
    .withMessage("Message cannot be more than 500 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }
    next();
  },
];

exports.validateLogin = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password").trim().notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }
    next();
  },
];
