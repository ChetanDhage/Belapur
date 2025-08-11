const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendBookingConfirmation = async ({ to, name, plan, bookingId }) => {
  try {
    const mailOptions = {
      from: `"Tour Booking System" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Your Tour Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748;">Hello ${name},</h2>
          <p>Thank you for booking a tour with us for the <strong>${plan}</strong> plan.</p>
          <p>Your booking reference is: <strong>${bookingId}</strong></p>
          <p>We'll contact you shortly to confirm your tour details.</p>
          <br>
          <p>Best regards,</p>
          <p>The Tour Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};