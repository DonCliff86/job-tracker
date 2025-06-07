// charts.js - Chart.js setup

import { getJobs } from './storage.js';

let chartInstance = null;

export function setupChart() {
  const ctx = document.getElementById('jobsChart');
  if (!ctx) return;
  chartInstance = new window.Chart(ctx, getChartConfig());
}

export function updateChart() {
  if (!chartInstance) return;
  const data = getStatusCounts();
  chartInstance.data.datasets[0].data = [data.applied, data.interview, data.offer, data.rejected];
  chartInstance.update();
}

function getStatusCounts() {
  const jobs = getJobs();
  return {
    applied: jobs.filter(j => j.status === "applied").length,
    interview: jobs.filter(j => j.status === "interview").length,
    offer: jobs.filter(j => j.status === "offer").length,
    rejected: jobs.filter(j => j.status === "rejected").length
  };
}

function getChartConfig() {
  const counts = getStatusCounts();
  return {
    type: 'doughnut',
    data: {
      labels: ["Applied", "Interview", "Offer", "Rejected"],
      datasets: [{
        data: [counts.applied, counts.interview, counts.offer, counts.rejected],
        backgroundColor: [
          "var(--primary)", "var(--secondary)", "var(--success)", "var(--danger)"
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  };
}