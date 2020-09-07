import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard as RNKeyboard,
  FlatList,
  Alert,
  InteractionManager,
  View,
} from 'react-native';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import {
  NavigationBar,
  navigateBack,
  openInModal,
  isTabBarNavigation,
  getActiveRoute,
} from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { loginRequired, getUser } from 'shoutem.auth';
import { Screen, Keyboard, ActionSheet, Spinner } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext, CHAT_CONVERSATION_SCREEN } from '../const';
import {
  MessageBubble,
  ChatInputBox,
  ChatEncryptionMessage,
} from '../components';
import { actions, selectors } from '../redux';
import { SendBird, composeSendBirdId } from '../services';

const IMAGE_CAPTURE_OPTIONS = {
  allowsEditing: true,
  maxHeight: 1024,
  maxWidth: 1024,
};

function listKeyExtractor(item) {
  return item.messageId.toString();
}

function withinMinuteOf(leadingMoment, trailingMoment) {
  if (!leadingMoment || !trailingMoment) {
    return false;
  }

  return moment(leadingMoment.createdAt).diff(moment(trailingMoment.createdAt), 'seconds') < 60;
}

export class ChatWindowScreen extends PureComponent {
  static propTypes = {
    createChannel: PropTypes.func,
    isConnected: PropTypes.bool,
    goBack: PropTypes.func,
    user: PropTypes.object,
    channelId: PropTypes.string,
    setActiveChannel: PropTypes.func,
    sendMessage: PropTypes.func,
    loadChannelMessages: PropTypes.func,
    messages: PropTypes.array,
    currentUser: PropTypes.object,
    channel: PropTypes.object,
    navigateTo: PropTypes.func,
    sendFileMessage: PropTypes.func,
    openInModalAction: PropTypes.func,
    style: Screen.propTypes.style,
    isTabBar: PropTypes.bool,
    loadChannel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.USER_UNAVAILABLE_MESSAGE = I18n.t(ext('userUnavailableMessage'));
    this.GENERIC_ERROR_MESSAGE = I18n.t(ext('genericErrorMessage'));

    autoBindReact(this);

    this.state = {
      loading: true,
      actionSheetOpen: false,
      uploadProgress: 100,
      currentUser: props.currentUser,
    };
  }

  componentDidMount() {
    const {
      channelId,
      user,
      loadChannel,
      setActiveChannel,
      isConnected,
    } = this.props;

    if (channelId && isConnected) {
      loadChannel(channelId).then(() => {
        setActiveChannel(channelId);
        return this.loadData();
      }).catch(this.handleGenericError);
    }

    if (user && isConnected) {
      this.resolveChannelPerUser();
    }
  }

  componentDidUpdate(prevProps) {
    const { initialUnreadCount } = this.state;
    const {
      messages,
      isConnected,
      channel,
      channelId,
      loadChannel,
      setActiveChannel,
      user,
      screenActive,
    } = this.props;
    const {
      messages: prevMessages,
      isConnected: wasConnected,
      screenActive: wasScreenActive,
    } = prevProps;

    if (!wasScreenActive && screenActive) {
      channel.channel.markAsRead();
    }

    if (!wasConnected && isConnected && channel) {
      this.loadData();
      return;
    }

    if (!wasConnected && isConnected && channelId) {
      loadChannel(channelId).then(() => {
        setActiveChannel(channelId);
        return this.loadData();
      }).catch(this.handleGenericError);
    }

    if (!wasConnected && isConnected && user) {
      this.resolveChannelPerUser();
      return;
    }

    if (prevMessages !== messages) {
      const prevMessagesSize = _.size(prevMessages);
      const nextMessagesSize = _.size(messages);

      if (prevMessagesSize > 0 && initialUnreadCount > 0) {
        this.setState({
          initialUnreadCount: initialUnreadCount + nextMessagesSize - prevMessagesSize,
        });
      }
    }
  }

  getNavigationBarProps() {
    const { channel, user } = this.props;
    const { currentUser } = this.state;

    const partner = channel ? SendBird.getChannelPartner(channel.channel, currentUser) : null;

    const nickname = partner ? _.get(partner, 'nickname', '') : _.get(user, 'profile.name', '');

    return {
      title: nickname.toUpperCase(),
      onNavigateBack: this.handleNavigateBack,
    };
  }

