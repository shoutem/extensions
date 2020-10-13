import PropTypes from 'prop-types';
import React from 'react';
import { InteractionManager } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';

import { next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  NavigationBar,
  navigateTo,
  openInModal,
  closeModal,
  navigateBack,
} from 'shoutem.navigation';
import {
  Screen,
  Row,
  Image,
  Text,
  View,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui';

import { RemoteDataListScreen } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import { authenticate } from 'shoutem.auth';
import { getUser, isAuthenticated } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';

import StatusView from '../components/StatusView';
import {
  loadStatuses,
  createStatus,
  likeStatus,
  unlikeStatus,
} from '../redux';
import { openProfileForLegacyUser } from '../services';
import { ext } from '../const';

const { object } = PropTypes;

export class SocialWallScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    data: object, // overriden because data is object that contains property "data" which is array
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
  }

  openStatusDetails(statusId, scrollDownOnOpen = false) {
    const {
      navigateTo,
      user,
      data,
      statusMaxLength,
      enableComments,
      enableInteractions,
      enablePhotoAttachments,
    } = this.props;

    const status = _.find(data.data, { id: statusId });
    const route = {
      screen: ext('StatusDetailsScreen'),
      title: I18n.t(ext('postDetailsTitle')),
      props: {
        user,
        statusId,
        status,
        addComment: this.addComment,
        openUserLikes: this.openUserLikes,
        onLikeAction: this.onLikeAction,
        statusMaxLength,
        enableComments,
        enableInteractions,
        enablePhotoAttachments,
        scrollDownOnOpen,
      },
    };

    navigateTo(route);
  }

  addComment(statusId) {
    this.openStatusDetails(statusId, true);
  }

  newStatus() {
    const {
      navigateTo,
      navigateBack,
      user,
      createStatus,
      statusMaxLength,
      enableComments,
      enableInteractions,
      enablePhotoAttachments,
    } = this.props;

    const route = {
      screen: ext('CreateStatusScreen'),
      title: I18n.t(ext('newStatusTitle')),
      props: {
        title: I18n.t(ext('newStatusTitle')),
        placeholder: I18n.t(ext('newStatusPlaceholder')),
        user,
        enablePhotoAttachments,
        statusMaxLength,
        onStatusCreated: (status, attachment) => {
          createStatus(status, attachment)
          .then(navigateBack())
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
      title: I18n.t(ext('viewStatusLikes')),
      props: {
        users: this.getUsersWhoLiked(status),
        title: I18n.t(ext('viewStatusLikes')),
      },
    };

    navigateTo(route);
  }

  openMyProfile() {
    const { user, openProfile } = this.props;

    openProfile(user);
  }

  fetchData() {
    const { loadStatuses } = this.props;

    InteractionManager.runAfterInteractions(() => {
      loadStatuses();
    });
  }

  loadMore() {
    const { data, next } = this.props;

    next(data);
  }

  renderRow(data) {
    const { enableComments, enableInteractions, openProfile } = this.props;

    return (
      <View styleName="sm-gutter-bottom">
        <StatusView
          status={data}
          openStatusDetails={this.openStatusDetails}
          openUserLikes={this.openUserLikes}
          addComment={this.addComment}
          onLikeAction={this.onLikeAction}
          openProfile={openProfile}
          enableComments={enableComments}
          enableInteractions={enableInteractions}
        />
      </View>
    );
  }

  getListProps() {
    const { data } = this.props;

    return {
      data: this.props.data.data,
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
            <Text styleName="sm-gutter-right md-gutter-left">{I18n.t(ext('newStatusPlaceholder'))}</Text>
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

const mapStateToProps = (state) => {
  const extension = getExtensionSettings(state, ext());

  return {
    data: state[ext()].statuses,
    user: getUser(state) || {},
    statusMaxLength: Number(_.get(extension, 'maxStatusLength', 140)),
    enablePhotoAttachments: _.get(extension, 'enablePhotoAttachments', true),
    enableComments: _.get(extension, 'enableComments', true),
    enableInteractions: _.get(extension, 'enableInteractions', true),
  }
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    navigateTo,
    navigateBack,
    next,
    openInModal,
    closeModal,
    loadStatuses,
    createStatus,
    likeStatus,
    unlikeStatus,
    authenticate,
    isAuthenticated,
  }, dispatch),
  openProfile: openProfileForLegacyUser(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('SocialWallScreen'))(SocialWallScreen),
);
