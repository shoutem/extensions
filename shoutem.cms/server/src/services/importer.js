import _ from 'lodash';
import i18next from 'i18next';
import { invalidate } from '@shoutem/redux-io';
import { IMPORTER_STATUSES, IMPORT_CAPABILITIES } from '../const';
import { CATEGORIES } from '../types';
import { loadImporters } from '../actions';
import LOCALIZATION from './localization';

const MAX_RETRIES = 30;
const IMPORTER_INTERVAL = 8000;
let RETRY_COUNTER = 0;
let IMPORTER_INTERVAL_REF = null;

export function getImporterCapabilities(shortcut) {
  const capabilities = _.get(shortcut, 'capabilities');
  const values = _.values(IMPORT_CAPABILITIES);

  return _.intersection(capabilities, values);
}

export function getImporterType(importer) {
  return _.get(importer, 'source.type');
}

export function getImporterStatusMessage(importer) {
  return _.get(importer, 'status.lastRun.message');
}

export function getImporterTitle(importer) {
  const type = getImporterType(importer);

  if (type === 'csv') {
    return _.get(importer, 'source.parameters.presentable_file_url');
  }

  if (type === 'rss') {
    return _.get(importer, 'source.parameters.feed_url');
  }

  return null;
}

export function getImporterStatus(importer) {
  return _.get(importer, 'status.lastRun.status');
}

export function getLastStartedOn(importer) {
  return _.get(importer, 'status.lastRun.started_on');
}

export function showImporterMessage(importer) {
  const status = getImporterStatus(importer);

  if (
    status === IMPORTER_STATUSES.FAILED ||
    status === IMPORTER_STATUSES.SUCCEDED_WITH_ERRORS ||
    status === IMPORTER_STATUSES.SUCCEDED_WITH_ERRORS_1
  ) {
    return true;
  }

  return false;
}

export function getTranslatedImporterStatus(importer) {
  const status = getImporterStatus(importer);

  if (status === IMPORTER_STATUSES.QUEUED) {
    return i18next.t(LOCALIZATION.IMPORT_STATUS_QUEUED);
  }

  if (status === IMPORTER_STATUSES.RUNNING) {
    return i18next.t(LOCALIZATION.IMPORT_STATUS_RUNNING);
  }

  if (status === IMPORTER_STATUSES.STOPPED) {
    return i18next.t(LOCALIZATION.IMPORT_STATUS_STOPPED);
  }

  if (status === IMPORTER_STATUSES.FAILED) {
    return i18next.t(LOCALIZATION.IMPORT_STATUS_FAILED);
  }

  if (status === IMPORTER_STATUSES.SUCCEDED) {
    return i18next.t(LOCALIZATION.IMPORT_STATUS_SUCCEDED);
  }

  if (
    status === IMPORTER_STATUSES.SUCCEDED_WITH_ERRORS ||
    status === IMPORTER_STATUSES.SUCCEDED_WITH_ERRORS_1
  ) {
    return i18next.t(LOCALIZATION.IMPORT_STATUS_SUCCEDED_WITH_ERRORS);
  }

  return i18next.t(LOCALIZATION.IMPORT_STATUS_NONE);
}

function resetStatusOfImporters() {
  clearInterval(IMPORTER_INTERVAL_REF);
  IMPORTER_INTERVAL_REF = null;
  RETRY_COUNTER = 0;
}

export function checkStatusOfImporters(
  appId,
  groupId,
  canonicalName,
  importers,
) {
  return dispatch => {
    let inProgress = false;

    _.forEach(importers, importer => {
      const status = getImporterStatus(importer);

      if (
        status === IMPORTER_STATUSES.QUEUED ||
        status === IMPORTER_STATUSES.RUNNING
      ) {
        inProgress = true;
        return false;
      }

      return true;
    });

    if (!inProgress) {
      if (IMPORTER_INTERVAL_REF) {
        dispatch(invalidate(CATEGORIES));
        dispatch(invalidate(canonicalName));
        resetStatusOfImporters();
      }

      return;
    }

    // ref already exist
    if (IMPORTER_INTERVAL_REF) {
      return;
    }

    IMPORTER_INTERVAL_REF = setInterval(() => {
      if (RETRY_COUNTER >= MAX_RETRIES) {
        resetStatusOfImporters();
        return;
      }

      RETRY_COUNTER++;

      // setting different tag to avoid status changes on main importer collection
      dispatch(loadImporters(appId, groupId, 'importer-status')).catch(
        () => null,
      );
    }, IMPORTER_INTERVAL);
  };
}
