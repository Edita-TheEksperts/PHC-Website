import cron from "node-cron";
import capturePendingPayments from "./scripts/capturePayments.js";

cron.schedule("0 * * * *", () => {
  console.log("Running payment capture cron job...");
  capturePendingPayments();
});

console.log("Cron job runner started");
