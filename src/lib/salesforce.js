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

export async function createOrUpdateSalesforceAccount(user) {
  const conn = await getSalesforceConnection();

  // If user already has a salesforceId in your DB, update it
  if (user.salesforceId) {
    await conn.sobject("Account").update({
      Id: user.salesforceId,
      FirstName: user.firstName,
      LastName: user.lastName,
    });
    return user.salesforceId;
  }

  // Otherwise, try to find by unique fields (e.g., email if you map it later)
  const existing = await conn.sobject("Account")
    .findOne({ LastName: user.lastName, FirstName: user.firstName });

  if (existing) {
    return existing.Id; // return existing Salesforce record
  }

  // Otherwise, create new Account
  const account = await conn.sobject("Account").create({
    FirstName: user.firstName,
    LastName: user.lastName,
  });

  if (!account.success) {
    throw new Error("Salesforce Account creation failed");
  }

  return account.id;
}

