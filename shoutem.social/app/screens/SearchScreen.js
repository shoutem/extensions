import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { clear, isBusy } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Divider, ListView, Screen, SearchField, View } from '@shoutem/ui';
import { USER_SCHEMA } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderTextButton } from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { ext } from '../const';
import { searchUsers, searchUsersNextPage } from '../redux';
import { getSearchUsers } from '../redux/selectors';

export function SearchScreen({
  searchData,
  searchUsersNextPage,
  searchUsers,
  clear,
  navigation,
  style,
}) {
  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft,
      headerRight,
    });
  }, []);

  const [text, setText] = useState('');

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

  function renderRow(user) {
    return <MemberView user={user} />;
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
    </Screen>
  );
}

SearchScreen.propTypes = {
  searchData: PropTypes.func,
  searchUsersNextPage: PropTypes.func,
  searchUsers: PropTypes.func,
  clear: PropTypes.func,
  navigation: PropTypes.object,
  style: PropTypes.object,
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
