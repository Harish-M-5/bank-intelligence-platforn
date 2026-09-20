// All customer/KYC data lives in browser Local Storage, per the spec.
// Transactions live on the backend (see api.js) — this file only handles customers.

const CUSTOMERS_KEY = "BIP";

export function getCustomers() {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    return raw ? JSON.parse(raw) : seedCustomers();
  } catch {
    return seedCustomers();
  }
}

export function saveCustomers(customers) {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function addCustomer(customer) {
  const customers = getCustomers();
  const withDates = { ...customer, registeredOn: new Date().toISOString().slice(0, 10) };
  const updated = [...customers, withDates];
  saveCustomers(updated);
  return updated;
}

export function updateCustomerStatus(customerId, kycStatus) {
  const customers = getCustomers().map((c) =>
    c.customerId === customerId ? { ...c, kycStatus } : c
  );
  saveCustomers(customers);
  return customers;
}

function seedCustomers() {
  const seeded = [
    {
      customerName: "Ananya Rao",
      customerId: "CUST001",
      email: "ananya.rao@example.com",
      phone: "9876543210",
      documentId: "DOC-AR-2291",
      kycStatus: "Verified",
      registeredOn: "2026-08-02"
    },
    {
      customerName: "Vikram Shah",
      customerId: "CUST002",
      email: "vikram.shah@example.com",
      phone: "9845098450",
      documentId: "DOC-VS-7734",
      kycStatus: "Verified",
      registeredOn: "2026-08-11"
    },
    {
      customerName: "Priya Menon",
      customerId: "CUST003",
      email: "priya.menon@example.com",
      phone: "9900112233",
      documentId: "DOC-PM-4402",
      kycStatus: "Pending",
      registeredOn: "2026-09-05"
    }
  ];
  saveCustomers(seeded);
  return seeded;
}

export function generateCustomerId(existingCustomers) {
  const n = existingCustomers.length + 1;
  return `CUST${String(n).padStart(3, "0")}`;
}

export function isDuplicateCustomer(email, documentId, phone) {
  const customers = getCustomers();
  return customers.some(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase() ||
      c.documentId.toLowerCase() === documentId.toLowerCase() ||
      c.phone === phone
  );
}

export function deleteCustomer(customerId) {
  const updated = getCustomers().filter((c) => c.customerId !== customerId);
  saveCustomers(updated);
  return updated;
}
