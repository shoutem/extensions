import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
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
import { ext } from '../const';
import { adaptSocialUserForProfileScreen, formatLikeText } from '../services';
import CommentButton from './CommentButton';
import HtmlTextView from './HtmlTextView';
import LikeButton from './LikeButton';
import { post as postShape } from './shapes';

function StatusView({
  status,
  enableImageFullScreen,
  enableInteractions,
  enableComments,
  showUsersWhoLiked,
  openProfile,
  openStatusDetails,
  onMenuPress,
  openUserLikes,
  addComment,
  onLikeAction,
  style,
}) {
  const handleOpenStatusDetails = () => {
    openStatusDetails(status.id);
  };

  const handleClickOnUser = () => {
    const user = _.get(status, 'user');

    openProfile(adaptSocialUserForProfileScreen(user));
  };

  const handleClickOnLikes = () => {
    openUserLikes(status);
  };

  const renderHeader = () => {
    // eslint-disable-next-line camelcase
    const created_at = _.get(status, 'user');
    const user = _.get(status, 'user');

    const userProfileImage = user?.profile_image_url || undefined;

    const handleMenuPress = () => onMenuPress(status);

    return (
      <View styleName="horizontal v-center space-between stretch">
        <View styleName="horizontal v-center">
          <TouchableOpacity onPress={handleClickOnUser}>
            <Image
              source={{ uri: userProfileImage }}
              styleName="small-avatar placeholder"
            />
          </TouchableOpacity>
          <View styleName="vertical md-gutter-left">
            <Subtitle>{`${user?.screen_name || user?.name}`}</Subtitle>
            <Caption>{moment(created_at).fromNow()}</Caption>
          </View>
        </View>
        <Button onPress={handleMenuPress} styleName="clear tight">
          <Icon name="more-horizontal" style={style.menuButton} />
        </Button>
      </View>
    );
  };

  const renderStatusText = () => {
    const text = _.get(status, 'text');

    return (
      <TouchableOpacity onPress={handleOpenStatusDetails}>
        <View>
          <HtmlTextView styleName="md-gutter-top" text={text} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatusAttachments = () => {
    const attachments = _.get(status, 'shoutem_attachments');
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
  };

  const renderLikesAndCommentsInfo = () => {
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
          <TouchableOpacity onPress={handleClickOnLikes}>
            <Caption>{likesDisplayLabel}</Caption>
          </TouchableOpacity>
        )}
        {enableComments && (
          <TouchableOpacity onPress={handleOpenStatusDetails}>
            <Caption>{commentsDisplayLabel}</Caption>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderButtons = () => {
    return (
      <View styleName="horizontal flexible">
        <Divider styleName="line" />
        {enableInteractions && (
          <LikeButton onLikeAction={onLikeAction} status={status} />
        )}
        {enableComments && (
          <CommentButton addComment={addComment} status={status} />
        )}
        <Divider styleName="line" />
      </View>
    );
  };

  return (
    <View styleName="vertical">
      <View styleName="vertical solid md-gutter">
        {renderHeader()}
        {renderStatusText()}
      </View>
      <TouchableOpacity onPress={handleOpenStatusDetails}>
        {renderStatusAttachments()}
      </TouchableOpacity>
      {renderLikesAndCommentsInfo()}
      {renderButtons()}
    </View>
  );
}

StatusView.propTypes = {
  status: postShape.isRequired,
  addComment: PropTypes.func.isRequired,
  openUserLikes: PropTypes.func.isRequired,
  openStatusDetails: PropTypes.func,
  onLikeAction: PropTypes.func,
  openProfile: PropTypes.func,
  showUsersWhoLiked: PropTypes.bool,
  onMenuPress: PropTypes.func,
  enableImageFullScreen: PropTypes.bool,
  enableInteractions: PropTypes.bool,
  enableComments: PropTypes.bool,
  style: PropTypes.object,
};

StatusView.defaultProps = {
  enableImageFullScreen: false,
  enableInteractions: true,
  enableComments: true,
  openStatusDetails: _.noop,
};

export default connectStyle(ext('StatusView'))(StatusView);
