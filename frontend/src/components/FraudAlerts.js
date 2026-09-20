import React from "react";

export default function FraudAlerts({ alerts, loading }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Fraud alerts</h2>
      </div>
      <div className="panel-body">
        {loading && <p className="status-line">Checking transactions against fraud rules…</p>}
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Risk reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && alerts.length === 0 && (
              <tr className="empty-row">
                <td colSpan={4}>No transactions currently breach the fraud rules.</td>
              </tr>
            )}
            {alerts.map((a) => (
              <tr key={a.transactionId}>
                <td>{a.transactionId}</td>
                <td className="name-cell">{a.customerName}</td>
                <td className="name-cell">{a.riskReason}</td>
                <td>
                  <span className="badge flagged">{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
