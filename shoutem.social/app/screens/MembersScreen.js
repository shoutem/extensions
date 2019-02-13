import PropTypes from 'prop-types';
import React from 'react';
import { InteractionManager } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';
import { next } from '@shoutem/redux-io';
import {
  setStatus,
  createStatus,
  updateStatus,
  validationStatus
} from '@shoutem/redux-io/status';
import {
  ListView,
  View,
  Button,
  Icon,
} from '@shoutem/ui';

import { ListScreen } from 'shoutem.application';

import MemberView from '../components/MemberView';
import { user as userShape } from '../components/shapes';
import { loadUsers } from '../redux';
import { openProfileForLegacyUser } from '../services';
import { ext } from '../const';

export class MembersScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
      data: PropTypes.arrayOf(userShape),
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
    const { loadUsers } = this.props;

    InteractionManager.runAfterInteractions(() => {
      loadUsers();
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
    const { loadUsers } = this.props;
    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        {...this.getListProps()}
        getSectionId={this.getSectionId}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={loadUsers}
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    navigateTo,
    loadUsers: ownProps.users ? undefined : loadUsers,
    next,
  }, dispatch),
  openProfile: openProfileForLegacyUser(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MembersScreen'))(MembersScreen),
);
