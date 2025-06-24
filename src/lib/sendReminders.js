import { prisma } from "./prisma";
import { sendEmail } from "./email";

export async function sendPendingReminders() {
  const now = new Date();

  // Get reminders not sent and scheduledAt <= now
  const reminders = await prisma.reminder.findMany({
    where: { sent: false, scheduledAt: { lte: now } },
    include: { user: true },
  });

  for (const reminder of reminders) {
    const user = reminder.user;

    let subject = "";
    let body = "";

    if (reminder.type === "4h_reminder") {
      subject = "Ihre Betreuung wartet auf Sie";
      body = `
        <p>Guten Tag ${user.firstName} ${user.lastName},</p>
        <p>Sie haben Ihr Kundenkonto erfolgreich erstellt – vielen Dank! Uns ist aufgefallen, dass Sie noch keine Buchung abgeschlossen haben.</p>
        <p>Möchten Sie Hilfe oder eine telefonische Beratung? Kontaktieren Sie uns gerne unter ${process.env.SUPPORT_PHONE} oder buchen Sie direkt hier: <a href="${process.env.BOOKING_LINK}">Direktlink zur Buchung</a>.</p>
        <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
      `;
    } else if (reminder.type === "48h_reminder") {
      subject = "Erinnerung: Bitte fehlende Unterlagen hochladen";
      body = `
        <p>Guten Tag ${user.firstName} ${user.lastName},</p>
        <p>Wir bitten Sie freundlich, die noch ausstehenden Dokumente für Ihre Kundenakte hochzuladen. Diese sind erforderlich, um Ihre Betreuung korrekt zu planen und durchzuführen.</p>
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung. Vielen Dank für Ihre Mithilfe!</p>
        <p>Freundliche Grüsse<br/>Ihr Prime Home Care Team</p>
      `;
    } else {
      continue; // unknown reminder type
    }

    try {
      await sendEmail({ to: user.email, subject, html: body });
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { sent: true },
      });
      console.log(`Sent reminder ${reminder.type} to ${user.email}`);
    } catch (error) {
      console.error(`Failed to send reminder to ${user.email}:`, error);
    }
  }
}
