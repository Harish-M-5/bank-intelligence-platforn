import React from "react";
import { exportCustomerReport, exportTransactionReport, exportKYCReport } from "../utils/excelExport";

export default function ExcelExport({ customers, transactions }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Excel reports</h2>
        <span className="api-pill">SheetJS · .xlsx</span>
      </div>
      <div className="panel-body">
        <p style={{ color: "var(--slate)", fontSize: 13.5, marginTop: 0 }}>
          Download your importants reports
        </p>
        <div className="export-row">
          <button className="btn secondary" onClick={() => exportCustomerReport(customers)}>
            Download customer report
          </button>
          <button className="btn secondary" onClick={() => exportTransactionReport(transactions)}>
            Download transaction report
          </button>
          <button className="btn secondary" onClick={() => exportKYCReport(customers)}>
            Download KYC report
          </button>
        </div>
      </div>
    </div>
  );
}
