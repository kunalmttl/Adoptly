// packages/backend/utils/mailer.js

const nodemailer = require('nodemailer');

// Create a reusable transporter object.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an OTP email to a user.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The one-time password.
 */
const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Adoptly Support" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Your One-Time Password for Adoptly',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Adoptly Verification</h2>
        <p>Your one-time password is valid for 10 minutes.</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
          ${otp}
        </p>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${to}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Could not send OTP email.');
  }
};

/**
 * Sends an application status update email.
 * @param {string} to - The adopter's email address.
 * @param {string} petName - The name of the pet.
 * @param {'approved' | 'rejected'} status - The new application status.
 */
const sendStatusUpdateEmail = async (to, petName, status) => {
  const subject = `Update on your application for ${petName}`;
  const body =
    status === 'approved'
      ? `<div style="font-family: sans-serif; padding: 20px;">
          <h2>Congratulations!</h2>
          <p>Your adoption application for <strong>${petName}</strong> has been approved!</p>
          <p>The pet's owner will contact you with the next steps.</p>
        </div>`
      : `<div style="font-family: sans-serif; padding: 20px;">
          <h2>Application Update</h2>
          <p>Thank you for your interest in <strong>${petName}</strong>. After careful consideration, the owner has decided to proceed with another applicant.</p>
          <p>We wish you the best of luck in finding your new companion.</p>
        </div>`;

  try {
    await transporter.sendMail({
      from: `"Adoptly Support" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: body,
    });
    console.log(`Status update email sent successfully to ${to}`);
  } catch (error) {
    console.error('Failed to send status update email:', error);
    throw new Error('Could not send status update email.');
  }
};

/**
 * Sends a contact email from one user to another.
 * @param {string} to - The recipient's email address.
 * @param {string} fromName - The sender's name.
 * @param {string} fromEmail - The sender's email for the reply-to field.
 * @param {string} subject - The email subject.
 * @param {string} message - The message content.
 */
const sendContactEmail = async (to, fromName, fromEmail, subject, message) => {
  const htmlBody = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2 style="color: #333;">New Message via Adoptly</h2>
      <p><strong>From:</strong> ${fromName}</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>
      <p style="margin-top: 20px;">You can reply directly to this email to respond.</p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"Adoptly Platform" <${process.env.EMAIL_FROM}>`,
      to,
      replyTo: fromEmail, // Allows direct replies to the sender.
      subject: `Adoptly Message: ${subject}`,
      html: htmlBody,
    });
    console.log(`Contact email sent successfully from ${fromEmail} to ${to}`);
  } catch (error) {
    console.error('Failed to send contact email:', error);
    throw new Error('Could not send contact email.');
  }
};

module.exports = {
  sendOtpEmail,
  sendStatusUpdateEmail,
  sendContactEmail,
};

