const transporter = require('../config/mailer');
const Company = require('../models/Company');
const EmailLog = require('../models/EmailLog');

/**
 * @desc    Send a real email via Nodemailer and explicitly track it in our system
 * @route   POST /api/... (to be defined)
 * @access  Private/Public
 */
const sendEmail = async (req, res) => {
  try {
    // 1. Extract required data from the request body
    const { companyId, subject, body } = req.body;

    // 2. Validate that the company actually exists in our database
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // 3. Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // The sender identity defined in our environment
      to: company.hrEmail,          // The HR email we have on file for this company
      subject: subject,             // The subject string
      text: body,                   // The plain-text body content
    };

    // 4. Send the email using the generic SMTP transporter config
    await transporter.sendMail(mailOptions);

    // 5. If the email was sent successfully (no error thrown), map an EmailLog document
    const emailLog = new EmailLog({
      company: companyId,
      subject: subject,
      body: body,
      status: 'Sent',
      sentAt: new Date(),
    });

    // Save the record
    await emailLog.save();

    // 6. Simultaneously update the master Company status
    company.status = 'Sent';
    company.sentAt = new Date();
    await company.save();

    // 7. Return the final successful JSON response including our mapped log
    res.status(200).json({
      success: true,
      message: 'Email successfully sent and logged',
      data: emailLog,
    });

  } catch (error) {
    // 8. Safely handle SMTP transaction rejections and native errors
    console.error('Email Dispatch Error:', error);
    
    // Explicitly return a 500 mapping denoting the failure
    res.status(500).json({
      success: false,
      message: 'Failed to send the email',
      error: error.message,
    });
  }
};

module.exports = {
  sendEmail,
};
