import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';
import { next } from '@shoutem/redux-io';
import {
  setStatus,
  createStatus,
  updateStatus,
  validationStatus
} from '@shoutem/redux-io/status';

import {
  ListView,
  Screen,
  View,
  Divider,
  Button,
  Icon,
  Text,
} from '@shoutem/ui';

import { ListScreen } from 'shoutem.application';

import {
  fetchUsers,
} from '../redux';

import { openProfile } from 'shoutem.auth';

import { ext } from '../const';
import MemberView from '../components/MemberView';
import { user as userShape } from '../components/shapes';

export class MembersScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    title: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape({
      data: React.PropTypes.arrayOf(userShape),
    }),
  };

  constructor(props) {
    super(props);
    this.renderRightComponent = this.renderRightComponent.bind(this);
    this.openSearchScreen = this.openSearchScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  openSearchScreen() {
    const { navigateTo } = this.props;

    const route = {
      screen: ext('SearchScreen'),
    };

    navigateTo(route);
  }

  fetchData() {
    const { fetchUsers } = this.props;

    InteractionManager.runAfterInteractions(() => {
      fetchUsers();
    });
  }

  getNavigationBarProps() {
    const { title } = this.props;

    return {
      title: title.toUpperCase(),
      renderRightComponent: this.renderRightComponent,
    };
  }

  getListProps() {
    return {
      data: this.props.data.data,
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
        <MemberView
          user={user}
          openProfile={openProfile}
        />
      </View>
    );
  }

  renderData(data) {
    const { fetchUsers } = this.props;
    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        {...this.getListProps()}
        getSectionId={this.getSectionId}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={fetchUsers}
        onLoadMore={this.loadMore}
        renderSectionHeader={this.renderSectionHeader}
        style={this.props.style.list}
        initialListSize={1}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const users = { data: ownProps.users };

  //update status to valid to initialize data
  const initializedStatus = updateStatus(createStatus(), {
    validationStatus: validationStatus.VALID
  });
  setStatus(users, initializedStatus);

  return {
    data: _.isEmpty(users.data) ? state[ext()].users : users,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({ 
  navigateTo,
  fetchUsers: ownProps.users ? undefined : fetchUsers,
  next,
  openProfile,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MembersScreen'))(MembersScreen),
);
