export function getSearchContactsRequest(email: string, restBaseUri: string, accessToken: string): object {
  const endpoint = `${restBaseUri}contacts/v1/addresses/email/search`

  const body = {
    ChannelAddressList: [email],
    MaximumCount: 1,
  };

  return {
    method: 'POST',
    uri: endpoint,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(body),
  };
}

export function getCreateContactRequest(email: string, restBaseUri: string, accessToken: string): object {
  const endpoint = `${restBaseUri}contacts/v1/contacts`

  const body = {
    contactKey: email,
    attributeSets: [{
      name: "Email Addresses",
      items: [{
        values: [{
          name: "Email Address",
          value: email
        },
        {
          name: "HTML Enabled",
          value: true
        }]
      }]
    }
    ]
  };

  return {
    method: 'POST',
    uri: endpoint,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(body),
  };
}
