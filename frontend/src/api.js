const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  getTransactions: () => request("/api/transactions"),
  getAlerts: () => request("/api/transactions/alerts"),
  createTransaction: (payload) =>
    request("/api/transactions", { method: "POST", body: JSON.stringify(payload) }),
  updateTransaction: (id, payload) =>
    request(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteTransaction: (id) => request(`/api/transactions/${id}`, { method: "DELETE" }),
  health: () => request("/health")
};
