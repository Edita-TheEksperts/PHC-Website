import { prisma } from "../lib/prisma.js";
import nodemailer from "nodemailer";

// ✅ SMTP HOSTPOINT
const transporter = nodemailer.createTransport({
  host: "asmtp.mail.hostpoint.ch",
  port: 465,
  secure: true,
  auth: {
    user: "landingpage@phc.ch",
    pass: "4Z6j0JmP7ATGC#%!",
  },
});

const SECONDS = 172800; // 48 orë


export async function runUnassignedClientEmails() {
  console.log("🔁 runUnassignedClientEmails STARTED");

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: "client",
        assignments: { none: {} }, // 👈 pa employee
      },
    });

    console.log("👥 Clients found:", clients.length);

    const now = new Date();

    for (const client of clients) {
      const diffSeconds = (now - new Date(client.createdAt)) / 1000;

      if (diffSeconds >= SECONDS) {
        console.log("✅ Sending email to:", client.email);

        const html = `
          <p>Grüezi ${client.firstName || ""} ${client.lastName || ""}</p>

          <p>Vielen Dank für Ihre Online-Buchung bei Prime Home Care.</p>

          <p>
            Leider müssen wir Ihnen mitteilen, dass wir für den von Ihnen gebuchten Zeitraum
            aktuell keine passenden Kapazitäten zur Verfügung haben.
            Ein geeignetes Matching zwischen Kunde und Betreuungsperson ist derzeit nicht möglich.
          </p>

          <p>
            Ihre Buchung wird entsprechend nicht ausgeführt. Eine Belastung erfolgt nicht.
          </p>

          <p>
            Gerne können Sie jederzeit eine neue Online-Buchung mit einem alternativen Zeitraum vornehmen.
          </p>

          <p>Vielen Dank für Ihr Verständnis.</p>

          <p>Freundliche Grüsse</p>

          <p>
            Prime Home Care AG<br/>
            Birkenstrasse 49<br/>
            CH-6343 Rotkreuz<br/>
            info@phc.ch<br/>
            www.phc.ch
          </p>

          <p>
            <a href="https://phc.ch/AVB"
               target="_blank"
               rel="noopener noreferrer"
               style="text-decoration: underline; color: #04436F; font-weight: 500;">
              AVB und Nutzungsbedingungen
            </a>
          </p>
        `;

        const info = await transporter.sendMail({
          from: `"Prime Home Care" <landingpage@phc.ch>`,
          to: client.email,   // 🔁 në prodhim: client.email
          subject: "Information zur Verfügbarkeit Ihrer Buchung",
          html,
        });

        console.log("📨 Email accepted:", info.accepted);
      }
    }
  } catch (err) {
    console.error("❌ Unassigned client cron error:", err);
  }

  console.log("🔁 runUnassignedClientEmails FINISHED");
}
