import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { isBusy, isInitialized, isValid, next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListView, Spinner, View } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { authenticate, getUser } from 'shoutem.auth/redux';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { user as userShape } from '../components/shapes';
import { ext } from '../const';
import { loadBlockedUsers, selectors, unblockUser } from '../redux';
import { openProfileForLegacyUser, openUnblockActionSheet } from '../services';

export class BlockedUsers extends RemoteDataListScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  fetchData() {
    const { loadBlockedUsers } = this.props;

    loadBlockedUsers();
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());

    this.fetchData();
  }

  componentDidUpdate() {}

  getNavBarProps() {
    const {
      shortcut: { title = '' },
    } = getRouteParams(this.props);

    return {
      title: title.toUpperCase(),
    };
  }

  handleUnblockPress(user) {
    const {
      authenticate,
      unblockUser,
      currentUser: { legacyId: currentUserId = '' },
      loadBlockedUsers,
    } = this.props;
    const userId = _.get(user, 'legacyId');

    const handleUnblockUser = () =>
      authenticate(() =>
        unblockUser(userId, currentUserId).then(loadBlockedUsers),
      );

    return openUnblockActionSheet(handleUnblockUser);
  }

  renderRow(user) {
    const { openProfile } = this.props;

    return (
      <MemberView
        openProfile={openProfile}
        user={user}
        onMenuPress={this.handleUnblockPress}
        isBlocked
      />
    );
  }

  renderData(data) {
    const { style } = this.props;

    if (!isValid(data) || (isBusy(data) && !isInitialized(data))) {
      return (
        <View styleName="flexible horizontal h-center v-center">
          <Spinner />
        </View>
      );
    }

    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={isBusy(data)}
        onLoadMore={this.loadMore}
        onRefresh={this.fetchData}
        renderRow={this.renderRow}
        style={style.list}
      />
    );
  }
}

BlockedUsers.propTypes = {
  ...RemoteDataListScreen.propTypes,
  navigation: PropTypes.object.isRequired,
  next: PropTypes.func.isRequired,
  currentUser: userShape,
  data: PropTypes.arrayOf(userShape),
  users: PropTypes.arrayOf(userShape),
};

BlockedUsers.defaultProps = {
  title: null,
};

const mapStateToProps = state => {
  return {
    data: selectors.getBlockedUsersData(state),
    users: selectors.getAllUsers(state),
    currentUser: getUser(state) || {},
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      authenticate,
      loadBlockedUsers,
      navigateTo,
      next,
      unblockUser,
    },
    dispatch,
  ),
  openProfile: openProfileForLegacyUser(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('BlockedUsers'))(BlockedUsers));
