export const IMPORTER_STATUSES = {
  NONE: 'none',
  QUEUED: 'queued',
  RUNNING: 'running',
  STOPPED: 'stopped',
  FAILED: 'failed',
  SUCCEDED: 'succeeded',
  SUCCEDED_WITH_ERRORS: 'succeeded_with_errors',
  SUCCEDED_WITH_ERRORS_1: 'Import completed with errors',
};

export const IMPORTER_SCHEDULE_SETTINGS = {
  ONCE: 'norepeat',
};

export const IMPORT_CAPABILITIES = {
  CSV: 'shoutem.cms.import-csv',
  RSS: 'shoutem.cms.import-rss',
};
