import React from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { InteractionManager } from 'react-native';
import { bindActionCreators } from 'redux';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListView } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { authenticate, getUser } from 'shoutem.auth/redux';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { user as userShape } from '../components/shapes';
import { ext } from '../const';
import { unblockUser, loadUsers, selectors } from '../redux';
import { openProfileForLegacyUser, openUnblockActionSheet } from '../services';

export class BlockedUsers extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    data: PropTypes.arrayOf(userShape),
    users: PropTypes.arrayOf(userShape),
    currentUser: userShape,
    navigation: PropTypes.object.isRequired,
    next: _.noop,
  };

  static defaultProps = {
    title: null,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  fetchData() {
    const { users, loadUsers } = this.props;

    if (_.isEmpty(users)) {
      InteractionManager.runAfterInteractions(() => {
        loadUsers();
      });
    }
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
    this.fetchData();
  }

  // Overwrite RemoteDataListScreen refreshData
  // to avoid infinite loading
  refreshData() {}

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
    } = this.props;
    const userId = _.get(user, 'legacyId');

    const handleUnblockUser = () =>
      authenticate(() => unblockUser(userId, currentUserId));

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
    const { style, users } = this.props;

    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={isBusy(users) || !isInitialized(users)}
        onRefresh={this.fetchData}
        renderRow={this.renderRow}
        style={style.list}
      />
    );
  }
}

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
      navigateTo,
      loadUsers,
      authenticate,
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
