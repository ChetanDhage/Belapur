const jwt = require("jsonwebtoken");
const { ErrorResponse } = require("../utils/errorResponse");
const logger = require("../utils/logger");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this resource", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    logger.error(`Authentication error: ${err.message}`);
    next(new ErrorResponse("Not authorized to access this resource", 401));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          "You do not have permission to perform this action",
          403
        )
      );
    }
    next();
  };
};
