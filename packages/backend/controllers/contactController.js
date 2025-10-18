// # Contact Controller

const User              = require('../models/user_model');
const { sendContactEmail } = require('../utils/mailer');

const sendEmail = async (req, res) => {

  try {
    const { recipientId, subject, message } = req.body;
    const sender = req.user; // Set by the isLoggedIn middleware

    // ! Validate input
    if (!recipientId || !subject || !message) {
      return res.status(400).json({ message: 'Recipient, subject, and message are required.' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }

    // * Send the email using our mailer utility
    await sendContactEmail(recipient.email, sender.name, sender.email, subject, message);

    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (_error) {
    console.error("! Error in sendEmail controller:", _error);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
};

module.exports = { sendEmail };
