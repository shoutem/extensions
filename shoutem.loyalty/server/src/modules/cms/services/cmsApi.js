import autoBind from 'auto-bind';
import i18next from 'i18next';
import _ from 'lodash';
import Uri from 'urijs';
import LOCALIZATION from './localization';

export default class CmsApi {
  constructor() {
    autoBind(this);

    this.endpoint = null;
    this.sessionId = null;
  }

  init(endpoint) {
    if (!endpoint) {
      throw new Error(i18next.t(LOCALIZATION.ENDPOINT_REQUIRED_MESSAGE));
    }

    this.endpoint = new Uri(endpoint).host();
  }

  initSession(page) {
    const sessionId = _.get(page, 'pageContext.auth.session');

    if (!sessionId) {
      throw new Error(i18next.t(LOCALIZATION.CANNOT_CONNECT_MESSAGE));
    }

    this.sessionId = sessionId;
  }

  isInitialized() {
    return !!this.endpoint;
  }

  getUrl(path = '', query, withSession) {
    const cmsUri = new Uri(path)
      .protocol(location.protocol)
      .host(this.endpoint);

    if (_.isEmpty(query) && !withSession) {
      return cmsUri.toString();
    }

    const cmsQuery = withSession
      ? { ...query, session_id: this.sessionId }
      : query;

    return cmsUri.query(cmsQuery).toString();
  }
}
