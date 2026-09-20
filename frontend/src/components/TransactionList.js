import React from "react";
import { api } from "../api";

export default function TransactionList({ transactions, onUpdated, onDelete }) {
  async function changeStatus(id, status) {
    try {
      await api.updateTransaction(id, { status });
      onUpdated();
    } catch (err) {
      alert(err.message || "Update failed");
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Transactions</h2>
      </div>
      <div className="panel-body">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Amount (₹)</th>
              <th>Date</th>
              <th>Status</th>
              <th>Risk level</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr className="empty-row">
                <td colSpan={7}>No transactions yet — record one above.</td>
              </tr>
            )}
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td className="name-cell">{t.customerName}</td>
                <td>{Number(t.amount).toLocaleString("en-IN")}</td>
                <td>{t.date}</td>
                <td>
                  <select
                    className="select-inline"
                    value={t.status}
                    onChange={(e) => changeStatus(t.id, e.target.value)}
                  >
                    <option>Success</option>
                    <option>Failed</option>
                    <option>Pending</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${t.riskLevel.toLowerCase()}`}>{t.riskLevel}</span>
                </td>
                <td>
                  <button
                    className="btn danger"
                    onClick={() => {
                      if (window.confirm(`Remove transaction ${t.id}?`)) {
                        onDelete(t.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}