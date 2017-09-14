// @flow
import React, {
  Component,
} from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, Alert, Platform } from 'react-native';
import _ from 'lodash';
import dismissKeyboard from 'dismissKeyboard';

import { connectStyle } from '@shoutem/theme';
import { ImagePicker, ActionSheet } from '@shoutem/ui-addons';
import { openInModal, navigateBack } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';

import { isBusy, isInitialized, next, hasNext } from '@shoutem/redux-io';

import {
  Button,
  ScrollView,
  ListView,
  Screen,
  View,
  Divider,
  TextInput,
  Text,
  Icon,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
} from '@shoutem/ui';

import { getExtensionSettings } from 'shoutem.application';

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

import { openProfile, authenticate } from 'shoutem.auth';

const { array, number, func, bool, object } = PropTypes;

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
    extension: object.isRequired,
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
    const { statusId, fetchComments, comments } = this.props;

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
        .then(this.scrollView.scrollToEnd({ animation: true }));
      dismissKeyboard();
      this.setState({ text: '' });
    });

    this.scrollDownOnFocus()
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

  // scrolls scrollView to the last comment with the delay of 800ms
  scrollDownOnFocus() {
    const { scrollDownOnOpen } = this.props;
    setTimeout(() => {
      this.scrollView.scrollToEnd({ animated: true });
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
    if(!hasNext(this.props.comments)) {
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
  };

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
          'Delete',
          'Cancel'
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (index) => {
        switch (index) {
          case 0:
            return deleteStatus(status).then(navigateBack());
        }
      }
    );
  }

  renderRightComponent() {
    if(!this.isStatusAuthorOrAppOwner()) {
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
        <CommentView openProfile={openProfile} comment={comment} deleteComment={deleteComment}/>
        <Divider styleName="line" />
        {loadMoreText}
      </View>
    );
  }

  renderAddCommentSection() {
    const { image64Data } = this.state;
    const { extension } = this.props;
    const keyboardOffSet = image64Data ? 80 : -60;
    // Padding was a problem on android
    // TODO (Ivan): If this problem repeats, 
    // it should be extracted into new component in Shoutem UI.
    const behavior = (Platform.OS === 'android') ? "height" : "padding";

    const addPhotoButton = Boolean(_.get(extension, 'enablePhotoAttachments', true))
    ?
      <Button
        styleName="clear"
        onPress={this.appendImage}
      >
        <Icon name="take-a-photo" />
      </Button>
    : null;

    return (
      <KeyboardAvoidingView
        behavior={behavior}
        keyboardVerticalOffset={keyboardOffSet}
      >
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
            <Text>Post</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
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
        placeholder="Add new comment..."
        styleName="flexible"
        value={this.state.text}
        onChangeText={this.handleTextChange}
        onContentSizeChange={this.handleContentSizeChange}
        onFocus={this.scrollDownOnFocus}
        style={{
          height: this.calculateTextInputHight(),
        }}
      />
    );
  }

  renderStatus() {
    const { statusId, statuses, extension } = this.props;
    const { openUserLikes, onLikeAction, openProfile } = this.props;
    const status = _.find(statuses, { id: statusId });
    return (
      <View>
        <StatusView
          extension={extension}
          status={status}
          openUserLikes={openUserLikes}
          addComment={this.focusOnComment}
          onLikeAction={onLikeAction}
          openProfile={openProfile}
          showUsersWhoLiked
          enableImageFullScreen
        />
      </View>
    );
  }

  render() {
    const { extension, comments } = this.props;
    const commentsAreEnabled = Boolean(_.get(extension, 'enableComments', true));
    const addCommentSection = commentsAreEnabled
      ? this.renderAddCommentSection() : null;
    const commentsData = _.get(comments, 'data', []);

    return (
      <Screen styleName="paper">
        <NavigationBar
          title="POST DETAILS"
          renderRightComponent={this.renderRightComponent}
        />
        <Divider styleName="line" />
        <ListView
          data={commentsData}
          ref={this.captureScrollViewRef}
          loading={isBusy(comments) && !isInitialized(comments)}
          renderHeader={this.renderStatus}
          renderRow={this.renderRow}
        />
        {addCommentSection}
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  statuses: state[ext()].statuses.data,
  comments: _.get(state[ext()], ['comments', ownProps.statusId], {}),
  extension: getExtensionSettings(state, ext()),
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
