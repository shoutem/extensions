import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  isBusy,
  isError,
  isInitialized,
  isValid,
  next,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  ActionSheet,
  EmptyStateView,
  ListView,
  Spinner,
  View,
} from '@shoutem/ui';
import {
  ext as applicationExt,
  RemoteDataListScreen,
} from 'shoutem.application';
import { authenticate, getUser } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { user as userShape } from '../components/shapes';
import { ext } from '../const';
import { loadBlockedUsers, selectors, unblockUser } from '../redux';
import { openProfileForLegacyUser } from '../services';

export class BlockedUsers extends RemoteDataListScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      actionSheetOpen: false,
      cancelOptions: [
        {
          title: I18n.t(ext('unblockOptionCancel')),
          onPress: this.handleActionSheetDismiss,
        },
      ],
    };
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

    return { title };
  }

  handleActionSheetDismiss() {
    this.setState({ actionSheetOpen: false });
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
      authenticate(() => {
        unblockUser(userId, currentUserId).then(loadBlockedUsers);
        this.handleActionSheetDismiss();
      });

    this.setState({
      confirmOptions: [
        {
          title: I18n.t(ext('unblockOption')),
          onPress: handleUnblockUser,
        },
      ],
      actionSheetOpen: true,
    });
  }

  handleMemberItemPress(user) {
    const { openProfileForLegacyUser, currentUser } = this.props;

    const isOwnUser =
      currentUser.legacyId?.toString() ===
      (user.legacyId ?? user.id)?.toString();

    openProfileForLegacyUser(user.legacyId, isOwnUser);
  }

  renderRow(user) {
    const { currentUser } = this.props;

    const isOwnUser =
      currentUser.legacyId?.toString() ===
      (user.legacyId ?? user.id)?.toString();

    return (
      <MemberView
        user={user}
        isOwnUser={isOwnUser}
        onMemberPress={this.handleMemberItemPress}
        onMenuPress={this.handleUnblockPress}
        isBlocked
      />
    );
  }

  renderPlaceholderView(data) {
    const { style = {} } = this.props;

    const emptyStateViewProps = {
      icon: 'error',
      message: isError(data)
        ? I18n.t(applicationExt('unexpectedErrorMessage'))
        : I18n.t(ext('emptyBlockedUsersListMessage')),
      onRetry: this.fetchData,
      retryButtonTitle: I18n.t(ext('reloadButton')),
      style: style.emptyState,
    };

    return <EmptyStateView {...emptyStateViewProps} />;
  }

  renderData(data) {
    const { style } = this.props;
    const { actionSheetOpen, cancelOptions, confirmOptions } = this.state;

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
      <>
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
        <ActionSheet
          active={actionSheetOpen}
          cancelOptions={cancelOptions}
          confirmOptions={confirmOptions}
          onDismiss={this.handleActionSheetDismiss}
        />
      </>
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
      openProfileForLegacyUser,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('BlockedUsers'))(BlockedUsers));
