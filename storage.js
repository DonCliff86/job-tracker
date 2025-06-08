

const STORAGE_KEY = "jobTrackerPro.jobs";

export function getJobs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getJob(id) {
  return getJobs().find(job => job.id === id);
}


export function addJob(job) {
  const jobs = getJobs();
  job.id = crypto.randomUUID();
  jobs.push(job);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  return job;
}


export function updateJob(updatedJob) {
  let jobs = getJobs();
  jobs = jobs.map(job => job.id === updatedJob.id ? updatedJob : job);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}


export function deleteJob(id) {
  let jobs = getJobs();
  jobs = jobs.filter(job => job.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function setJobs(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}
