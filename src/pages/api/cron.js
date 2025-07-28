import { chargeUnpaidUsers } from '../../utils/payment-capture-cron';

export default async function handler(req, res) {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).send('Unauthorized');
  }

  try {
    await chargeUnpaidUsers(); // ⬅️ this should call Stripe and charge users
    res.status(200).send('✅ Cron ran successfully');
  } catch (err) {
    console.error('❌ Cron failed:', err);
    res.status(500).send('❌ Error running cron');
  }
}
