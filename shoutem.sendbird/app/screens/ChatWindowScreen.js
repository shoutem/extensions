import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  Keyboard as RNKeyboard,
  FlatList,
  Alert,
  InteractionManager,
  View,
  Platform,
  AppState,
} from 'react-native';
import { connect } from 'react-redux';
import { getSubscriptionValidState } from 'shoutem.application';
import { loginRequired, getUser } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  goBack,
  openInModal,
  isTabBarNavigation,
  withIsFocused,
  getRouteParams,
  HeaderBackButton,
} from 'shoutem.navigation';
import {
  requestPermissions,
  PERMISSION_TYPES,
  RESULTS,
} from 'shoutem.permissions';
import { connectStyle } from '@shoutem/theme';
import { Screen, Keyboard, ActionSheet, Spinner } from '@shoutem/ui';
import {
  MessageBubble,
  ChatInputBox,
  ChatEncryptionMessage,
  ErrorModal,
} from '../components';
import { ext } from '../const';
import { actions, selectors } from '../redux';
import { SendBird, composeSendBirdId } from '../services';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const IMAGE_CAPTURE_OPTIONS = {
  maxHeight: 1024,
  maxWidth: 1024,
  saveToPhotos: false,
  mediaType: 'photo',
};

function listKeyExtractor(item) {
  return item.messageId.toString();
}

function withinMinuteOf(leadingMoment, trailingMoment) {
  if (!leadingMoment || !trailingMoment) {
    return false;
  }

  return (
    moment(leadingMoment.createdAt).diff(
      moment(trailingMoment.createdAt),
      'seconds',
    ) < 60
  );
}

export class ChatWindowScreen extends PureComponent {
  static propTypes = {
    createChannel: PropTypes.func,
    isConnected: PropTypes.bool,
    user: PropTypes.object,
    setActiveChannel: PropTypes.func,
    sendMessage: PropTypes.func,
    loadChannelMessages: PropTypes.func,
    messages: PropTypes.array,
    currentUser: PropTypes.object,
    channel: PropTypes.object,
    navigateTo: PropTypes.func,
    sendFileMessage: PropTypes.func,
    style: Screen.propTypes.style,
    isTabBar: PropTypes.bool,
    loadChannel: PropTypes.func,
    hasValidSubscription: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.USER_UNAVAILABLE_MESSAGE = I18n.t(ext('userUnavailableMessage'));
    this.GENERIC_ERROR_MESSAGE = I18n.t(ext('genericErrorMessage'));
    this.SUBSCRIPTION_ERROR_MESSAGE = I18n.t(ext('subscriptionInvalidMessage'));

    autoBindReact(this);

    this.state = {
      loading: true,
      actionSheetOpen: false,
      uploadProgress: 100,
      currentUser: props.currentUser,
      modalActive: false,
    };
  }

