export default function CurrentRevenue({ clients }) {
  const activeClients = clients.filter(
    (c) => c.assignments && c.assignments.length > 0
  );

  const totalRevenue = activeClients.reduce((sum, client) => {
    return sum + (client.totalPayment || 0);
  }, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border my-6 max-w-7xl">
      <h2 className="text-xl font-bold text-green-700 mb-4">Current Revenue</h2>
      <p className="text-3xl font-bold text-gray-800">
        CHF {totalRevenue.toLocaleString("de-CH", { minimumFractionDigits: 2 })}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Based on {activeClients.length} active client{activeClients.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
