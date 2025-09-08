import jsforce from "jsforce";

export async function getSalesforceConnection() {
  const conn = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com", // change to https://test.salesforce.com if using sandbox
  });

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
  );

  return conn;
}

export async function createSalesforceAccount(user) {
  const conn = await getSalesforceConnection();

  const account = await conn.sobject("Account").create({
    FirstName: user.firstName,
    LastName: user.lastName,
  });

  if (!account.success) {
    throw new Error("Salesforce Account creation failed");
  }

  return account.id;
}
