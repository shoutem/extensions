import autoBindReact from 'auto-bind/react';

export default class ContactsApi {
  constructor() {
    autoBindReact(this);

    this.host = null;
    this.appId = null;
  }

  init(cloudHost, appId) {
    this.host = cloudHost;
    this.appId = appId.toString();
  }

  createEndpoint(path = '') {
    return `${this.host}/v1/${this.appId}/contacts/${path}`;
  }

  searchContacts(email) {
    const endpoint = this.createEndpoint('search');

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  }

  createContact(email) {
    const endpoint = this.createEndpoint('create');

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  }
}

export const contactsApi = new ContactsApi();
