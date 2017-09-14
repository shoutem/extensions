import React from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { next, isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { navigateTo, openInModal, closeModal, navigateBack } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  Screen,
  Row,
  Image,
  Text,
  View,
  Divider,
  TouchableOpacity,
  ListView,
} from '@shoutem/ui';

import { ListScreen, getExtensionSettings } from 'shoutem.application';
import { getUser, isAuthenticated } from 'shoutem.auth/redux';

import {
  fetchStatuses,
  createStatus,
  likeStatus,
  unlikeStatus,
} from '../redux';

import { openProfile, authenticate } from 'shoutem.auth';

import { ext } from '../const';
import StatusView from '../components/StatusView';

const { object } = React.PropTypes;

export class SocialWallScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    data: object, // overriden because data is object that contains property "data" which is array
  };

  constructor(props, context) {
    super(props, context);
    this.newStatus = this.newStatus.bind(this);
    this.addComment = this.addComment.bind(this);
    this.openStatusDetails = this.openStatusDetails.bind(this);
    this.openUserLikes = this.openUserLikes.bind(this);
    this.onLikeAction = this.onLikeAction.bind(this);
    this.captureListViewRef = this.captureListViewRef.bind(this);
    this.openMyProfile = this.openMyProfile.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderData = this.renderData.bind(this);
    this.renderAddNewStatusSection = this.renderAddNewStatusSection.bind(this);
    this.getUsersWhoLiked = this.getUsersWhoLiked.bind(this);
  }

  openStatusDetails(statusId) {
    const { navigateTo, user, data } = this.props;
    const status = _.find(data.data, { id: statusId });
    
    const route = {
      screen: ext('StatusDetailsScreen'),
      title: 'POST DETAILS',
      props: {
        user,
        statusId: statusId,
        addComment: this.addComment,
        openUserLikes: this.openUserLikes,
        onLikeAction: this.onLikeAction,
        scrollDownOnOpen: false,
      },
    };

    navigateTo(route);
  }

  addComment(statusId) {
    const { navigateTo, user } = this.props;

    const route = {
      screen: ext('StatusDetailsScreen'),
      title: 'POST DETAILS',
      props: {
        user,
        statusId,
        addComment: this.addComment,
        openUserLikes: this.openUserLikes,
        onLikeAction: this.onLikeAction,
        scrollDownOnOpen: true,
      },
    };

    navigateTo(route);
  }

  newStatus() {
    const { navigateTo, navigateBack, user, createStatus, extension } = this.props;

    const route = {
      screen: ext('CreateStatusScreen'),
      title: 'NEW STATUS',
      props: {
        title: 'NEW STATUS',
        placeholder: 'Share your thoughts',
        statusMaxLength: Number(_.get(this.props.extension, 'maxStatusLength', 140)),
        user,
        extension,
        onStatusCreated: (status, attachment) => {
          createStatus(status, attachment)
          .then(navigateBack())
          .then(this.listView.scrollTo({ y: 0 }));
        },
      },
    };

    navigateTo(route);
  }

  onLikeAction(status) {
    const { navigateTo, likeStatus, unlikeStatus, authenticate } = this.props;

    if (!status.liked) {
      authenticate(() => likeStatus(status.id));
    } else {
      unlikeStatus(status.id);
    }
  }

  getUsersWhoLiked(status) {
    return _.get(status, 'shoutem_favorited_by.users');
  }

  openUserLikes(status) {
    const { navigateTo } = this.props;

    const route = {
      screen: ext('MembersScreen'),
      title: 'LIKES',
      props: {
        users: this.getUsersWhoLiked,
        title: 'LIKES',
      },
    };

    navigateTo(route);
  }

  openMyProfile() {
    const { user, openProfile } = this.props;
    openProfile(user);
  }

  fetchData() {
    const { fetchStatuses } = this.props;

    InteractionManager.runAfterInteractions(() => {
      fetchStatuses();
    });
  }

  loadMore() {
    this.props.next(this.props.data);
  }

  captureListViewRef(component) {
    this.listView = component;
  }

  renderRow(data) {
    const { extension, openProfile } = this.props;

    return (
      <View styleName="sm-gutter-bottom">
        <StatusView
          status={data}
          extension={extension}
          openStatusDetails={this.openStatusDetails}
          openUserLikes={this.openUserLikes}
          addComment={this.addComment}
          onLikeAction={this.onLikeAction}
          openProfile={openProfile}
        />
      </View>
    );
  }

  getListProps() {
    return {
      data: this.props.data.data,
      ref: this.captureListViewRef,
    };
  }

  renderAddNewStatusSection() {
    const { user } = this.props;
    const { profile_image_url } = user;

    return (
      <TouchableOpacity onPress={this.newStatus}>
        <View styleName="sm-gutter-bottom">
          <Row styleName="small">
            <TouchableOpacity onPress={this.openMyProfile}>
              <Image
                styleName="small-avatar"
                source={{ uri: profile_image_url }}
              />
            </TouchableOpacity>
            <Text styleName="sm-gutter-right md-gutter-left">Share your thoughts</Text>
          </Row>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { data, style, title } = this.props;

    return (
      <Screen style={style.screen}>
        <NavigationBar title={title.toUpperCase()} />
        <Divider styleName="line" />
        {this.renderAddNewStatusSection()}
        {this.renderData(data)}
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state[ext()].statuses,
  user: getUser(state) || {},
  extension: getExtensionSettings(state, ext()),
});

const mapDispatchToProps = {
  navigateTo,
  navigateBack,
  next,
  openInModal,
  closeModal,
  fetchStatuses,
  createStatus,
  likeStatus,
  unlikeStatus,
  openProfile,
  authenticate,
  isAuthenticated,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('SocialWallScreen'))(SocialWallScreen),
);
