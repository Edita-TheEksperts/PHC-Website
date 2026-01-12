import { chargeUnpaidUsers } from '../../utils/payment-capture-cron';
import { runUnassignedClientEmails } from '../../scripts/unassigned-client-cron';

export default async function handler(req, res) {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).send('Unauthorized');
  }

  try {
    console.log("⏰ CRON API TRIGGERED");

    await chargeUnpaidUsers();              // Stripe charge
    await runUnassignedClientEmails();     // Email për klientë pa employee

    res.status(200).send('✅ Cron ran successfully');
  } catch (err) {
    console.error('❌ Cron failed:', err);
    res.status(500).send('❌ Error running cron');
  }
}