  getTypingStatus() {
    const { channel, currentUser } = this.props;

    if (!channel) {
      return null;
    }

    const typingMembers = channel.channel.getTypingMembers();
    const currentUserId = composeSendBirdId(currentUser);
    const partnerTyping = _.find(typingMembers, member => member.userId !== currentUserId);

    if (partnerTyping) {
      return partnerTyping.nickname;
    }

    return null;
  }

  handleGenericError() {
    this.setState({ loading: false });
    this.displayChatUnavailableAlert(this.GENERIC_ERROR_MESSAGE);
  }

  displayChatUnavailableAlert(message = this.USER_UNAVAILABLE_MESSAGE) {
    Alert.alert(
      I18n.t(ext('chatUnavailableErrorTitle')),
      message,
      [
        {
          text: 'Ok',
          onPress: this.handleNavigateBack,
        },
      ],
      { onDismiss: this.handleNavigateBack },
    );
  }

  resolveChannelPerUser() {
    const {
      user,
      setActiveChannel,
      createChannel,
      currentUser,
    } = this.props;

    const userId = composeSendBirdId(currentUser);
    const targetId = composeSendBirdId(user);

    createChannel(userId, targetId)
      .then((resp) => {
        const payload = _.get(resp, 'payload');

        if (!payload) {
          this.displayChatUnavailableAlert();
          return;
        }

        setActiveChannel(payload.url);
        this.loadData();
      }).catch(this.handleGenericError);
  }

  loadData() {
    const { channel, loadChannelMessages } = this.props;

    const messageQuery = channel.channel.createPreviousMessageListQuery();
    messageQuery.limit = 100;
    messageQuery.reverse = true;

    this.setState({ messageQuery, loading: true });

    channel.channel.markAsRead();

    const initialUnreadCount = _.get(channel, 'channel.unreadMessageCount', 0);
    this.setState({ initialUnreadCount });

    loadChannelMessages(channel.channel, messageQuery, false)
      .then(() => this.setState({ loading: false }))
      .catch(this.handleGenericError);
  }

  handleLoadMore() {
    const { channel, loadChannelMessages } = this.props;
    const { loading, messageQuery, loadingMore } = this.state;

    if (loading || loadingMore || !messageQuery || !messageQuery.hasMore) {
      return;
    }

    this.setState({ loadingMore: true });

    loadChannelMessages(channel.channel, messageQuery, true)
      .then(() => this.setState({ loadingMore: false }))
      .catch(this.handleGenericError);
  }

  handleTakePhotoPress() {
    ImagePicker.launchCamera(IMAGE_CAPTURE_OPTIONS, (response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else if (!response.didCancel) {
        this.handleImageSelectSuccess(response);
      }
    });
  }

  handleChoosePhotoPress() {
    ImagePicker.launchImageLibrary(IMAGE_CAPTURE_OPTIONS, (response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else if (!response.didCancel) {
        this.handleImageSelectSuccess(response);
      }
    });
  }

  handleImageSelectSuccess(imageData) {
    const { sendFileMessage, channel } = this.props;

    this.handleAttachmentDismiss(() => {
      this.setState({ uploadProgress: 0 });
      sendFileMessage(channel.channel, imageData, this.handleUploadProgress);
    });
  }

  handleAttachmentPress() {
    RNKeyboard.dismiss();
    this.setState({ actionSheetOpen: true });
  }

  handleAttachmentDismiss(callback) {
    const resolvedCallback = _.isFunction(callback) ? callback : null;

    this.setState({ actionSheetOpen: false }, () => InteractionManager.runAfterInteractions(resolvedCallback));
  }

  handleTypingStatusChange(typing) {
    const { channel } = this.props;

    if (typing) {
      channel.channel.startTyping();
      return;
    }

    channel.channel.endTyping();
  }

  handleUploadProgress(uploadEvent) {
    const uploadProgress = parseInt(Math.floor(uploadEvent.loaded / uploadEvent.total * 100));

    this.setState({ uploadProgress });
  }

  handleNavigateBack() {
    const { setActiveChannel, goBack } = this.props;

    setActiveChannel('');
    goBack();
  }

  handlePhotoOpen(photo) {
    const { openInModalAction } = this.props;

    const route = {
      screen: ext('PhotoFullScreen'),
      props: { photo },
    };

    openInModalAction(route);
  }

  handleSendPress(message) {
    const { channel, sendMessage } = this.props;

    if (_.isEmpty(message)) {
      return null;
    }

    return sendMessage(channel.channel, message);
  }

