export const routes = {
  ROOT: '/',
  LOGIN: '/login',
  SANDBOX: '/sandbox',
  PROJECTS: '/projects',
  PROJECT: '/projects/:project_id',
  BATCHES: '/projects/:project_id/batches/:filter',
  BATCH: '/projects/:project_id/batches/:batch_id',
  JOBS: '/projects/:project_id/jobs/:filter',
  SCHEDULE_BATCHES: '/projects/:project_id/schedule/:filter',
  BATCH_DEFINITIONS: '/projects/:project_id/batches/definitions/:filter',
  JOB: '/projects/:project_id/jobs/:filter/job/:job_id',
  DEFINITIONS: '/projects/:project_id/definitions/:filter',
  DEFINITION: '/projects/:project_id/definitions/:filter/definition/:def_id',
};
 