  componentDidMount() {
    const {
      loadChannel,
      setActiveChannel,
      isConnected,
      hasValidSubscription,
    } = this.props;
    const { channelId, user } = getRouteParams(this.props);

    if (!hasValidSubscription) {
      this.handleGenericError(this.SUBSCRIPTION_ERROR_MESSAGE);
      return;
    }

    AppState.addEventListener('change', this.handleAppStateChange);

    if (channelId && isConnected) {
      loadChannel(channelId)
        .then(() => {
          setActiveChannel(channelId);
          return this.loadData();
        })
        .catch(this.handleGenericError);
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
      loadChannel,
      setActiveChannel,
      isFocused,
      navigation,
    } = this.props;
    const {
      messages: prevMessages,
      isConnected: wasConnected,
      isFocused: wasFocused,
    } = prevProps;
    const { channelId, user } = getRouteParams(this.props);

    navigation.setOptions(this.getNavBarProps());

    if (!wasFocused && isFocused) {
      channel.channel.markAsRead();
    }

    if (!wasConnected && isConnected && channel) {
      this.loadData();
      return;
    }

    if (!wasConnected && isConnected && channelId) {
      loadChannel(channelId)
        .then(() => {
          setActiveChannel(channelId);
          return this.loadData();
        })
        .catch(this.handleGenericError);
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
          initialUnreadCount:
            initialUnreadCount + nextMessagesSize - prevMessagesSize,
        });
      }
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleGoBack() {
    const { setActiveChannel } = this.props;

    setActiveChannel('');
    goBack();
  }

  getNavBarProps() {
    const { channel } = this.props;
    const { currentUser } = this.state;

    const { user } = getRouteParams(this.props);

    const partner = channel
      ? SendBird.getChannelPartner(channel.channel, currentUser)
      : null;

    const nickname = partner
      ? _.get(partner, 'nickname', '')
      : _.get(user, 'profile.name', '');

    return {
      headerLeft: () => (
        <HeaderBackButton onPress={this.handleGoBack} {...this.props} />
      ),
      title: nickname,
    };
  }

  getTypingStatus() {
    const { channel, currentUser } = this.props;

    if (!channel) {
      return null;
    }

    const typingMembers = channel.channel.getTypingMembers();
    const currentUserId = composeSendBirdId(currentUser);
    const partnerTyping = _.find(
      typingMembers,
      member => member.userId !== currentUserId,
    );

    if (partnerTyping) {
      return partnerTyping.nickname;
    }

    return null;
  }

  handleAppStateChange(nextState) {
    const { hasValidSubscription } = this.props;
    const { loading } = this.state;

    if (!hasValidSubscription) {
      return;
    }

    if (nextState === 'active' && !loading) {
      this.loadData();
    }
  }

  handleModalDismiss() {
    this.setState({ modalActive: false, errorMessage: undefined });
  }

  handleGenericError(errorMessage = this.GENERIC_ERROR_MESSAGE) {
    this.setState({ loading: false, modalActive: true, errorMessage });
  }

  resolveChannelPerUser() {
    const { setActiveChannel, createChannel, currentUser } = this.props;
    const { user } = getRouteParams(this.props);
    const userId = composeSendBirdId(currentUser);
    const targetId = composeSendBirdId(user);

    createChannel(userId, targetId)
      .then(resp => {
        const payload = _.get(resp, 'payload');

        if (!payload) {
          this.handleGenericError(this.USER_UNAVAILABLE_MESSAGE);
          return;
        }

        setActiveChannel(payload.url);
        this.loadData();
      })
      .catch(this.handleGenericError);
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
    requestPermissions(CAMERA_PERMISSION).then(result => {
      if (result[CAMERA_PERMISSION] === RESULTS.GRANTED) {
        launchCamera(IMAGE_CAPTURE_OPTIONS, response => {
          if (response.didCancel) {
            this.setState({ actionSheetOpen: false });
            return;
          }

          if (response.errorCode) {
            Alert.alert(response.errorMessage);
          } else if (!response.didCancel) {
            this.handleImageSelectSuccess(response);
          }
        });
      }
    });
  }

  handleChoosePhotoPress() {
    launchImageLibrary(IMAGE_CAPTURE_OPTIONS, response => {
      if (response.didCancel) {
        this.setState({ actionSheetOpen: false });
        return;
      }

      if (response.errorCode) {
        Alert.alert(response.errorMessage);
      } else if (!response.didCancel) {
        this.handleImageSelectSuccess(response);
      }
    });
  }

  handleImageSelectSuccess(imageData) {
    const { sendFileMessage, channel } = this.props;

    this.handleAttachmentDismiss(() => {
      this.setState({ uploadProgress: 0 });
      sendFileMessage(
        channel.channel,
        imageData.assets[0],
        this.handleUploadProgress,
      );
    });
  }

  handleAttachmentPress() {
    RNKeyboard.dismiss();
    this.setState({ actionSheetOpen: true });
  }

  handleAttachmentDismiss(callback) {
    const resolvedCallback = _.isFunction(callback) ? callback : null;

    this.setState({ actionSheetOpen: false }, () =>
      InteractionManager.runAfterInteractions(resolvedCallback),
    );
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
    const uploadProgress = parseInt(
      Math.floor((uploadEvent.loaded / uploadEvent.total) * 100),
    );

    this.setState({ uploadProgress });
  }

  handlePhotoOpen(photo) {
    openInModal(ext('PhotoFullScreen'), { photo });
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

    const showNewLabel =
      initialUnreadCount > 0 && index === initialUnreadCount - 1;
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
    const {
      loading,
      actionSheetOpen,
      uploadProgress,
      modalActive,
      errorMessage,
    } = this.state;
    const typing = this.getTypingStatus();
    const keyboardOffset = Keyboard.calculateKeyboardOffset();

    const confirmOptions = [
      { title: 'Camera', onPress: this.handleTakePhotoPress },
      { title: 'Photo & Video Library', onPress: this.handleChoosePhotoPress },
    ];
    const cancelOptions = [
      { title: 'Cancel', onPress: this.handleAttachmentDismiss },
    ];
    const styleName = isTabBar ? '' : 'with-notch-padding';

    return (
      <Screen style={style.screen} styleName={styleName}>
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
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={keyboardOffset}
        >
          <ChatInputBox
            editable={!loading}
            onAttachmentPress={this.handleAttachmentPress}
            onSendPress={this.handleSendPress}
            onTypingStatusChange={this.handleTypingStatusChange}
            typing={typing}
            uploadProgress={uploadProgress}
          />
        </KeyboardAvoidingView>
        <ErrorModal
          visible={modalActive}
          onDismissPress={this.handleModalDismiss}
          onButtonPress={this.handleModalDismiss}
          onModalHide={this.handleGoBack}
          title={I18n.t(ext('chatUnavailableErrorTitle'))}
          description={errorMessage}
        />
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

const mapStateToProps = state => {
  const channel = selectors.getActiveChannel(state);

  return {
    currentUser: getUser(state),
    channel,
    messages: channel
      ? selectors.getChannelMessages(channel.channel, state)
      : [],
    isTabBar: isTabBarNavigation(state),
    isConnected: selectors.isConnected(state),
    hasValidSubscription: getSubscriptionValidState(state),
  };
};

const mapDispatchToProps = {
  loadChannelMessages: actions.loadChannelMessages,
  sendMessage: actions.sendMessage,
  setActiveChannel: actions.setActiveChannel,
  createChannel: actions.createChannel,
  sendFileMessage: actions.sendFileMessage,
  loadChannel: actions.loadChannel,
};

export default withIsFocused(
  loginRequired(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(connectStyle(ext('ChatWindowScreen'))(ChatWindowScreen)),
    true,
  ),
);
