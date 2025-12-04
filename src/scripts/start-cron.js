import cron from "node-cron";
import { chargeUnpaidUsers } from "../utils/payment-capture-cron.js";
import "./db-export-cron.js";

// Payment cron – runs every hour
cron.schedule("0 * * * *", async () => {
  console.log("⏳ Running chargeUnpaidUsers...");
  await chargeUnpaidUsers();
});

// Load DB export cron
console.log("🚀 All cron jobs loaded");
