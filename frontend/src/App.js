import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import KYCForm from "./components/KYCForm";
import CustomerList from "./components/CustomerList";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import FraudAlerts from "./components/FraudAlerts";
import ExcelExport from "./components/ExcelExport";
import { getCustomers, deleteCustomer } from "./utils/storage";
import { api } from "./api";

const PAGE_META = {
  dashboard: {
    title: "Customer 360 dashboard"
  },
  kyc: {
    title: "Digital KYC verification"
  },
  payments: {
    title: "Payment monitoring"
  },
  fraud: {
    title: "Fraud alert simulation"
  },
  reports: {
    title: "Excel reporting"
  }
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const refreshCustomers = useCallback(() => setCustomers(getCustomers()), []);

  const refreshTransactions = useCallback(async () => {
    try {
      const [txns, fraudAlerts] = await Promise.all([api.getTransactions(), api.getAlerts()]);
      setTransactions(txns);
      setAlerts(fraudAlerts);
      setApiError(null);
    } catch (err) {
      setApiError(
        "Could not reach the backend API at the configured URL. Run `npm start` inside /backend, then reload."
      );
    } finally {
      setLoadingAlerts(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomers();
    refreshTransactions();
  }, [refreshCustomers, refreshTransactions]);

    const handleDeleteCustomer = useCallback((customerId) => {
    deleteCustomer(customerId);
    refreshCustomers();
  }, [refreshCustomers]);

  const handleDeleteTransaction = useCallback(async (id) => {
    try {
      await api.deleteTransaction(id);
      refreshTransactions();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }, [refreshTransactions]);

  const meta = PAGE_META[page];

  return (
    <div className="app-shell">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="main">
        <div className="page-header">
          <h1>{meta.title}</h1>
          <p>{meta.desc}</p>
        </div>

        {apiError && <div className="status-line error" style={{ marginBottom: 18 }}>{apiError}</div>}

        {page === "dashboard" && <Dashboard customers={customers} transactions={transactions} />}

        {page === "kyc" && (
          <>
                        <KYCForm customers={customers} onRegistered={refreshCustomers} />
            <CustomerList customers={customers} onDelete={handleDeleteCustomer} />
          </>
        )}

        {page === "payments" && (
          <>
                        <TransactionForm customers={customers} onCreated={refreshTransactions} />
            <TransactionList transactions={transactions} onUpdated={refreshTransactions} onDelete={handleDeleteTransaction} />
          </>
        )}

        {page === "fraud" && <FraudAlerts alerts={alerts} loading={loadingAlerts} />}

        {page === "reports" && <ExcelExport customers={customers} transactions={transactions} />}
      </main>
    </div>
  );
}
