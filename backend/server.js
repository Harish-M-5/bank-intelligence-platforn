const express = require("express");
const cors = require("cors");
const store = require("./data/store");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// request log
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "fintech-banking-backend" });
});

// GET /api/transactions 
app.get("/api/transactions", (_req, res) => {
  res.json(store.getAll());
});

// GET /api/transactions/alerts
app.get("/api/transactions/alerts", (_req, res) => {
  res.json(store.getFraudAlerts());
});


app.get("/api/transactions/:id", (req, res) => {
  const txn = store.getById(req.params.id);
  if (!txn) return res.status(404).json({ error: "Transaction not found" });
  res.json(txn);
});

// POST /api/transactions
app.post("/api/transactions", (req, res) => {
  const { customerName, amount } = req.body;
  if (!customerName || amount === undefined) {
    return res.status(400).json({ error: "customerName and amount are required" });
  }
  const txn = store.create(req.body);
  res.status(201).json(txn);
});

// PUT /api/transactions/
app.put("/api/transactions/:id", (req, res) => {
  const updated = store.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Transaction not found" });
  res.json(updated);
});

// DELETE /api/transactions/
app.delete("/api/transactions/:id", (req, res) => {
  const removed = store.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: "Transaction not found" });
  res.json({ success: true, id: req.params.id });
});

app.listen(PORT, () => {
  console.log(`Banking Intelligence API running at http://localhost:${PORT}`);
  console.log(`Fraud rules: amount > ₹${store.FRAUD_AMOUNT_THRESHOLD} OR >= ${store.FAILED_TXN_THRESHOLD} failed transactions/customer`);
});
