// src/actions/sendEmail.ts
"use server";

import { Resend } from "resend"; // You won't need Resend if you are using Nodemailer
import { validateString, getErrorMessage } from "@/utils/utils"; // Updated import path!
import ContactFormEmail from "@/components/Contact"; // You might need to adapt or remove this email template component
import nodemailer from 'nodemailer'; // Import Nodemailer

export const sendEmail = async (formData: FormData) => {
  const name = formData.get("name") as string | null; // Get name from FormData
  const senderEmail = formData.get("email") as string | null; // Get email from FormData
  const subject = formData.get("subject") as string | null; // Get subject
  const message = formData.get("message") as string | null; // Get message

  // Server-side validation (you can adapt your `validateString` or do direct checks)
  if (!name || !validateString(name, 500)) {
    return { error: "Invalid name" };
  }
  if (!senderEmail || !validateString(senderEmail, 500) || !senderEmail.includes('@')) { // Basic email validation
    return { error: "Invalid sender email" };
  }
  if (!subject || !validateString(subject, 500)) {
    return { error: "Invalid subject" };
  }
  if (!message || !validateString(message, 5000)) {
    return { error: "Invalid message" };
  }


  try {
    // Nodemailer setup for Brevo (similar to your backend server.js)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10), // Ensure port is a number
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email from .env
        to: process.env.CONTACT_RECEIVER_EMAIL, // Receiver email from .env
        subject: `Contact Form Submission: ${subject}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${senderEmail}</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Message:</strong> ${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return { success: "Email sent successfully!" }; // Indicate success

  } catch (error: any) {
    console.error("Error sending email:", error);
    return { error: getErrorMessage(error) || "Failed to send email. Please try again later." }; // Return error message
  }
};

export default sendEmail;