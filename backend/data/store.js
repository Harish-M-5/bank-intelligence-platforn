// In-memory "database" for the demo backend.
// Swap this module out for a real DB (Mongo/Postgres) without touching server.js's route logic.

const FRAUD_AMOUNT_THRESHOLD = 100000;
const FAILED_TXN_THRESHOLD = 3; // 3+ failed transactions from the same customer trips the rule

let transactions = [
  {
    id: "TXN1001",
    customerName: "Ananya Rao",
    customerId: "CUST001",
    amount: 42500,
    date: "2026-09-10",
    status: "Success",
    riskLevel: "Low"
  },
  {
    id: "TXN1002",
    customerName: "Vikram Shah",
    customerId: "CUST002",
    amount: 150000,
    date: "2026-09-12",
    status: "Success",
    riskLevel: "High"
  },
  {
    id: "TXN1003",
    customerName: "Vikram Shah",
    customerId: "CUST002",
    amount: 8000,
    date: "2026-09-14",
    status: "Failed",
    riskLevel: "Medium"
  },
  {
    id: "TXN1004",
    customerName: "Vikram Shah",
    customerId: "CUST002",
    amount: 6200,
    date: "2026-09-15",
    status: "Failed",
    riskLevel: "Medium"
  }
];

let nextId = 1005;

function generateId() {
  return `TXN${nextId++}`;
}

/** Applies the two fraud rules and returns { riskLevel, alert } */
function evaluateRisk(txn, allTransactions) {
  const reasons = [];

  if (Number(txn.amount) > FRAUD_AMOUNT_THRESHOLD) {
    reasons.push(`Amount ₹${Number(txn.amount).toLocaleString("en-IN")} exceeds ₹${FRAUD_AMOUNT_THRESHOLD.toLocaleString("en-IN")} threshold`);
  }

  const failedCount = allTransactions.filter(
    (t) => t.customerId === txn.customerId && t.status === "Failed"
  ).length + (txn.status === "Failed" ? 1 : 0) - (allTransactions.some(t => t.id === txn.id && t.status === "Failed") ? 1 : 0);

  if (failedCount >= FAILED_TXN_THRESHOLD) {
    reasons.push(`${failedCount} failed transactions recorded for this customer`);
  }

  const riskLevel = reasons.length > 0 ? "High" : txn.riskLevel || "Low";
  return { riskLevel, flagged: reasons.length > 0, reasons };
}

function getAll() {
  return transactions;
}

function getById(id) {
  return transactions.find((t) => t.id === id);
}

function create(payload) {
  const txn = {
    id: payload.id || generateId(),
    customerName: payload.customerName,
    customerId: payload.customerId || "N/A",
    amount: Number(payload.amount),
    date: payload.date || new Date().toISOString().slice(0, 10),
    status: payload.status || "Success",
    riskLevel: payload.riskLevel || "Low"
  };

  const { riskLevel } = evaluateRisk(txn, transactions);
  txn.riskLevel = riskLevel;

  transactions.push(txn);
  return txn;
}

function update(id, payload) {
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  const updated = { ...transactions[idx], ...payload, id };
  updated.amount = Number(updated.amount);

  const { riskLevel } = evaluateRisk(updated, transactions.filter((t) => t.id !== id));
  updated.riskLevel = riskLevel;

  transactions[idx] = updated;
  return updated;
}

function getFraudAlerts() {
  return transactions
    .map((txn) => {
      const { flagged, reasons } = evaluateRisk(txn, transactions);
      return flagged
        ? {
            transactionId: txn.id,
            customerName: txn.customerName,
            riskReason: reasons.join("; "),
            status: "Flagged"
          }
        : null;
    })
    .filter(Boolean);
}

function remove(id) {
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  transactions.splice(idx, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getFraudAlerts,
  FRAUD_AMOUNT_THRESHOLD,
  FAILED_TXN_THRESHOLD
};
