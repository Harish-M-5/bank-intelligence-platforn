import * as XLSX from "xlsx";

function download(sheetData, sheetName, fileName) {
  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}

export function exportCustomerReport(customers) {
  const rows = customers.map((c) => ({
    "Customer ID": c.customerId,
    "Customer Name": c.customerName,
    Email: c.email,
    Phone: c.phone,
    "Document ID": c.documentId,
    "KYC Status": c.kycStatus,
    "Registered On": c.registeredOn
  }));
  download(rows, "Customers", `Customer_Report_${todayStamp()}.xlsx`);
}

export function exportTransactionReport(transactions) {
  const rows = transactions.map((t) => ({
    "Transaction ID": t.id,
    "Customer Name": t.customerName,
    "Customer ID": t.customerId,
    "Amount (₹)": t.amount,
    Date: t.date,
    Status: t.status,
    "Risk Level": t.riskLevel
  }));
  download(rows, "Transactions", `Transaction_Report_${todayStamp()}.xlsx`);
}

export function exportKYCReport(customers) {
  const rows = customers.map((c) => ({
    "Customer ID": c.customerId,
    "Customer Name": c.customerName,
    "Document ID": c.documentId,
    "KYC Status": c.kycStatus,
    "Registered On": c.registeredOn
  }));
  download(rows, "KYC Status", `KYC_Report_${todayStamp()}.xlsx`);
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}
