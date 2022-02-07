import React, { useMemo } from 'react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import UserTableProfileCell from '../user-table-profile-cell';
import LOCALIZATION from './localization';
import './style.scss';

export default function UserTableRow({
  user,
  onRowClicked,
  profileFormFields,
}) {
  const { username, approved, profile } = user;

  const userValues = useMemo(
    () => _.map(profileFormFields, field => profile[field]),
    [profile, profileFormFields],
  );

  const statusClasses = useMemo(
    () =>
      classNames('user-table-row__status', {
        blocked: !approved,
      }),
    [approved],
  );

  const statusLabel = useMemo(
    () =>
      approved
        ? i18next.t(LOCALIZATION.STATUS_APPROVED_TITLE)
        : i18next.t(LOCALIZATION.STATUS_BLOCKED_TITLE),
    [approved],
  );

  return (
    <tr className="user-table-row" onClick={onRowClicked}>
      <td className="user-table-row__username text-ellipsis">{username}</td>
      <td className={statusClasses}>{statusLabel}</td>
      {_.map(userValues, (value, index) => (
        <UserTableProfileCell value={value} key={profileFormFields[index]} />
      ))}
    </tr>
  );
}

UserTableRow.propTypes = {
  profileFormFields: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  onRowClicked: PropTypes.func.isRequired,
};
