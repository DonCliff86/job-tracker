// storage.js - CRUD operations for jobs using localStorage

const STORAGE_KEY = "jobTrackerPro.jobs";

// Get all jobs
export function getJobs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// Get a single job by ID
export function getJob(id) {
  return getJobs().find(job => job.id === id);
}

// Add a new job
export function addJob(job) {
  const jobs = getJobs();
  job.id = crypto.randomUUID();
  jobs.push(job);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  return job;
}

// Update an existing job
export function updateJob(updatedJob) {
  let jobs = getJobs();
  jobs = jobs.map(job => job.id === updatedJob.id ? updatedJob : job);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

// Delete a job by ID
export function deleteJob(id) {
  let jobs = getJobs();
  jobs = jobs.filter(job => job.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

// Bulk replace jobs (for import/reset)
export function setJobs(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}