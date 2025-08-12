const mongoose = require("mongoose");
const logger = require("./utils/logger");

// MongoDB connection options with security enhancements
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true, // Don't build indexes in production
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true, // Retry write operations on transient errors
  w: "majority", // Write concern: require majority of nodes to acknowledge
};

// Secure MongoDB connection function
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

    logger.info("MongoDB connected successfully");

    // Connection event listeners for better error handling
    mongoose.connection.on("connected", () => {
      logger.info("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Mongoose disconnected from DB");
    });

    // Close the Mongoose connection when Node process ends
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Middleware to check DB connection status
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    logger.error("Database connection not ready");
    return res.status(503).json({
      status: "error",
      message: "Database service unavailable",
    });
  }
  next();
};

module.exports = {
  connectDB,
  checkDBConnection,
};
