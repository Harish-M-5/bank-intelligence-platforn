import React, { useMemo } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const INK = "#10192b";
const EMERALD = "#1f6f52";
const AMBER = "#a9762c";
const CRIMSON = "#9c3c3c";
const GRID = "#e0dccf";

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: "IBM Plex Mono", size: 10 } } },
    y: { grid: { color: GRID }, ticks: { font: { family: "IBM Plex Mono", size: 10 } } }
  }
};

export default function Dashboard({ customers, transactions }) {
  const verified = customers.filter((c) => c.kycStatus === "Verified").length;
  const pending = customers.filter((c) => c.kycStatus === "Pending").length;

  const growthData = useMemo(() => buildGrowthSeries(customers), [customers]);
  const txnByDate = useMemo(() => buildTxnSeries(transactions), [transactions]);

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <div className="stat-label">Total customers</div>
          <div className="stat-value">{customers.length}</div>
        </div>
        <div className="stat accent-emerald">
          <div className="stat-label">Verified customers</div>
          <div className="stat-value">{verified}</div>
        </div>
        <div className="stat accent-amber">
          <div className="stat-label">Pending KYC</div>
          <div className="stat-value">{pending}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total transactions</div>
          <div className="stat-value">{transactions.length}</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="panel">
          <div className="panel-header"><h2>Customer growth</h2></div>
          <div className="panel-body">
            <div className="chart-box">
              <Line
                data={{
                  labels: growthData.labels,
                  datasets: [
                    {
                      label: "Cumulative customers",
                      data: growthData.values,
                      borderColor: INK,
                      backgroundColor: "rgba(16,25,43,0.06)",
                      fill: true,
                      tension: 0.25,
                      pointRadius: 3
                    }
                  ]
                }}
                options={baseOptions}
              />
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>KYC completion</h2></div>
          <div className="panel-body">
            <div className="chart-box">
              <Doughnut
                data={{
                  labels: ["Verified", "Pending", "Rejected"],
                  datasets: [
                    {
                      data: [
                        verified,
                        pending,
                        customers.filter((c) => c.kycStatus === "Rejected").length
                      ],
                      backgroundColor: [EMERALD, AMBER, CRIMSON],
                      borderWidth: 0
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } }
                }}
              />
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Transaction analytics</h2></div>
          <div className="panel-body">
            <div className="chart-box">
              <Bar
                data={{
                  labels: txnByDate.labels,
                  datasets: [
                    {
                      label: "Transaction volume (₹)",
                      data: txnByDate.values,
                      backgroundColor: txnByDate.values.map((_, i) =>
                        i === txnByDate.values.length - 1 ? INK : "#a9b0be"
                      )
                    }
                  ]
                }}
                options={baseOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function buildGrowthSeries(customers) {
  const sorted = [...customers].sort((a, b) => (a.registeredOn > b.registeredOn ? 1 : -1));
  const byDate = {};
  sorted.forEach((c) => {
    byDate[c.registeredOn] = (byDate[c.registeredOn] || 0) + 1;
  });
  const labels = Object.keys(byDate);
  let running = 0;
  const values = labels.map((d) => (running += byDate[d]));
  return { labels, values };
}

function buildTxnSeries(transactions) {
  const byDate = {};
  transactions.forEach((t) => {
    byDate[t.date] = (byDate[t.date] || 0) + Number(t.amount);
  });
  const labels = Object.keys(byDate).sort();
  return { labels, values: labels.map((d) => byDate[d]) };
}
