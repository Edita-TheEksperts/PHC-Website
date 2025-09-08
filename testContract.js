// testContract.js
import fs from "fs";
import nodemailer from "nodemailer";
import { createContractPdf } from "./src/lib/mailer.js";
import dotenv from "dotenv";
dotenv.config();

// Dummy test employee
const testEmployee = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "anduela.nurshaba@the-eksperts.com",
  firstName: "Anduela",
  lastName: "Nurshaba",
  phone: "+38344111222",
  address: "Rruga e Dëshmorëve",
  houseNumber: "15",
  zipCode: "61000",
  city: "Rahovec",
  country: "Kosovo",
  desiredWeeklyHours: "20",
  servicesOffered: ["Körperpflege", "Haushaltshilfe", "Begleitung"],
  startDate: "01.10.2025",
  endDate: "31.12.2025",
};


// Generate PDF and email it
(async () => {
  try {
    const pdfBuffer = await createContractPdf(testEmployee);

    // Save locally (optional)
    fs.writeFileSync("Arbeitsvertrag_Edita_Latifi.pdf", pdfBuffer);
    console.log("✅ PDF generated: Arbeitsvertrag_Edita_Latifi.pdf");
// Setup mail transporter with Hostpoint SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


    // Mail options
    const mailOptions = {
      from: `"Prime Home Care" <${process.env.MAIL_USER}>`,
      to: "anduela.nurshaba@the-eksperts.com",
      subject: "Arbeitsvertrag – Edita Latifi",
      text: "Liebe Edita,\n\nanbei finden Sie Ihren Arbeitsvertrag als PDF.\n\nFreundliche Grüsse\nPrime Home Care",
      attachments: [
        {
          filename: "Arbeitsvertrag_Edita_Latifi.pdf",
          content: pdfBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to anduela.nurshaba@the-eksperts.com");
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
