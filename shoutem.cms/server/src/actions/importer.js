import { url } from 'environment';
import _ from 'lodash';
import Uri from 'urijs';
import { find, remove } from '@shoutem/redux-io';
import { ext } from 'context';
import { IMPORTERS } from '../types';

export function loadImporters(appId, groupId, tag = 'all-importers') {
  const params = {
    groupId,
  };

  const config = {
    schema: IMPORTERS,
    request: {
      endpoint: `//${url.legacy}/${appId}/importers/objects/importers`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext(tag), params);
}

export function deleteImporter(appId, importerId) {
  const config = {
    schema: IMPORTERS,
    request: {
      endpoint: `//${url.legacy}/${appId}/importers/objects/importers/${importerId}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const importer = {
    id: importerId,
    type: IMPORTERS,
  };

  return remove(config, importer);
}

export function loadCsvColumns(appId, groupId, fileUrl) {
  return () => {
    const legacyUrl = new Uri(`//${_.get(url, 'legacy')}`)
      .protocol(location.protocol)
      .segment('api')
      .toString();

    const data = {
      destination: {
        type: 'shoutem',
        parameters: {
          applicationId: appId,
          groupId,
          apiUrl: legacyUrl,
        },
      },
      source: {
        type: 'csv',
        parameters: {
          file_url: fileUrl,
        },
      },
    };

    const uriTemplate = `//${url.legacy}/${appId}/importers/objects/importers`;
    const importerUrl = new Uri(uriTemplate)
      .protocol(location.protocol)
      .toString();

    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    return fetch(importerUrl, options)
      .then(response => response.json())
      .then(data => {
        return _.get(
          data,
          'source.parameters.options.additional_choices.column_names',
        );
      });
  };
}

export function createImporter(
  appId,
  groupId,
  canonicalName,
  languageIds,
  schedule,
  source,
) {
  return dispatch => {
    const legacyUrl = new Uri(`//${_.get(url, 'legacy')}`)
      .protocol(location.protocol)
      .segment('api')
      .toString();

    const data = {
      destination: {
        type: 'shoutem',
        parameters: {
          applicationId: appId,
          groupId,
          apiUrl: legacyUrl,
          channelIds: languageIds,
          schemaCanonicalName: canonicalName,
        },
      },
      source,
      schedule: { repeat: schedule },
    };

    const config = {
      schema: IMPORTERS,
      request: {
        endpoint: `//${url.legacy}/${appId}/importers/objects/importers`,
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify(data),
      },
    };

    return dispatch(find(config, ext('create-importer')));
  };
}
