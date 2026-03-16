// test-pdfs.js
// Script to test all PDF generation functions

const fs = require('fs');
const path = require('path');
const { createRahmenvereinbarungPdf } = require('./src/lib/mailer');
const { createContractPdf } = require('./src/lib/emailHelpers');

// Dummy employee data for testing
defaultEmployee = {
  firstName: 'Max',
  lastName: 'Mustermann',
  street: 'Musterstrasse 1',
  zip: '6300',
  city: 'Zug',
  address: 'Musterstrasse 1',
  zipCode: '6300',
  letterDate: new Date(),
  terminationDate: '31.12.2026',
};

async function testRahmenvereinbarungPdf() {
  const buffer = await createRahmenvereinbarungPdf(defaultEmployee);
  fs.writeFileSync(path.join(__dirname, 'Rahmenvereinbarung_TEST.pdf'), buffer);
  console.log('Rahmenvereinbarung PDF generated.');
}

async function testContractPdf() {
  const buffer = await createContractPdf(defaultEmployee);
  fs.writeFileSync(path.join(__dirname, 'Contract_TEST.pdf'), buffer);
  console.log('Contract PDF generated.');
}

async function main() {
  await testRahmenvereinbarungPdf();
  await testContractPdf();
  console.log('All PDF tests completed.');
}

main();
