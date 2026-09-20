# Ledgerline — FinTech Banking Intelligence Platform

A mini banking operations dashboard for small banks and fintech startups: digital KYC,
a Customer 360 dashboard, payment monitoring, rule-based fraud alerts, and Excel reporting.

## Architecture

```
React Frontend (port 3000)
   |  fetch()
   v
Node.js / Express REST API (port 5000)  --  in-memory transaction store + fraud rules
   |
   +-- Browser Local Storage  --  customer & KYC records (frontend-only, per spec)
   |
   +-- SheetJS (xlsx)  --  Customer / Transaction / KYC Excel exports (generated client-side)
```

- **Customers & KYC data** are created and read entirely in the browser via `localStorage`
  (no backend round trip needed — this matches the "Local Storage for customer data" spec).
- **Transactions** are owned by the Node.js REST API. The frontend calls it over `fetch`;
  the API applies the fraud rules server-side on every create/update so risk level is always
  consistent with the latest rule set.
- **Excel reports** are generated on demand in the browser with SheetJS, pulling from
  whatever is currently loaded (localStorage customers + API transactions).

## Folder structure

```
fintech-platform/
├── backend/
│   ├── data/store.js        # In-memory data + fraud rule engine
│   ├── server.js            # Express app and REST routes
│   └── package.json
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── Dashboard.js         # Customer 360 + Chart.js charts
│   │   │   ├── KYCForm.js           # Registration + scan/verify/approve flow
│   │   │   ├── CustomerList.js
│   │   │   ├── TransactionForm.js
│   │   │   ├── TransactionList.js
│   │   │   ├── FraudAlerts.js
│   │   │   └── ExcelExport.js       # SheetJS report buttons
│   │   ├── utils/
│   │   │   ├── storage.js           # localStorage helpers (customers)
│   │   │   └── excelExport.js       # SheetJS workbook builders
│   │   ├── api.js                   # fetch wrapper for the backend
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Installation

You'll need Node.js 18+ and npm installed locally. Run these on your own machine
(this project wasn't built or `npm install`-ed in this sandbox, since it has no network access).

**1. Backend**

```bash
cd fintech-platform/backend
npm install
npm start
```

You should see:

```
Banking Intelligence API running at http://localhost:5000
Fraud rules: amount > ₹100000 OR >= 3 failed transactions/customer
```

Leave this running in its own terminal.

**2. Frontend**

In a second terminal:

```bash
cd fintech-platform/frontend
npm install
npm start
```

This opens `http://localhost:3000` automatically. The `"proxy"` field in
`frontend/package.json` and the `REACT_APP_API_URL` fallback in `src/api.js` both point at
`http://localhost:5000`, so no extra configuration is needed for local development.

If you deploy the backend elsewhere, set `REACT_APP_API_URL` before building the frontend:

```bash
REACT_APP_API_URL=https://your-api-host.example.com npm run build
```

## How it connects end-to-end

1. Open **Digital KYC** → register a customer → **Scan document** (simulated QR/document scan,
   generates a mock verification code) → **Verify details** → **Approve KYC**. The record is
   written to `localStorage` (`ledgerline_customers`) and immediately shows up in the customer
   register table and the Customer 360 dashboard.
2. Open **Payment Monitoring** → submit a transaction. This calls `POST /api/transactions` on
   the Node backend, which evaluates the fraud rules and assigns a risk level before storing it.
3. Open **Fraud Alerts** → calls `GET /api/transactions/alerts`, which re-runs the two rules
   (`amount > ₹100,000` OR `≥ 3 failed transactions for that customer`) over every stored
   transaction and returns the ones that are flagged.
4. Open **Excel Reports** → generates a `.xlsx` workbook in the browser (via SheetJS) from
   whatever customers/transactions are currently loaded, and downloads it.
5. **Customer 360** ties it together: total/verified/pending customer counts and total
   transactions, plus a customer growth line chart, a KYC completion doughnut chart, and a
   transaction volume bar chart — all Chart.js, fed by the same two data sources above.

## REST API reference

| Method | Endpoint                     | Description                                         |
|--------|-------------------------------|------------------------------------------------------|
| GET    | `/health`                     | Health check                                         |
| GET    | `/api/transactions`           | List all transactions                                |
| GET    | `/api/transactions/:id`       | Get a single transaction                             |
| POST   | `/api/transactions`           | Create a transaction (fraud rules applied automatically) |
| PUT    | `/api/transactions/:id`       | Update a transaction (e.g. status)                   |
| GET    | `/api/transactions/alerts`    | List currently-flagged (fraud) transactions          |

## Notes & next steps

- The backend uses an in-memory array as its "database" for simplicity — restarting the
  server resets transaction data. Swap `backend/data/store.js` for a real database (MongoDB,
  PostgreSQL, etc.) without changing any route code in `server.js`.
- Customer data lives only in the browser's `localStorage`, so it's per-browser/per-device —
  fine for a demo, but you'd move this to the backend/a real DB for a multi-user deployment.
- The QR/document scan is a UI simulation (generates a mock code and runs format checks on the
  Document ID) rather than a real camera/OCR integration.
