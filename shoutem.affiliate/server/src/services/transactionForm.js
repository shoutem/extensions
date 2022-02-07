export function formatUsers(users) {
  return users.map(user => {
    const {
      legacyId,
      profile: { firstName, lastName },
    } = user;

    return {
      value: legacyId,
      label: `${firstName} ${lastName}`,
    };
  });
}
