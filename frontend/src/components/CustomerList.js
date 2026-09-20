import React from "react";

export default function CustomerList({ customers, onDelete }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Customer register</h2>
        <span className="api-pill">localStorage · BIP</span>
      </div>
      <div className="panel-body">
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Document ID</th>
              <th>KYC status</th>
              <th>Registered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr className="empty-row">
                <td colSpan={8}>No customers registered yet — use Digital KYC to add one.</td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.customerId}>
                <td>{c.customerId}</td>
                <td className="name-cell">{c.customerName}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.documentId}</td>
                <td>
                  <span className={`badge ${c.kycStatus.toLowerCase()}`}>{c.kycStatus}</span>
                </td>
                <td>{c.registeredOn}</td>
                <td>
                  <button
                    className="btn danger"
                    onClick={() => {
                      if (window.confirm(`Remove ${c.customerName} (${c.customerId})?`)) {
                        onDelete(c.customerId);
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