// # Contact Controller

import User from '../models/user_model.js';
import { sendContactEmail } from '../utils/mailer.js';

/**
 * * Handles sending an email from the logged-in user to another user.
 */
export const sendEmail = async (req, res) => {
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