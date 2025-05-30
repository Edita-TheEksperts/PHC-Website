import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = {
  "Alltagsbegleitung und Besorgungen": [
    "Beleitung zu Terminen",
    "Einkäufe erledigen",
    "Postgänge",
    "Sonstige Begleitungen",
  ],
  "Freizeit und Soziale Aktivitäten": [
    "Gesellschaft leisten",
    "Gemeinsames Kochen",
    "Vorlesen",
    "Kartenspiele",
    "Ausflüge und Reisebegleitung",
  ],
  "Gesundheitsführsorge": [
    "Körperliche Unterstützung",
    "Nahrungsaufnahme",
    "Grundpflegerische Tätigkeiten",
    "Gesundheitsfördernde Aktivitäten",
    "Geistige Unterstützung",
  ],
  "Haushaltshilfe und Wohnpflege": [
    "Hauswirtschaft",
    "Balkon und Blumenpflege",
    "Waschen / Bügeln",
    "Kochen",
    "Fenster Putzen",
    "Bettwäsche wechseln",
    "Aufräumen",
    "Trennung / Entsorgung / Abfall",
    "Abstauben",
    "Staubsaugen",
    "Boden wischen",
    "Vorhänge reinigen",
  ],
};

async function main() {
  for (const [serviceName, subServices] of Object.entries(services)) {
    const service = await prisma.service.upsert({
      where: { name: serviceName },
      update: {},
      create: { name: serviceName },
    });

    for (const subName of subServices) {
      await prisma.subService.upsert({
        where: { name: subName },
        update: {},
        create: { name: subName },
      });
    }
  }
}

main()
  .then(() => {
    console.log("✅ Seed successful");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
