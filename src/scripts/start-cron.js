import cron from "node-cron";
import { runCapturePayments } from "../utils/payment-capture-cron.js";

cron.schedule("0 * * * *", async () => {
  await runCapturePayments();
});
