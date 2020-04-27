import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ActionSheet from 'react-native-action-sheet';
import { Alert } from 'react-native';
import autoBind from 'auto-bind';
import moment from 'moment';
import _ from 'lodash';
import {
  View,
  Image,
  Subtitle,
  Caption,
  Divider,
  TouchableOpacity,
  Lightbox,
  Button,
  Icon,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { adaptSocialUserForProfileScreen, formatLikeText } from '../services';
import CommentButton from './CommentButton';
import HtmlTextView from './HtmlTextView';
import LikeButton from './LikeButton';
import { post as postShape } from './shapes';

const { func, bool } = PropTypes;

function handleClickOnReport() {
  const OPTIONS = [
    I18n.t(ext('reportOptionSpam')),
    I18n.t(ext('reportOptionInappropriate')),
    I18n.t(ext('reportOptionAbuse')),
    I18n.t(ext('reportOptionCancel')),
  ];

  ActionSheet.showActionSheetWithOptions(
    {
      options: OPTIONS,
      cancelButtonIndex: 3,
      title: I18n.t(ext('reportActionSheetTitle')),
      message: I18n.t(ext('reportActionSheetMessage')),
      tintColor: 'black',
    },
    (index) => {
      if (index >= 0 && index <= 2) {
        Alert.alert(
          I18n.t(ext('reportSuccessTitle')),
          I18n.t(ext('reportSuccessMessage')),
        );
      }
    },
  );
}

class StatusView extends PureComponent {
  static propTypes = {
    status: postShape.isRequired,
    addComment: func.isRequired,
    openUserLikes: func.isRequired,
    openStatusDetails: func,
    onLikeAction: func,
    openProfile: func,
    showUsersWhoLiked: bool,
    enableImageFullScreen: bool,
    enableInteractions: bool,
    enableComments: bool,
  };

  static defaultProps = {
    openStatusDetails: _.noop,
    enableImageFullScreen: false,
    enableInteractions: true,
    enableComments: true,
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  handleClickOnStatus() {
    const { status, openStatusDetails } = this.props;

    openStatusDetails(status.id);
  }

  handleClickOnComments() {
    this.handleClickOnStatus();
  }

  handleClickOnUser() {
    const { status, openProfile } = this.props;

    const { user } = status;

    openProfile(adaptSocialUserForProfileScreen(user));
  }

  handleClickOnLikes() {
    const { status, openUserLikes } = this.props;

    openUserLikes(status);
  }

  renderHeader() {
    const { status, style } = this.props;

    const { user, created_at } = status;
    const userProfileImage = user.profile_image_url || undefined;

    return (
      <View styleName="horizontal v-center space-between stretch">
        <View styleName="horizontal v-center">
          <TouchableOpacity onPress={this.handleClickOnUser}>
            <Image
              source={{ uri: userProfileImage }}
              styleName="small-avatar placeholder"
            />
          </TouchableOpacity>
          <View styleName="vertical md-gutter-left">
            <Subtitle>{`${user.name}`}</Subtitle>
            <Caption>{moment(created_at).fromNow()}</Caption>
          </View>
        </View>
        <Button onPress={handleClickOnReport} styleName="clear tight">
          <Icon name="error" style={style.reportButton} />
        </Button>
      </View>
    );
  }

  renderStatusText() {
    const { status: { text } } = this.props;

    return (
      <TouchableOpacity onPress={this.handleClickOnStatus}>
        <View>
          <HtmlTextView
            styleName="md-gutter-top"
            text={text}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderStatusAttachments() {
    const { status, enableImageFullScreen } = this.props;

    const { shoutem_attachments: attachments } = status;
    const hasPicture = _.get(attachments, [0, 'type']) === 'picture';

    if (!hasPicture) {
      return null;
    }

    if (enableImageFullScreen) {
      return (
        <Lightbox activeProps={{ styleName: 'preview' }}>
          <Image
            source={{ uri: attachments[0].url_large }}
            styleName="large-wide"
          />
        </Lightbox>
      );
    }

    return (
      <Image
        source={{ uri: attachments[0].url_large }}
        styleName="large-wide"
      />
    );
  }

  renderLikesAndCommentsInfo() {
    const {
      status,
      enableInteractions,
      enableComments,
      showUsersWhoLiked,
    } = this.props;

    const likesDisplayLabel = formatLikeText(status, showUsersWhoLiked);
    const numOfComments = _.get(status, 'shoutem_reply_count', 0);
    const commentsDisplayLabel = I18n.t(ext('numberOfComments'), {
      count: numOfComments,
    });

    if (!enableInteractions && !enableComments) {
      return <View styleName="sm-gutter" />;
    }

    return (
      <View styleName="horizontal solid space-between md-gutter">
        {enableInteractions && (
          <TouchableOpacity onPress={this.handleClickOnLikes}>
            <Caption>{likesDisplayLabel}</Caption>
          </TouchableOpacity>
        )}
        {enableComments && (
          <TouchableOpacity onPress={this.handleClickOnComments}>
            <Caption>{commentsDisplayLabel}</Caption>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  renderButtons() {
    const {
      status,
      addComment,
      onLikeAction,
      enableComments,
      enableInteractions,
    } = this.props;

    return (
      <View styleName="horizontal flexible">
        <Divider styleName="line" />
        {enableInteractions && (
          <LikeButton
            onLikeAction={onLikeAction}
            status={status}
          />
        )}
        {enableComments && (
          <CommentButton
            addComment={addComment}
            status={status}
          />
        )}
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    return (
      <View styleName="vertical">
        <View styleName="vertical solid md-gutter">
          {this.renderHeader()}
          {this.renderStatusText()}
        </View>
        <TouchableOpacity onPress={this.handleClickOnStatus}>
          {this.renderStatusAttachments()}
        </TouchableOpacity>
        {this.renderLikesAndCommentsInfo()}
        {this.renderButtons()}
      </View>
    );
  }
}

export default connectStyle(ext('StatusView'))(StatusView);
