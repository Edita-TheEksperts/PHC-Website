import { runAssignmentReminders } from "../pages/api/assignment-reminder-cron.js";

async function main() {
  console.log("⏱ Running assignment reminders:", new Date());
  await runAssignmentReminders();
  console.log("✅ Done");
}

main().catch(console.error);
