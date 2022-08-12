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

export const EXPORT_CAPABILITIES = {
  CSV: 'shoutem.cms.export-csv',
};

export const SEARCH_CAPABILITIES = {
  SEARCH: 'shoutem.cms.search',
  FILTER: 'shoutem.cms.filter',
};

export const SORT_OPTIONS = {
  MANUAL: 'manual',
  CREATED_TIME: 'timeCreated',
  UPDATED_TIME: 'timeUpdated',
};
