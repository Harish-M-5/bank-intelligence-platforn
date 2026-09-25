### Banking Intelligence Platform

A mini banking operations dashboard for small banks and fintech startups: digital KYC,
a Customer 360 dashboard, payment monitoring, rule-based fraud alerts, and Excel reporting.

🚀 Ledgerline – Banking Intelligence Platform (FinTech MVP)

Introduction

Ledgerline is a full-stack FinTech prototype inspired by enterprise banking operations. It is designed to simulate how regional banks and fintech startups can manage customer onboarding, KYC verification, transaction monitoring, fraud detection, and reporting through a centralized dashboard.

This project focuses on understanding full-stack development concepts and enterprise-style banking workflows rather than implementing a real banking system.

---

Overview

The platform provides a banking operations dashboard where employees can:

- Register and manage customers
- Verify customer KYC
- Monitor payment transactions
- Detect suspicious transactions using rule-based logic
- View customer and transaction analytics
- Export banking reports to Microsoft Excel

---

Features

Digital KYC Verification

- Customer registration
- Customer ID generation
- Simulated document/QR verification
- KYC approval workflow
- KYC status management

Customer 360 Dashboard

- Total customers
- Verified customers
- Pending KYC
- Total transactions
- Interactive analytics using Chart.js

Payment Monitoring

- Create transactions
- View transaction history
- Transaction status tracking
- REST API integration

Fraud Detection

- Rule-based fraud detection
- High-value transaction alerts
- Multiple failed payment alerts
- Risk level indication

Excel Reporting

- Export customer reports
- Export transaction reports
- Export KYC reports using SheetJS

---

Technology Stack

Frontend

- React.js
- JavaScript
- CSS
- Chart.js
- Axios

Backend

- Node.js
- Express.js
- REST API

Data Storage

- Browser Local Storage

Reporting

- SheetJS (Excel)

---

Installation & Setup
Complete Installation & Setup Guide

Prerequisites

Install the following software before starting:

- Node.js (LTS Version)
- Visual Studio Code
- Git

Verify installation:

node -v
npm -v
git --version

---

1. Clone the Repository

git clone <repository-url>
cd ledgerline-banking-intelligence-platform

---

2. Open the Project in VS Code

code .

Open the integrated terminal:

Terminal → New Terminal

---

3. Frontend Setup (React)

Navigate to the frontend folder:

cd frontend

Install all required React packages:

npm install

If creating the React project from scratch using Vite:

npm create vite@latest frontend

Choose:

- Framework: React
- Variant: JavaScript

Then:

cd frontend
npm install

Install additional packages:

npm install axios
npm install chart.js react-chartjs-2
npm install xlsx

Start the React development server:

npm run dev

Frontend runs at:

http://localhost:5173

---

4. Backend Setup (Node.js + Express)

Open a new terminal in VS Code.

Navigate to the backend folder:

cd backend

If creating the backend from scratch:

mkdir backend
cd backend
npm init -y

Install required packages:

npm install express
npm install cors
npm install nodemon --save-dev

Create a file:

server.js

Start the backend:

node server.js

or during development:

npx nodemon server.js

Backend runs at:

http://localhost:5000


- The frontend communicates with the backend through REST APIs.



5. Run the Complete Project

Open Terminal 1:

cd frontend
npm run dev

Open Terminal 2:

cd backend
node server.js

---

6. Open the Application

Visit:

http://localhost:5173

The React frontend communicates with the Node.js backend through REST APIs running on port 5000.

The Banking Intelligence Platform is now ready to use.




---

Folder Structure

Ledgerline/

├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── charts/
│   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│
└── README.md

---

Use Case

Ledgerline is designed for:

- Regional Banks
- Cooperative Banks
- NBFCs
- FinTech Startups

The platform provides a centralized dashboard to manage customers, KYC verification, transactions, fraud monitoring, and reporting.

---

Problem Solved

Small financial institutions often rely on manual processes for customer onboarding and transaction monitoring.

Ledgerline demonstrates how a centralized digital platform can:

- Simplify customer management
- Improve KYC tracking
- Monitor transactions efficiently
- Detect suspicious activities using predefined rules
- Generate reports quickly

---

## Demo video:


https://github.com/user-attachments/assets/64002446-f85b-4d75-a391-de3a30c1c095

---

My Learning Journey

Building Ledgerline helped me gain practical experience in:

- Building a complete full-stack application
- Designing REST APIs
- Managing frontend and backend communication
- Implementing business logic
- Creating interactive dashboards
- Data visualization using Chart.js
- Excel report generation
- Project deployment
- Structuring a modular application

This project strengthened my understanding of how enterprise-inspired software solutions are designed and developed.

---

## Key Concepts Used

- Full-Stack Development
- Component-Based Architecture
- REST API Development
- CRUD Operations
- Local Storage
- Data Visualization
- Rule-Based Fraud Detection
- Digital KYC Workflow
- Customer Lifecycle Management
- Excel Report Generation
- Modular Project Structure

---

## Future Improvements

- MongoDB Integration
- JWT Authentication
- Role-Based Access Control
- Cloud Database
- AI-Based Fraud Detection
- Email Notifications
- Docker Deployment
- AWS Cloud Deployment
- Real Payment Gateway Integration

---

Conclusion

Ledgerline is a FinTech MVP created to explore enterprise-inspired banking workflows through a modern full-stack application. The project combines frontend development, backend APIs, analytics, reporting, and business logic into a single platform while providing hands-on experience in designing scalable software solutions.

---




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


  ## Output:
  <img width="1920" height="1080" alt="Screenshot 2026-09-20 122917" src="https://github.com/user-attachments/assets/2a4dbb54-b497-40b5-b801-d9baa023621b" />

  <img width="1920" height="1080" alt="Screenshot 2026-09-20 122933" src="https://github.com/user-attachments/assets/d5c66524-dc8b-4817-b77e-346a3ec5eafe" />

  <img width="1920" height="1080" alt="Screenshot 2026-09-20 122955" src="https://github.com/user-attachments/assets/ea4d2a37-c699-44f4-9aef-eff249af1a0f" />

  <img width="1920" height="1080" alt="Screenshot 2026-09-20 123006" src="https://github.com/user-attachments/assets/dcd19b14-163b-4197-a043-0001a4f28110" />

  <img width="1920" height="1080" alt="Screenshot 2026-09-20 123016" src="https://github.com/user-attachments/assets/40d67848-2cbc-4056-b5fe-65f7d8e2a696" />


  <img width="1920" height="1080" alt="Screenshot 2026-09-20 123029" src="https://github.com/user-attachments/assets/dded9408-ac0d-465f-adac-59ebc1e670c8" />

  <img width="1920" height="1080" alt="Screenshot 2026-09-20 123044" src="https://github.com/user-attachments/assets/377f6aef-e562-4da7-a08b-a1679f72435d" />

  <img width="1920" height="1080" alt="Screenshot 2026-09-20 123053" src="https://github.com/user-attachments/assets/bedcd3d9-fcbd-4db5-a803-fdd708272d00" />








