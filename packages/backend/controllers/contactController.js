// packages/backend/controllers/contactController.js

const User = require('../models/user_model');
const { sendContactEmail } = require('../utils/mailer');

// Send a contact email from one user to another.
const sendEmail = async (req, res) => {
  try {
    const { recipientId, subject, message } = req.body;
    const sender = req.user; // Attached by authentication middleware.

    if (!recipientId || !subject || !message) {
      return res.status(400).json({ message: 'Recipient, subject, and message are required.' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }

    await sendContactEmail(recipient.email, sender.name, sender.email, subject, message);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error in sendEmail controller:', error);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
};

module.exports = { sendEmail };