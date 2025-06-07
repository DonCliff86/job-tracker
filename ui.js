// ui.js - render jobs, cards, bind UI events

import { getJobs, addJob, updateJob, deleteJob, getJob } from './storage.js';
import { updateChart } from './charts.js';

export function renderStats() {
  const jobs = getJobs();
  document.getElementById('appliedCount').textContent = jobs.filter(j => j.status === "applied").length;
  document.getElementById('interviewCount').textContent = jobs.filter(j => j.status === "interview").length;
  document.getElementById('offerCount').textContent = jobs.filter(j => j.status === "offer").length;
  document.getElementById('rejectedCount').textContent = jobs.filter(j => j.status === "rejected").length;
}

export function renderJobsTable(filterStatus = "all", search = "") {
  const jobs = getJobs();
  const tbody = document.getElementById('jobsTableBody');
  tbody.innerHTML = "";

  let filtered = jobs;
  if (filterStatus !== "all") filtered = filtered.filter(j => j.status === filterStatus);
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    filtered = filtered.filter(j => 
      j.company.toLowerCase().includes(s) ||
      j.position.toLowerCase().includes(s)
    );
  }

  for (const job of filtered) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${job.company}</td>
      <td>${job.position}</td>
      <td>${capitalize(job.status)}</td>
      <td>${job.appliedDate || ""}</td>
      <td>${job.deadline || ""}</td>
      <td>
        <button class="action-btn edit" title="Edit" data-id="${job.id}"><i class="fas fa-edit"></i></button>
        <button class="action-btn delete" title="Delete" data-id="${job.id}"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

export function bindJobForm({ onSave }) {
  const jobForm = document.getElementById('jobForm');
  jobForm.onsubmit = e => {
    e.preventDefault();
    const job = {
      id: jobForm.jobId.value || undefined,
      company: jobForm.company.value.trim(),
      position: jobForm.position.value.trim(),
      status: jobForm.status.value,
      appliedDate: jobForm.appliedDate.value,
      deadline: jobForm.deadline.value,
      notes: jobForm.notes.value.trim()
    };

    if (job.id) {
      updateJob(job);
    } else {
      addJob(job);
    }
    onSave?.();
  };
}

export function bindTableActions({ onEdit, onDelete }) {
  const tbody = document.getElementById('jobsTableBody');
  tbody.onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (btn.classList.contains('edit')) onEdit?.(id);
    if (btn.classList.contains('delete')) {
      if (confirm("Delete this job?")) onDelete?.(id);
    }
  };
}

export function bindFilters({ onFilter }) {
  document.getElementById('statusFilter').addEventListener('change', e => {
    onFilter();
  });
  document.getElementById('searchInput').addEventListener('input', e => {
    onFilter();
  });
}

export function getFilterStatus() {
  return document.getElementById('statusFilter').value;
}

export function getSearchTerm() {
  return document.getElementById('searchInput').value;
}

export function openEditModal(job) {
  const modal = document.getElementById('jobModal');
  document.getElementById('modalTitle').textContent = "Edit Job";
  document.getElementById('jobId').value = job.id;
  document.getElementById('company').value = job.company;
  document.getElementById('position').value = job.position;
  document.getElementById('status').value = job.status;
  document.getElementById('appliedDate').value = job.appliedDate;
  document.getElementById('deadline').value = job.deadline || "";
  document.getElementById('notes').value = job.notes || "";
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}