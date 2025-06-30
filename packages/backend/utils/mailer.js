// # Nodemailer Email Utility

const nodemailer = require('nodemailer');

// * Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


/**
 * * Sends an OTP email to a user.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The one-time password to send.
 * @returns {Promise<void>}
 */
const sendOtpEmail = async (to, otp) => 
{
  try 
  {
    const mailOptions = 
    {
      from: `"Adoptly Support" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: 'Your One-Time Password for Adoptly',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Adoptly Verification</h2>
          <p>Here is your one-time password. It is valid for 1 minute.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
            ${otp}
          </p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`* OTP email sent successfully to ${to}`);
  } catch (_error) {
    console.error("! Failed to send OTP email:", _error);
    // ? In a production app, you might want to throw this error to be handled by the controller
  }
};


/*
 * * NEW: Sends an email to an adopter about their application status update.
 * @param {string} to - The adopter's email address.
 * @param {string} petName - The name of the pet they applied for.
 * @param {'approved' | 'rejected'} status - The new status of the application.
 * @returns {Promise<void>}
 */

const sendStatusUpdateEmail = async (to, petName, status) => 
{
  const subject = `Update on your application for ${petName} | Adoptly`;
  const body = status === 'approved'
    ? `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Congratulations!</h2>
          <p>We are thrilled to inform you that your adoption application for <strong>${petName}</strong> has been approved!</p>
          <p>The pet's owner will be in touch with you shortly to arrange the next steps.</p>
          <p>Thank you for choosing to adopt.</p>
        </div>
      `
    : `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Application Update</h2>
          <p>Thank you for your interest in adopting <strong>${petName}</strong>.</p>
          <p>After careful consideration, the owner has decided to proceed with another applicant at this time. We understand this can be disappointing, but we encourage you to continue browsing other wonderful pets on Adoptly.</p>
          <p>We wish you the best of luck in finding your new companion.</p>
        </div>
      `;

  try 
  {
    await transporter.sendMail(
    {
      from: `"Adoptly Support" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: body,
    });
    console.log(`* Status update email sent successfully to ${to}`);
  } catch (_error) {
    console.error("! Failed to send status update email:", _error);
  }
};


/**
 * * NEW: Sends a contact email from one user to another via the platform.
 * @param {string} to - The recipient's email address.
 * @param {string} fromName - The sender's name.
 * @param {string} fromEmail - The sender's email (for the reply-to field).
 * @param {string} subject - The subject of the email.
 * @param {string} message - The user's message content.
 * @returns {Promise<void>}
 */
const sendContactEmail = async (to, fromName, fromEmail, subject, message) => {
  const htmlBody = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333;">New Message via Adoptly</h2>
      <p>You have received a new message regarding: <strong>${subject}</strong></p>
      <hr style="border-top: 1px solid #eee;">
      <p><strong>From:</strong> ${fromName}</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>
      <p style="margin-top: 20px;">You can reply directly to this email to respond to ${fromName}.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Adoptly Platform" <${process.env.EMAIL_FROM}>`,
      to: to,
      replyTo: fromEmail, // ! This allows the recipient to reply directly to the sender.
      subject: `Adoptly Message: ${subject}`,
      html: htmlBody,
    });
    console.log(`* Contact email sent successfully from ${fromEmail} to ${to}`);
  } catch (_error) {
    console.error("! Failed to send contact email:", _error);
    throw new Error("Failed to send contact email.");
  }
};


module.exports = {
  sendOtpEmail,
  sendStatusUpdateEmail,
  sendContactEmail,
};
