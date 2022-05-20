import { find, next } from '@shoutem/redux-io';
import { getShortcut } from 'shoutem.application';
import { buildFeedUrl } from './selectors';

const DEFAULT_PAGE_LIMIT = 20;

function createConfig(headers, endpoint) {
  return {
    ...(endpoint && endpoint),
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': '',
        ...headers,
      },
    },
  };
}

export function loadFeed(schema, tag, shortcutId, options = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const shortcut = getShortcut(state, shortcutId);
    const feedUrl = shortcut?.settings?.feedUrl;

    const config = {
      schema,
      request: {
        endpoint: buildFeedUrl(state, schema),
        headers: {
          Accept: 'application/vnd.api+json',
          // Has to be defined as empty string, to override CMS's generic resourceConfigResolver. It appends 'Content-Type': 'application/vnd.api+json',
          // which breaks our rss proxy - RIO find requests -> https://fiveminutes.jira.com/browse/SEEXT-11781
          'Content-Type': '',
        },
      },
    };

    return dispatch(
      find(config, tag, {
        query: {
          'filter[url]': feedUrl,
          'page[limit]': options.pageLimit || DEFAULT_PAGE_LIMIT,
        },
      }),
    );
  };
}

export function loadNextFeedPage(collection, headers = {}, endpoint = null) {
  return dispatch => {
    const config = createConfig(endpoint, headers);

    dispatch(next(collection, true, config));
  };
}
