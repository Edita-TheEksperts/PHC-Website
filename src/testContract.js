// testContract.js
import fs from "fs";
import { createContractPdf } from "../";

// Dummy test employee (Edita Latifi, Kosovo)
const testEmployee = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "edita.latifi@the-eksperts.com",
  firstName: "Edita",
  lastName: "Latifi",
  phone: "+38344111222",
  address: "Rruga e Dëshmorëve",
  houseNumber: "15",
  zipCode: "61000",
  city: "Podujevë",
  country: "Kosovo",
  residencePermit: "N/A",
  experienceYears: "5",
  experienceWhere: "Healthcare, Nursing Homes",
  hasLicense: true,
  availabilityFrom: new Date("2025-09-15"),
  availabilityDays: ["Monday", "Wednesday", "Friday"],
  servicesOffered: ["Körperpflege", "Haushaltshilfe", "Begleitung"],
  howFarCanYouTravel: "30km",
  status: "active",
  createdAt: new Date(),
  bodyCareSupport: "Yes",
  carAvailableForWork: "No",
  communicationTraits: ["freundlich", "geduldig"],
  dietaryExperience: ["Diabetes-Ernährung", "Vegetarisch"],
  experienceCompany: "Kosovo Care Center",
  hasAllergies: "No",
  hasCar: "No",
  howDidYouHearAboutUs: "Referral",
  languages: ["Deutsch", "Albanisch", "Englisch"],
  licenseType: "B",
  nightShiftFrequency: "occasional",
  nightShifts: "Yes",
  onCallAvailable: "Yes",
  salutation: "Frau",
  smoker: "No",
  specialTrainings: ["Pflegekurs", "Erste Hilfe"],
  travelSupport: "Yes",
  weekendReady: "Yes",
  worksWithAnimals: "Yes",
  canton: "N/A",
  nationality: "Kosovarisch",
  accountHolder: "Edita Latifi",
  bankName: "Raiffeisen Bank Kosovo",
  bic: "RBKOXKPR",
  iban: "XK051234567890123456",
  invited: false,
  desiredWeeklyHours: "20",
};

// Generate the PDF and save it
(async () => {
  try {
    const pdfBuffer = await createContractPdf(testEmployee);
    fs.writeFileSync("Arbeitsvertrag_Edita_Latifi.pdf", pdfBuffer);
    console.log("✅ PDF generated: Arbeitsvertrag_Edita_Latifi.pdf");
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
  }
})();
