import cron from "node-cron";
import { runAssignmentReminders } from "../../utils/assignment-reminder-cron.js";

// Cron për dev: ekzekuto çdo minutë
cron.schedule("* * * * *", async () => {
  console.log("⏱ Cron job triggered at", new Date());
  await runAssignmentReminders();
});
