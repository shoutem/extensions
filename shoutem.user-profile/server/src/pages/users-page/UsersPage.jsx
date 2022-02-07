import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer, Paging } from '@shoutem/react-web-ui';
import { getExtension } from '@shoutem/redux-api-sdk';
import {
  hasNext,
  hasPrev,
  isBusy,
  isInitialized,
  shouldRefresh,
} from '@shoutem/redux-io';
import { UsersDashboard } from '../../fragments';
import {
  getUsers,
  loadNextUsersPage,
  loadPreviousUsersPage,
  loadUsers,
} from '../../redux';
import './style.scss';

export default function UsersPage({ appId, extensionName }) {
  const extension = useSelector(state => getExtension(state, extensionName));
  const {
    settings: { profileForm = '' },
  } = extension;

  const dispatch = useDispatch();

  const paging = useRef();

  const users = useSelector(getUsers);

  const [filter, setFilter] = useState({});
  const [limit, setLimit] = useState(null);
  const [offset, setOffset] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (shouldRefresh(users)) {
      dispatch(loadUsers(appId, filter, limit, offset));
    }
  }, [appId, dispatch, filter, limit, offset, users]);

  useEffect(() => {
    const { limit, offset } = paging?.current?.getPagingInfo();

    setLimit(limit);
    setOffset(offset);
  }, []);

  const handleFilterChange = useCallback(
    selectedFilter => {
      const newFilter = {
        ...filter,
        ...selectedFilter,
      };

      paging?.current?.reset();

      setFilter(newFilter);
      return dispatch(loadUsers(appId, newFilter, limit, offset));
    },
    [appId, dispatch, filter, limit, offset],
  );

  function handleNextPageClick() {
    setLoading(true);

    dispatch(loadNextUsersPage(users)).finally(() => setLoading(false));
  }

  function handlePreviousPageClick() {
    setLoading(true);

    dispatch(loadPreviousUsersPage(users)).finally(() => setLoading(false));
  }

  const profileFormObject = useMemo(() => JSON.parse(profileForm), [
    profileForm,
  ]);

  const fieldsSortedByDisplayPriority = useMemo(
    () =>
      _.sortBy(
        _.map(profileFormObject, (field, key) => ({ key, ...field })),
        ['displayPriority'],
      ),
    [profileFormObject],
  );

  const loading = isLoading || isBusy(users) || !isInitialized(users);

  return (
    <LoaderContainer
      className="user-profile-settings-page is-wide"
      isLoading={loading}
      isOverlay
    >
      <UsersDashboard
        users={users}
        filter={filter}
        onFilterChange={handleFilterChange}
        profileFormFields={fieldsSortedByDisplayPriority}
      />
      <Paging
        ref={paging}
        hasNext={hasNext(users)}
        hasPrevious={hasPrev(users)}
        onNextPageClick={handleNextPageClick}
        onPreviousPageClick={handlePreviousPageClick}
      />
    </LoaderContainer>
  );
}

UsersPage.propTypes = {
  appId: PropTypes.string.isRequired,
  extensionName: PropTypes.string.isRequired,
};
