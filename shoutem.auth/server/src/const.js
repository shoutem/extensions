import pack from '../package.json';

export default function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const FEATURES = {
  USER_REGISTRATION_EMAIL_NOTIFICATION: ext(
    'send-notification-email-for-user-registration-to-owner',
  ),
};
