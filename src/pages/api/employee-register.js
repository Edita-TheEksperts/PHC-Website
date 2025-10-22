import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"; // For sending emails
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fullName, email, phone, password, role } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      name: fullName,
      email,
      phone: phone || '',
      passwordHash: hashedPassword,
      role,
    },
  });

  // If the user is an employee, send an email with a calendar link
  if (role === 'employee') {
    await sendInterviewEmail(email);
    return res.status(201).json({ message: 'Registration successful, check your email for interview scheduling.' });
  }

  res.status(201).json({ message: 'Registration successful, you can now log in to your dashboard.' });
}

// Function to send email with interview link
async function sendInterviewEmail(userEmail) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',  // Change this based on your email service provider
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password', // Use OAuth2 or App Passwords for more security
    },
  });

  let mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Schedule Your Interview',
    html: `<p>Dear Employee,</p>
           <p>Thank you for registering. Please click on the link below to schedule your interview:</p>
           <a href="https://calendly.com/your-interview-link">Schedule Interview</a>
           <p>Best Regards,<br>Your Company</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
