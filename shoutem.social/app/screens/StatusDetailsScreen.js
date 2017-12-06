// @flow
import React, {
  Component,
} from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Platform, Keyboard } from 'react-native';
import _ from 'lodash';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connectStyle } from '@shoutem/theme';
import { ImagePicker, ActionSheet } from '@shoutem/ui-addons';
import { openInModal, navigateBack } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';

import { isBusy, isInitialized, next, hasNext } from '@shoutem/redux-io';

import {
  Button,
  ListView,
  Screen,
  View,
  Divider,
  TextInput,
  Text,
  Icon,
  Image,
  Row,
} from '@shoutem/ui';

import { openProfile, authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';

import StatusView from '../components/StatusView';
import CommentView from '../components/CommentView';
import { user as userShape } from '../components/shapes';
import { ext } from '../const';

import {
  fetchComments,
  createComment,
  deleteStatus,
  deleteComment,
} from '../redux';

const { array, number, func, bool } = PropTypes;

export class StatusDetailsScreen extends Component {
  static propTypes = {
    user: userShape.isRequired,
    comments: PropTypes.shape({
      data: array,
    }).isRequired,
    statusId: number.isRequired,
    statuses: array.isRequired,
    openUserLikes: func.isRequired,
    addComment: func.isRequired,
    onLikeAction: func.isRequired,
    fetchComments: func.isRequired,
    scrollDownOnOpen: bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStatusCommentClick = this.handleStatusCommentClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.captureScrollViewRef = this.captureScrollViewRef.bind(this);
    this.appendImage = this.appendImage.bind(this);
    this.discardImage = this.discardImage.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderAddCommentSection = this.renderAddCommentSection.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
    this.focusOnComment = this.focusOnComment.bind(this);
    this.scrollDownOnFocus = this.scrollDownOnFocus.bind(this);
    this.handleContentSizeChange = this.handleContentSizeChange.bind(this);
    this.calculateTextInputHight = this.calculateTextInputHight.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderLoadComments = this.renderLoadComments.bind(this);
    this.getCommentsLength = this.getCommentsLength.bind(this);
    this.loadMoreComments = this.loadMoreComments.bind(this);
    this.renderRightComponent = this.renderRightComponent.bind(this);
    this.isStatusAuthorOrAppOwner = this.isStatusAuthorOrAppOwner.bind(this);
    this.openActionSheet = this.openActionSheet.bind(this);

    this.state = {
      text: '',
      numberOfCharacters: 0,
      image64Data: undefined,
      height: 25,
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    const { statusId, fetchComments } = this.props;

    fetchComments(statusId);
  }

  onSubmit() {
    this.setState({ text: '', image64Data: undefined });
  }

  handleTextChange(text) {
    this.setState({ text });
  }

  handleStatusCommentClick() {
    const { createComment, statusId, authenticate } = this.props;
    const { text, image64Data } = this.state;

    authenticate(() => {
      createComment(statusId, text, image64Data)
        .then(this.onSubmit())
        .then(this.scrollDownOnComment());
      Keyboard.dismiss();
      this.setState({ text: '' });
    });
  }

  handleContentSizeChange(event) {
    this.setState({ height: event.nativeEvent.contentSize.height });
  }

  captureScrollViewRef(component) {
    this.scrollView = component;
  }

  getCommentsLength() {
    return this.props.comments.data.length;
  }

  appendImage() {
    const options = {
      allowsEditing: true,
      maxHeight: 1024,
      maxWidth: 1024,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else if (!response.didCancel) {
        this.setState({ image64Data: response });
      }
    });
  }

  discardImage() {
    this.setState({ image64Data: undefined });
  }

  focusOnComment() {
    const { addComment, statusId, navigateBack } = this.props;
    navigateBack();
    addComment(statusId);
  }

  scrollDownOnComment() {
    if (this.getCommentsLength() > 3) {
      this.scrollView.scrollToEnd({ animated: true });
    }
  }

  // scrolls scrollView to the last comment with the delay of 800ms
  scrollDownOnFocus() {
    setTimeout(() => {
      if (this.getCommentsLength() > 1) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    }, 800);
  }

  // TextInput height must be equal to content height,
  // but not lower then 25, and higher then 100
  calculateTextInputHight() {
    const { height } = this.state;
    return Math.min(Math.max(25, height), 100);
  }

  loadMoreComments() {
    const { next, comments } = this.props;

    next(comments);
  }

  renderLoadComments() {
    if (!hasNext(this.props.comments)) {
      return null;
    }

    return (
      <View>
        <Text onPress={this.loadMoreComments}>
          Load more comments...
        </Text>
        <Divider styleName="line" />
      </View>
    );
  }

  isStatusAuthorOrAppOwner() {
    const { statuses, statusId } = this.props;
    const status = _.find(statuses, { id: statusId });

    return _.get(status, 'deletable') === 'yes';
  }

  openActionSheet() {
    const { deleteStatus, statuses, statusId, navigateBack } = this.props;
    const status = _.find(statuses, { id: statusId });

    ActionSheet.showActionSheetWithOptions(
      {
        options: [
          I18n.t(ext('deleteStatusOption')),
          I18n.t(ext('cancelStatusSelectionOption')),
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (index) => {
        if (index === 0) {
          return deleteStatus(status).then(navigateBack());
        }
      }
    );
  }

  renderRightComponent() {
    if (!this.isStatusAuthorOrAppOwner()) {
      return null;
    }

    return (
      <View styleName="container" virtual>
        <Button onPress={this.openActionSheet}>
          <Icon name="more-horizontal" />
        </Button>
      </View>
    );
  }

  renderRow(comment, sectionId, index) {
    const { openProfile, deleteComment } = this.props;
    const loadMoreText = (parseInt(index) + 1 === this.getCommentsLength()) ?
      this.renderLoadComments() : null;

    return (
      <View key={index}>
        <CommentView openProfile={openProfile} comment={comment} deleteComment={deleteComment} />
        <Divider styleName="line" />
        {loadMoreText}
      </View>
    );
  }

  renderAddCommentSection() {
    const { enablePhotoAttachments } = this.props;

    const addPhotoButton = enablePhotoAttachments ?
      <Button
        styleName="clear"
        onPress={this.appendImage}
      >
        <Icon name="take-a-photo" />
      </Button> : null;

    return (
      <View>
        {this.renderAttachedImage()}
        <Divider styleName="line" />
        <View
          styleName="horizontal v-center"
          style={{ backgroundColor: 'white' }}
        >
          {addPhotoButton}
          {this.renderCommentTextInput()}
          <Button
            styleName="clear"
            disabled={this.state.text.length === 0}
            onPress={this.handleStatusCommentClick}
          >
            <Text>{I18n.t(ext('postStatusButton'))}</Text>
          </Button>
        </View>
      </View>
    );
  }

  renderAttachedImage() {
    const { image64Data } = this.state;

    if (!image64Data) return null;
    return (
      <Row>
        <Image
          styleName="small md-gutter"
          source={{ uri: `data:image/jpg;base64,${image64Data.data}` }}
        >
          <View styleName="fill-parent horizontal v-start h-end">
            <Button
              styleName="tight clear"
              onPress={this.discardImage}
            >
              <Icon name="close" />
            </Button>
          </View>
        </Image>
      </Row>
    );
  }

  renderCommentTextInput() {
    const { scrollDownOnOpen } = this.props;

    return (
      <TextInput
        autoFocus={scrollDownOnOpen}
        multiline
        placeholder={I18n.t(ext('newCommentPlaceholder'))}
        styleName="flexible"
        value={this.state.text}
        onChangeText={this.handleTextChange}
        onContentSizeChange={this.handleContentSizeChange}
        returnKeyType="done"
        style={{
          height: this.calculateTextInputHight(),
        }}
      />
    );
  }

  renderStatus() {
    const {
      statusId,
      statuses,
      status,
      openUserLikes,
      onLikeAction,
      openProfile,
      enableComments,
      enableInteractions
    } = this.props;

    return (
      <View>
        <StatusView
          status={status || _.find(statuses, { id: statusId })}
          openUserLikes={openUserLikes}
          addComment={this.focusOnComment}
          onLikeAction={onLikeAction}
          openProfile={openProfile}
          showUsersWhoLiked
          enableImageFullScreen
          enableInteractions={enableInteractions}
          enableComments={enableComments}
        />
      </View>
    );
  }

  render() {
    const { enableComments, comments } = this.props;
    const addCommentSection = enableComments ? this.renderAddCommentSection() : null;
    const commentsData = _.get(comments, 'data', []);

    const areCommentsLoading = isBusy(comments) && !isInitialized(comments);

    return (
      <Screen styleName="paper">
        <NavigationBar
          title={I18n.t(ext('postDetailsNavBarTitle'))}
          renderRightComponent={this.renderRightComponent}
        />
        <Divider styleName="line" />
        <KeyboardAwareScrollView
          enableAutoAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid
          keyboardShouldPersistTaps="always"
        >
          <ListView
            data={[...commentsData]}
            ref={this.captureScrollViewRef}
            loading={areCommentsLoading}
            renderHeader={this.renderStatus}
            renderRow={this.renderRow}
          />
          {areCommentsLoading ? null : addCommentSection}
        </KeyboardAwareScrollView>
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  statuses: state[ext()].statuses.data,
  comments: _.get(state[ext()], ['comments', ownProps.statusId], {}),
});

const mapDispatchToProps = {
  fetchComments,
  openInModal,
  navigateBack,
  createComment,
  openProfile,
  authenticate,
  next,
  deleteStatus,
  deleteComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('StatusDetailsScreen'))(StatusDetailsScreen),
);
