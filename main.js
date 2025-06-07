// main.js - glue: bootstraps modules, handles theming & modal

import { renderStats, renderJobsTable, bindJobForm, bindTableActions, bindFilters, getFilterStatus, getSearchTerm, openEditModal } from './ui.js';
import { setupChart, updateChart } from './charts.js';
import { deleteJob, getJob } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeBtn = document.getElementById('themeToggle');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeBtn.querySelector('i');
    if(document.body.classList.contains('dark-theme')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });

  if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeBtn.querySelector('i').classList.remove('fa-moon');
    themeBtn.querySelector('i').classList.add('fa-sun');
  }

  // Modal logic
  const modal = document.getElementById('jobModal');
  const addJobBtn = document.getElementById('addJobBtn');
  const closeBtn = modal.querySelector('.close-btn');
  const cancelBtn = document.getElementById('cancelBtn');

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('jobForm').reset();
    document.getElementById('modalTitle').textContent = 'Add New Job';
    document.getElementById('jobId').value = "";
  }
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  addJobBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });

  // Set footer year
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Initial render
  function rerenderAll() {
    renderStats();
    renderJobsTable(getFilterStatus(), getSearchTerm());
    updateChart();
    closeModal();
  }

  // Table actions
  bindTableActions({
    onEdit: id => {
      openEditModal(getJob(id));
    },
    onDelete: id => {
      deleteJob(id);
      rerenderAll();
    }
  });

  // Job form
  bindJobForm({
    onSave: rerenderAll
  });

  // Filters
  bindFilters({
    onFilter: () => {
      renderJobsTable(getFilterStatus(), getSearchTerm());
    }
  });

  // Chart
  setupChart();

  // On first load
  rerenderAll();
});