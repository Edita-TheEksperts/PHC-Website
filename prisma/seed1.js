import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
await prisma.emailTemplate.upsert({
  where: { name: "feedbackEmail" },
  update: {},
  create: {
    name: "feedbackEmail",
    subject: "Wie zufrieden sind Sie mit unserer Betreuung?",
    body: `
      <p>Guten Tag {{firstName}} {{lastName}},</p>
      <p>Wir hoffen, dass Sie mit der Betreuung durch {{caregiverName}} zufrieden waren.</p>
      <p>Wir freuen uns über Ihre Rückmeldung: 
        <a href="{{feedbackLink}}">{{feedbackLink}}</a>
      </p>
      <p>Ihr Feedback hilft uns, unsere Dienstleistung weiter zu verbessern.</p>
      <p>Danke für Ihr Vertrauen!</p>
      <p>Prime Home Care AG</p>
    `,
  },
});
console.log("✅ feedbackEmail template seeded");



}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
