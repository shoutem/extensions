import React, { useCallback, useMemo, useState } from 'react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Table, UserTableRow } from '../../components';
import UserModal from '../user-modal';
import LOCALIZATION from './localization';
import './style.scss';

function formatUserProfileHeaders(profileForm) {
  return _.map(profileForm, (field, key) => ({
    id: key.toString(),
    type: 'text',
    value: field.title,
    className: 'table-header__profile',
  }));
}

function getUserColumnHeaders(profileForm, filter = {}) {
  const { username: usernameFilter } = filter;

  return [
    {
      id: 'username',
      type: 'input',
      value: usernameFilter,
      placeholder: i18next.t(LOCALIZATION.HEADER_FILTER_BY_EMAIL_TITLE),
      className: 'table-header__username',
    },
    {
      id: 'status',
      type: 'text',
      value: i18next.t(LOCALIZATION.HEADER_STATUS_TITLE),
      className: 'table-header__status',
    },
    ...formatUserProfileHeaders(profileForm),
  ];
}

export default function UsersDashboard({
  profileFormFields,
  users,
  filter,
  onFilterChange,
}) {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const toggleUserModalVisibility = useCallback(
    () => setUserModalVisible(prevModalVisible => !prevModalVisible),
    [],
  );

  const profileFormKeys = useMemo(
    () => _.map(profileFormFields, field => field.key),
    [profileFormFields],
  );

  const onUserClick = useCallback(
    user => {
      setSelectedUser(user);
      toggleUserModalVisibility();
    },
    [toggleUserModalVisibility],
  );

  function renderUserRow(user) {
    return (
      <UserTableRow
        key={user.id}
        user={user}
        profileFormFields={profileFormKeys}
        onRowClicked={() => onUserClick(user)}
      />
    );
  }

  return (
    <div className="users-dashboard">
      <span className="users-dashboard__title">
        {i18next.t(LOCALIZATION.USERS_TITLE)}
      </span>
      <Table
        className="users-table"
        columnHeaders={getUserColumnHeaders(profileFormFields, filter)}
        emptyPlaceholderText={i18next.t(
          LOCALIZATION.TABLE_EMPTY_PLACEHOLDER_MESSAGE,
        )}
        items={users}
        onFilterChange={onFilterChange}
        renderItem={renderUserRow}
      />
      {userModalVisible && (
        <UserModal
          user={selectedUser}
          profileFormFields={profileFormFields}
          onHide={toggleUserModalVisibility}
        />
      )}
    </div>
  );
}

UsersDashboard.propTypes = {
  profileFormFields: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.object,
};

UsersDashboard.defaultProps = {
  filter: {},
};
