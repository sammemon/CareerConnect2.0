const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Build transporter with either configured SMTP or Ethereal fallback for development
async function getTransporter() {
  const hasCreds = !!(process.env.MAIL_USER && process.env.MAIL_PASS);
  if (hasCreds) {
    return {
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      }),
      isEthereal: false,
      fromAddress: process.env.MAIL_USER,
    };
  }
  // Ethereal fallback (no credentials required) - for local testing only
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return { transporter, isEthereal: true, fromAddress: testAccount.user };
}

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    // FIRST: Save to database (always succeeds if DB is up)
    const contactId = await Contact.create({ name, email, subject, message });

    // SECOND: Try to send email notification (non-blocking, best effort)
    let emailSent = false;
    let previewUrl = null;
    try {
      const { transporter, isEthereal, fromAddress } = await getTransporter();
      const mailOptions = {
        from: `CareerConnect Contact <${fromAddress}>`,
        to: process.env.CONTACT_TO || 'sm275665@gmail.com',
        replyTo: email,
        subject: subject ? `[CareerConnect] ${subject}` : '[CareerConnect] New Contact Inquiry',
        text: `From: ${name} <${email}>\n\n${message}\n\n---\nInquiry ID: ${contactId}`,
      };
      const info = await transporter.sendMail(mailOptions);
      previewUrl = isEthereal ? nodemailer.getTestMessageUrl(info) : null;
      emailSent = true;
    } catch (emailErr) {
      console.error('Email notification failed (inquiry saved to DB):', emailErr);
      // Don't fail the request; inquiry is saved
    }

    return res.json({
      success: true,
      message: 'Your inquiry has been saved. We will get back to you soon!',
      contactId,
      emailSent,
      previewUrl,
    });
  } catch (err) {
    console.error('Contact submission failed:', err);
    return res.status(500).json({ success: false, message: 'Failed to save inquiry. Please try again.' });
  }
};
