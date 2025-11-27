// test-payment-retry.js
// Simulon 3 tentativa me 48h distancë për pagese

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 🟢 Simulo STATUS nga Stripe (ndreq vetë çka dëshiron të testosh)
function fakeStripeCaptureSimulation(attempt) {
  if (attempt < 3) {
    return { success: false, reason: "Card declined" };
  }
  return { success: true };
}

async function runTestSimulation() {
  let attempts = 0;
  let reminderCount = 0;
  let phc = false;

  console.log("🚀 TEST STARTED — simulation of 3 x 48h!");
  console.log("");

  while (attempts < 3 && !phc) {
    attempts++;
    reminderCount++;

    console.log(`⏳ Attempt ${attempts} (48h later...)`);

    // simulo stripe
    const stripe = fakeStripeCaptureSimulation(attempts);

    if (stripe.success) {
      console.log("🟢 Payment captured successfully on attempt:", attempts);
      console.log("📬 reminderCount:", reminderCount);
      console.log("");
      console.log("🏁 END OF TEST — SUCCESS");
      return;
    } else {
      console.log("❌ Failed:", stripe.reason);
    }

    if (attempts >= 3) {
      phc = true;
      console.log("🚨 After 3 failed attempts → moved to PHC manual!");
      console.log("📌 reminderCount:", reminderCount);
      console.log("");
      console.log("🏁 END OF TEST — FAILED 3 TIMES");
      return;
    }

    // për testim — 1 sekond = 48h
    await sleep(1000);
  }
}

runTestSimulation();
