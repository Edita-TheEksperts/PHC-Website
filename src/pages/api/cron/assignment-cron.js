import cron from "node-cron";
import { runAssignmentReminders } from "../assignment-reminder-cron.js";
import { runUnassignedClientEmails } from "../unassigned-client-cron.js";

cron.schedule("* * * * *", async () => {
  console.log("⏰ CRON TRIGGERED", new Date());

  await runAssignmentReminders();
  await runUnassignedClientEmails();
});
