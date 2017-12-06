import { isEmail } from 'validator';

function validateNick(username) {
  if (!username) {
    return 'Username is required';
  }

  if (username.length < 3) {
    return 'Username is too short';
  }

  return null;
}

function validateEmail(email) {
  if (!email) {
    return 'Email is required';
  }

  if (!isEmail(email)) {
    return 'Email is not valid';
  }

  return null;
}

function validateMemberPassword(password) {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password is too short';
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