  renderItem({ item: message }) {
    const { messages, channel } = this.props;
    const { initialUnreadCount, currentUser } = this.state;

    const index = _.indexOf(messages, message);
    const currentUserId = composeSendBirdId(currentUser);
    const isFirstItem = _.head(messages) === message;
    const prevItem = _.get(messages, (index - 1).toString());
    const nextItem = _.get(messages, (index + 1).toString());
    const withinMinuteOfPrev = withinMinuteOf(prevItem, message);
    const withinMinuteOfNext = withinMinuteOf(message, nextItem);
    const defaultProfileImage = _.get(channel, 'channel.coverUrl');

    const showNewLabel = initialUnreadCount > 0 && index === initialUnreadCount - 1;
    const showTimeStamp = isFirstItem || !withinMinuteOfPrev;

    return (
      <MessageBubble
        currentUserId={currentUserId}
        defaultProfileImage={defaultProfileImage}
        firstMessage={!withinMinuteOfNext}
        message={message}
        onFileMessagePress={this.handlePhotoOpen}
        showNewLabel={showNewLabel}
        showTimeStamp={showTimeStamp}
      />
    );
  }

  renderListEmptyComponent() {
    const { loading } = this.state;

    if (loading) {
      return null;
    }

    return <ChatEncryptionMessage />;
  }

  renderFooter() {
    const { loadingMore } = this.state;
    const { style } = this.props;

    if (!loadingMore) {
      return null;
    }

    return (
      <View style={style.spinnerContainer}>
        <Spinner />
      </View>
    );
  }

  renderHeader() {
    const { loading } = this.state;
    const { style } = this.props;

    if (!loading) {
      return null;
    }

    return (
      <View style={style.spinnerContainer}>
        <Spinner />
      </View>
    );
  }

  render() {
    const { style, messages, isTabBar } = this.props;
    const { loading, actionSheetOpen, uploadProgress } = this.state;
    const navigationBarProps = this.getNavigationBarProps();
    const typing = this.getTypingStatus();
    const keyboardOffset = Keyboard.calculateKeyboardOffset(66);

    const confirmOptions = [
      { title: 'Camera', onPress: this.handleTakePhotoPress },
      { title: 'Photo & Video Library', onPress: this.handleChoosePhotoPress },
    ];
    const cancelOptions = [{ title: 'Cancel', onPress: this.handleAttachmentDismiss }];
    const styleName = isTabBar ? '' : 'with-notch-padding';

    return (
      <Screen style={style.screen} styleName={styleName}>
        <NavigationBar {...navigationBarProps} />
        <FlatList
          data={messages}
          inverted
          keyExtractor={listKeyExtractor}
          ListEmptyComponent={this.renderListEmptyComponent()}
          ListFooterComponent={this.renderFooter()}
          ListHeaderComponent={this.renderHeader()}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={this.renderItem}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardOffset}>
          <ChatInputBox
            editable={!loading}
            onAttachmentPress={this.handleAttachmentPress}
            onSendPress={this.handleSendPress}
            onTypingStatusChange={this.handleTypingStatusChange}
            typing={typing}
            uploadProgress={uploadProgress}
          />
        </KeyboardAvoidingView>
        <ActionSheet
          active={actionSheetOpen}
          cancelOptions={cancelOptions}
          confirmOptions={confirmOptions}
          onDismiss={this.handleAttachmentDismiss}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const channel = selectors.getActiveChannel(state);
  const activeRoute = getActiveRoute(state);
  const screenActive = _.get(activeRoute, 'screen') === CHAT_CONVERSATION_SCREEN;

  return {
    currentUser: getUser(state),
    channel,
    messages: channel ? selectors.getChannelMessages(channel.channel, state) : [],
    isTabBar: isTabBarNavigation(state),
    isConnected: selectors.isConnected(state),
    screenActive,
  };
};

const mapDispatchToProps = {
  loadChannelMessages: actions.loadChannelMessages,
  sendMessage: actions.sendMessage,
  setActiveChannel: actions.setActiveChannel,
  createChannel: actions.createChannel,
  sendFileMessage: actions.sendFileMessage,
  openInModalAction: openInModal,
  loadChannel: actions.loadChannel,
  goBack: navigateBack,
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ChatWindowScreen'))(ChatWindowScreen),
), true);
