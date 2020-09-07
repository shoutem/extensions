import SendBird from 'sendbird';

let SendBirdInstance = null;

function disconnect() {
  if (SendBirdInstance) {
    SendBirdInstance.disconnect();
  }
}

export function init(appId) {
  SendBirdInstance = new SendBird({ appId });

  return new Promise((resolve, reject) => {
    SendBirdInstance.connect('SHOUTEM_INTEGRATION_USER', (users, error) => {
      if (error) {
        reject(error);
      }

      disconnect();
      resolve(users);
    });
  });
}

export default {
  Client: SendBirdInstance,
  init,
};
