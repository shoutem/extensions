import i18next from 'i18next';
import { isEmail } from 'validator';
import LOCALIZATION from './localization';

function validateNick(username) {
  if (!username) {
    return i18next.t(LOCALIZATION.USERNAME_REQUIRED_MESSAGE);
  }

  if (username.length < 3) {
    return i18next.t(LOCALIZATION.USERNAME_TOO_SHORT_MESSAGE);
  }

  return null;
}

function validateEmail(email) {
  if (!email) {
    return i18next.t(LOCALIZATION.EMAIL_REQUIRED_MESSAGE);
  }

  if (!isEmail(email)) {
    return i18next.t(LOCALIZATION.EMAIL_INVALID_MESSAGE);
  }

  return null;
}

function validateMemberPassword(password) {
  if (!password) {
    return i18next.t(LOCALIZATION.PASSWORD_REQUIRED_MESSAGE);
  }

  if (password.length < 6) {
    return i18next.t(LOCALIZATION.PASSWORD_TOO_SHORT_MESSAGE);
  }

  return null;
}

export function validateUser(member) {
  const { id, nick, username: email, password } = member;

  return {
    username: !id && validateEmail(email),
    password: !id && validateMemberPassword(password),
    nick: validateNick(nick),
  };
}
