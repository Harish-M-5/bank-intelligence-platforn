import React from "react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Customer 360", index: "01" },
  { id: "kyc", label: "Digital KYC", index: "02" },
  { id: "payments", label: "Payment Monitoring", index: "03" },
  { id: "fraud", label: "Fraud Alerts", index: "04" },
  { id: "reports", label: "Excel Reports", index: "05" }
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="wordmark">BIP</div>
      <div className="tagline">Banking intelligence Platforms</div>
      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={active === item.id ? "active" : ""}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-index">{item.index}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="rule-footer">
        FRAUD RULE<br />
        amt &gt; ₹100,000<br />
        OR failed txns ≥ 3
      </div>
    </aside>
  );
}
