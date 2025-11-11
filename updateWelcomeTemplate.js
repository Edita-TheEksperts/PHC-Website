
import { prisma } from "./src/lib/prisma.js";


async function main() {
  await prisma.emailTemplate.update({
    where: { name: "welcomeEmail" },
    data: {
      body: `
        <p>Hello {{firstName}} {{lastName}},</p>
        <p>Thank you for registering with Prime Home Care AG.</p>
        <p>Your access to the customer portal has been successfully set up:</p>
        <ul>
          <li>Manage bookings</li>
          <li>View invoices</li>
          <li>Communicate with us</li>
        </ul>
        <p><strong>Please create your password via the button below:</strong></p>
        <p>
          <a href="{{resetLink}}"
             style="display:inline-block;padding:12px 24px;
                    background-color:#B99B5F;color:#ffffff;
                    border-radius:6px;text-decoration:none;
                    font-weight:bold;">
            Create Password
          </a>
        </p>
        <p>Ihr Prime Home Care Team</p>
      `,
    },
  });

  console.log("✅ 'welcomeEmail' template updated successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error updating template:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
