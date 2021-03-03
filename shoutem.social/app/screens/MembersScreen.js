import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isBusy, isInitialized, next } from '@shoutem/redux-io';
import {
  setStatus,
  createStatus,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import { connectStyle } from '@shoutem/theme';
import { ListView, View, Button, Icon } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { navigateTo } from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { user as userShape } from '../components/shapes';
import { getUsers, getUsersInGroups } from '../redux/selectors';
import { ext } from '../const';
import { loadUsers, loadUsersInGroups } from '../redux';
import { openProfileForLegacyUser } from '../services';

export class MembersScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(userShape),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { showAllUsers, userGroups, users } = this.props;
    const {
      showAllUsers: prevShowAllUsers,
      userGroups: prevUserGroups,
    } = prevProps;

    if (
      !users &&
      (showAllUsers !== prevShowAllUsers || userGroups !== prevUserGroups)
    ) {
      this.fetchData();
    }
  }

  openSearchScreen() {
    const { navigateTo } = this.props;

    const route = { screen: ext('SearchScreen') };

    navigateTo(route);
  }

  fetchData() {
    const {
      loadUsers,
      loadUsersInGroups,
      showAllUsers,
      users,
      visibleGroups,
    } = this.props;

    if (!users) {
      InteractionManager.runAfterInteractions(() => {
        if (showAllUsers) {
          loadUsers();
        } else {
          loadUsersInGroups(visibleGroups);
        }
      });
    }
  }

  getNavigationBarProps() {
    const { title } = this.props;

    return {
      title: title.toUpperCase(),
      renderRightComponent: this.renderRightComponent,
    };
  }

  renderRightComponent() {
    return (
      <Button onPress={() => this.openSearchScreen()}>
        <Icon name="search" />
      </Button>
    );
  }

  renderRow(user) {
    const { openProfile } = this.props;

    return (
      <View>
        <MemberView openProfile={openProfile} user={user} />
      </View>
    );
  }

  renderData(data) {
    const { style } = this.props;

    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={isBusy(data) || !isInitialized(data)}
        onLoadMore={this.loadMore}
        onRefresh={this.fetchData}
        renderRow={this.renderRow}
        style={style.list}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const users = _.get(ownProps, 'users');
  const userGroups = _.get(ownProps, 'shortcut.settings.userGroups', []);
  const visibleGroups = userGroups.length
    ? userGroups.filter(group => group.visible)
    : [];
  const visibleGroupIds = visibleGroups.length
    ? visibleGroups.map(group => group.id)
    : [];
  const showAllUsers = _.get(ownProps, 'shortcut.settings.showAllUsers', true);
  const visibleUsers = showAllUsers ? getUsers(state) : getUsersInGroups(state);

  // update status to valid to initialize data
  const initializedStatus = updateStatus(createStatus(), {
    validationStatus: validationStatus.VALID,
  });
  setStatus(visibleUsers, initializedStatus);
  if (users) {
    setStatus(users, initializedStatus);
  }

  return {
    data: users || visibleUsers,
    visibleGroups: visibleGroupIds,
    showAllUsers,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      navigateTo,
      loadUsers: ownProps.users ? undefined : loadUsers,
      loadUsersInGroups: ownProps.users ? undefined : loadUsersInGroups,
      next,
    },
    dispatch,
  ),
  openProfile: openProfileForLegacyUser(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MembersScreen'))(MembersScreen));
