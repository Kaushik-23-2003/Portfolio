// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Nodemailer setup for Brevo
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,       // Brevo SMTP server
            port: process.env.SMTP_PORT,       // Brevo SMTP port
            secure: process.env.SMTP_SECURE === 'true', // Use `true` for 465, `false` or `true` for 587 (STARTTLS)
            auth: {
                user: process.env.SMTP_USER,       // Brevo SMTP username (usually your Brevo email)
                pass: process.env.SMTP_PASS,       // Brevo SMTP password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (can be your Brevo email or another verified sender in Brevo)
            to: process.env.CONTACT_RECEIVER_EMAIL,
            subject: `Contact Form Submission: ${subject}`,
            html: `<p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Subject:</strong> ${subject}</p>
                   <p><strong>Message:</strong> ${message}</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending message. Please try again later.', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});