import cron from "node-cron";
import { triggerDatabaseExport } from "./auto-export.js";

// Run every Friday at midnight
cron.schedule("0 0 * * 5", async () => {
  console.log("⏳ Running weekly database backup (Friday at midnight)...");
  try {
    await triggerDatabaseExport();
    console.log("✅ Weekly database backup triggered");
  } catch (err) {
    console.error("❌ Error running weekly backup:", err);
  }
});
