import React, { useState } from "react";
import { api } from "../api";

const EMPTY = { customerName: "", customerId: "", amount: "", status: "Success" };

export default function TransactionForm({ customers, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.customerName || !form.amount) {
      setError("Customer name and amount are required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.createTransaction({
        customerName: form.customerName,
        customerId: form.customerId || "N/A",
        amount: Number(form.amount),
        status: form.status,
        date: new Date().toISOString().slice(0, 10)
      });
      setForm(EMPTY);
      onCreated();
    } catch (err) {
      setError(err.message || "Could not reach the backend API.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Record a transaction</h2>
      </div>
      <div className="panel-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Customer name</label>
              <input value={form.customerName} onChange={handleChange("customerName")} />
            </div>
            <div className="field">
              <label>Customer ID </label>
              <input
                list="customer-ids"
                value={form.customerId}
                onChange={handleChange("customerId")}
                placeholder="e.g. CUST002"
              />
              <datalist id="customer-ids">
                {customers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>{c.customerName}</option>
                ))}
              </datalist>
            </div>
            <div className="field">
              <label>Amount (₹)</label>
              <input type="number" min="0" value={form.amount} onChange={handleChange("amount")} />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={handleChange("status")}>
                <option>Success</option>
                <option>Failed</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          {error && <div className="status-line error">{error}</div>}
          <div className="form-actions">
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
