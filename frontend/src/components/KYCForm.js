import React, { useState } from "react";
import { addCustomer, generateCustomerId, isDuplicateCustomer } from "../utils/storage";

const EMPTY_FORM = {
  customerName: "",
  email: "",
  phone: "",
  documentId: ""
};

// Flow: Registration -> Scan -> Verify -> Approve -> Store
const STEPS = ["Registration", "Scan", "Verify", "Approve", "Stored"];

export default function KYCForm({ customers, onRegistered }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [stepIndex, setStepIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [message, setMessage] = useState(null);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const canScan = form.customerName && form.email && form.phone && form.documentId;

  
  function runScan() {
    if (isDuplicateCustomer(form.email, form.documentId, form.phone)) {
      setMessage({
        type: "error",
        text: "Already registered — this email / document ID / phone matches an existing customer. KYC not verified."
      });
      return;
    }
    setScanning(true);
    setStepIndex(1);
    const code = Array.from({ length: 24 }, () =>
      "ABCDEF0123456789"[Math.floor(Math.random() * 16)]
    ).join("");
    setTimeout(() => {
      setScanCode(code);
      setScanning(false);
      setStepIndex(2);
    }, 900);
  }

  function verifyDetails() {

    
    const looksValid = /^[A-Za-z0-9-]{4,}$/.test(form.documentId);
    if (!looksValid) {
      setMessage({ type: "error", text: "Document ID failed the format check. Verification stopped." });
      setStepIndex(1);
      return;
    }
    setStepIndex(3);
    setMessage(null);
  }

  function approveKYC() {
    const customerId = generateCustomerId(customers);
    const record = {
      customerName: form.customerName,
      customerId,
      email: form.email,
      phone: form.phone,
      documentId: form.documentId,
      kycStatus: "Verified"
    };
    addCustomer(record);
    setStepIndex(4);
    setMessage({ type: "ok", text: `${record.customerName} approved and stored as ${customerId}.` });
    onRegistered();
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setScanCode("");
      setStepIndex(0);
      setMessage(null);
    }, 1800);
  }

  function registerPending() {
  
    const customerId = generateCustomerId(customers);
    addCustomer({
      customerName: form.customerName,
      customerId,
      email: form.email,
      phone: form.phone,
      documentId: form.documentId,
      kycStatus: "Pending"
    });
    setMessage({ type: "ok", text: `${form.customerName} saved with Pending KYC status (${customerId}).` });
    onRegistered();
    setForm(EMPTY_FORM);
    setStepIndex(0);
    setScanCode("");
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Customer registration</h2>
      </div>
      <div className="panel-body">
        <div className="form-grid">
          <div className="field">
            <label>Customer name</label>
            <input value={form.customerName} onChange={handleChange("customerName")} placeholder="Full legal name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={form.email} onChange={handleChange("email")} placeholder="name@example.com" type="email" />
          </div>
          <div className="field">
            <label>Phone number</label>
            <input value={form.phone} onChange={handleChange("phone")} placeholder="10-digit mobile number" />
          </div>
          <div className="field">
            <label>Document ID</label>
            <input value={form.documentId} onChange={handleChange("documentId")} placeholder="e.g. DOC-AR-2291" />
          </div>
        </div>

        <div className={`scan-box${scanning ? " scanning" : ""}`} style={{ marginTop: 16 }}>
          {stepIndex === 0 && <span>Fill in customer details, then scan their document to begin verification.</span>}
          {stepIndex === 1 && !scanCode && <span>Scanning document / QR code…</span>}
          {stepIndex >= 2 && scanCode && (
            <>
              <div className="qr-glyph">{scanCode}</div>
              <span>Document scanned. Review the details below and verify.</span>
            </>
          )}
        </div>

        <div className="kyc-flow">
          {STEPS.map((s, i) => (
            <span key={s} className={`step ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`}>
              {s}
            </span>
          ))}
        </div>

        {message && (
          <div className={`status-line ${message.type === "error" ? "error" : "ok"}`}>{message.text}</div>
        )}

        <div className="form-actions">
          {stepIndex === 0 && (
            <button className="btn" disabled={!canScan} onClick={runScan}>
              Scan document
            </button>
          )}
          {stepIndex === 2 && (
            <button className="btn" onClick={verifyDetails}>
              Verify details
            </button>
          )}
          {stepIndex === 3 && (
            <button className="btn emerald" onClick={approveKYC}>
              Approve KYC
            </button>
          )}
          {stepIndex === 0 && canScan && (
            <button className="btn secondary" onClick={registerPending}>
              Save as pending (skip verification)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
