import React from "react";

const PaymentsDashboard = () => {
  const payments = [
    {
      id: 1,
      clientName: "John Doe",
      amount: 200,
      date: "12/12/2024",
      status: "Paid",
    },
    {
      id: 2,
      clientName: "Jane Smith",
      amount: 150,
      date: "13/12/2024",
      status: "Pending",
    },
    {
      id: 3,
      clientName: "James Bond",
      amount: 300,
      date: "15/12/2024",
      status: "Paid",
    },
    // More payments
  ];

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-semibold mb-4">Payments</h2>

      {/* Payments Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b-2 border-gray-400">
              <th className="px-4 py-2 text-left">Client Name</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{payment.clientName}</td>
                <td className="px-4 py-2">${payment.amount}</td>
                <td className="px-4 py-2">{payment.date}</td>
                <td className="px-4 py-2">{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsDashboard;
