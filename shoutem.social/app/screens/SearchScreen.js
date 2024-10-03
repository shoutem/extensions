import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { clear, isBusy } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  ActionSheet,
  Divider,
  ListView,
  Screen,
  SearchField,
  View,
} from '@shoutem/ui';
import { authenticate, getUser, USER_SCHEMA } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderTextButton } from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { ext } from '../const';
import {
  blockUser,
  loadBlockedUsers,
  searchUsers,
  searchUsersNextPage,
} from '../redux';
import { getSearchUsers } from '../redux/selectors';
import { openProfileForLegacyUser } from '../services';

export function SearchScreen({
  searchData,
  searchUsersNextPage,
  searchUsers,
  clear,
  navigation,
  style,
}) {
  const dispatch = useDispatch();

  const currentUser = useSelector(getUser);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft,
      headerRight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [text, setText] = useState('');
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState();

  const cancelOptions = useMemo(() => {
    return [
      {
        title: I18n.t(ext('cancelCommentSelectionOption')),
        onPress: () => setActionSheetOpen(false),
      },
    ];
  }, []);

  function handleTextChange(text) {
    const lowerCaseText = text.toLowerCase();

    setText(text);
    searchUsers(lowerCaseText);
  }

  function loadMore() {
    const lowerCaseText = text.toLowerCase();

    searchUsersNextPage(lowerCaseText, searchData);
  }

  function onCancel() {
    clear(USER_SCHEMA, 'searchUsers');
    goBack();
  }

  function resolveEmptyListMessage(text) {
    if (_.isEmpty(text)) {
      return I18n.t(ext('emptyStartSearchListMessage'));
    }

    return I18n.t(ext('emptySearchListMessage'), { text });
  }

  function resolveEmptyListTitle(text) {
    if (_.isEmpty(text)) {
      return I18n.t(ext('emptyStartSearchListTitle'));
    }

    return I18n.t(ext('emptySearchListTitle'));
  }

  function headerLeft() {
    const debouncedHandleTextChange = _.debounce(handleTextChange, 500);

    return (
      <View styleName="container full-width sm-gutter-vertical">
        <SearchField
          onChangeText={debouncedHandleTextChange}
          placeholder={I18n.t(ext('navBarSearchPlaceholder'))}
        />
      </View>
    );
  }

  function headerRight(props) {
    return (
      <HeaderTextButton
        title={I18n.t(ext('searchCancelButton'))}
        onPress={onCancel}
        {...props}
      />
    );
  }

  async function handleBlockUser(user) {
    const authenticateCallback = async currentUser => {
      await dispatch(blockUser(user.legacyId, currentUser.legacyId));
      await dispatch(loadBlockedUsers);
    };

    await dispatch(authenticate(authenticateCallback));
    setActionSheetOpen(false);
  }

  function handleReportUser() {
    setActionSheetOpen(false);

    Alert.alert(
      I18n.t(ext('reportSuccessTitle')),
      I18n.t(ext('reportSuccessMessage')),
    );
  }

  function handleMenuPress(user) {
    setConfirmOptions([
      {
        title: I18n.t(ext('blockOption')),
        onPress: () => handleBlockUser(user),
      },
      {
        title: I18n.t(ext('reportOption')),
        onPress: handleReportUser,
      },
    ]);

    setActionSheetOpen(true);
  }

  function handleMemberItemPress(user) {
    const isOwnUser =
      currentUser.legacyId?.toString() ===
      (user.legacyId ?? user.id)?.toString();

    dispatch(openProfileForLegacyUser(user.legacyId, isOwnUser));
  }

  function renderRow(user) {
    const isOwnUser =
      currentUser.legacyId?.toString() ===
      (user.legacyId ?? user.id)?.toString();

    return (
      <MemberView
        user={user}
        isOwnUser={isOwnUser}
        onMenuPress={handleMenuPress}
        onMemberPress={handleMemberItemPress}
      />
    );
  }

  return (
    <Screen styleName="paper">
      <Divider styleName="line" />
      <ListView
        data={searchData}
        emptyListMessage={resolveEmptyListMessage(text)}
        emptyListTitle={resolveEmptyListTitle(text)}
        loading={isBusy(searchData)}
        contentContainerStyle={style.contentContainerStyle}
        onLoadMore={loadMore}
        renderRow={renderRow}
      />
      <ActionSheet
        active={actionSheetOpen}
        cancelOptions={cancelOptions}
        confirmOptions={confirmOptions}
        onDismiss={() => setActionSheetOpen(false)}
      />
    </Screen>
  );
}

SearchScreen.propTypes = {
  clear: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  searchData: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  searchUsersNextPage: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
};

export function mapStateToProps(state) {
  return {
    users: state[ext()].users,
    searchData: getSearchUsers(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    searchUsers: term => dispatch(searchUsers(term)),
    searchUsersNextPage: (term, currentData) =>
      dispatch(searchUsersNextPage(term, currentData)),
    clear: (schema, tag) => dispatch(clear(schema, tag)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SearchScreen'))(SearchScreen));
