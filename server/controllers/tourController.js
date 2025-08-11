const TourBooking = require('../models/TourBooking');
const logger = require('../utils/logger');
const { sendBookingConfirmation } = require('../config/emailConfig');

exports.createTourBooking = async (req, res, next) => {
  try {
    const { name, email, phone, plan, message } = req.body;
    
    const newBooking = await TourBooking.create({
      name,
      email,
      phone,
      plan,
      message
    });

    // Send confirmation email
    await sendBookingConfirmation({
      to: email,
      name,
      plan,
      bookingId: newBooking._id
    });
    
    logger.info(`New tour booking created: ${newBooking._id}`);
    
    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking
      }
    });
  } catch (error) {
    logger.error('Error creating tour booking:', error);
    next(error);
  }
};

exports.getTourBookings = async (req, res, next) => {
  try {
    const bookings = await TourBooking.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings
      }
    });
  } catch (error) {
    logger.error('Error fetching tour bookings:', error);
    next(error);
  }
};