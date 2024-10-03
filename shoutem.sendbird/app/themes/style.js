import {
  createScopedResolver,
  Device,
  resolveFontWeight,
  responsiveHeight,
} from '@shoutem/ui';
import { isAndroid, isWeb } from 'shoutem-core';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('MessageListScreen')}`]: {
    container: {
      backgroundColor: resolveVariable('sendbirdMessagesScreenBackgroundColor'),
    },
    sectionContainer: {
      backgroundColor: resolveVariable('sendbirdMessageSectionBackgroundColor'),
    },
    sectionTitle: {
      fontWeight: '500',
      margin: 20,
      color: resolveVariable('sendbirdMessageSectionTextColor'),
    },
  },

  [`${ext('ErrorModal')}`]: {
    outerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    container: {
      paddingHorizontal: 42,
      paddingVertical: 68,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: resolveVariable('sendbirdErrorModalBackgroundColor'),
      width: '100%',
      borderRadius: 10,
    },

    image: {
      width: 200,
      height: 156,
      marginBottom: 48,
    },

    title: {
      marginBottom: 22,
      color: resolveVariable('sendbirdErrorModalTextColor'),
      fontWeight: resolveFontWeight('500'),
      fontSize: 21,
      textAlign: 'center',
    },

    description: {
      color: resolveVariable('sendbirdErrorModalTextColor'),
      fontSize: 15,
      marginBottom: 48,
      textAlign: 'center',
    },

    button: {
      backgroundColor: resolveVariable('sendbirdErrorModalButtonColor'),
      borderColor: resolveVariable('sendbirdErrorModalButtonBorderColor'),
      borderWidth: 1,
      borderRadius: 2,
    },

    buttonText: {
      fontSize: 13,
      fontWeight: resolveFontWeight('500'),
      color: resolveVariable('sendbirdErrorModalButtonTextColor'),
    },
  },

  [`${ext('ChatWindowScreen')}`]: {
    screen: {
      backgroundColor: resolveVariable('sendbirdChatScreenBackgroundColor'),
    },
    paddedScreen: {
      paddingBottom: Device.select({
        iPhoneX:
          resolveVariable('largeGutter') +
          resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR:
          resolveVariable('largeGutter') +
          resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        default: resolveVariable('mediumGutter'),
      }),
    },
    keyboardOffset: Device.select({
      iPhoneX: -resolveVariable('smallGutter'),
      iPhoneXR: -resolveVariable('smallGutter'),
      default: 0,
    }),
    spinnerContainer: {
      paddingVertical: 15,
    },
  },

  [`${ext('ExistingChannelListItem')}`]: {
    row: {
      height: 80,
      backgroundColor: resolveVariable(
        'sendbirdExistingChannelBackgroundColor',
      ),
      borderColor: resolveVariable('sendbirdExistingChannelBorderColor'),
      borderBottomWidth: 1,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    indicator: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    unreadCountContainer: {
      backgroundColor: resolveVariable('sendbirdUnreadCountBackgroundColor'),
      height: 16,
      width: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadCountText: {
      color: resolveVariable('sendbirdUnreadCountTextColor'),
      fontSize: 10,
    },
    text: {
      letterSpacing: -0.17,
      color: resolveVariable('sendbirdExistingChannelTextColor'),
      fontSize: 13,
    },
    nickname: {
      fontSize: 15,
    },
    date: {
      opacity: 0.4,
      fontSize: 10,
    },
    unreadText: {
      fontWeight: resolveFontWeight('600'),
    },
  },

  [`${ext('MemberListItem')}`]: {
    row: {
      height: 80,
      backgroundColor: resolveVariable('sendbirdMemberItemBackgroundColor'),
      borderColor: resolveVariable('sendbirdMemberItemBorderColor'),
      borderBottomWidth: 1,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    text: {
      letterSpacing: -0.17,
      color: resolveVariable('sendbirdMemberItemTextColor'),
      fontSize: 13,
    },
    nickname: {
      fontSize: 15,
    },
  },

  [`${ext('SearchBar')}`]: {
    placeholderTextColor: 'rgba(0, 0, 0, 0.3)',
    container: {
      padding: 20,
      height: 80,
      backgroundColor: resolveVariable('sendbirdSearchBarBackgroundColor'),
      borderColor: resolveVariable('sendbirdSearchBarBorderColor'),
      borderBottomWidth: 1,
    },
    input: {
      height: 40,
      borderRadius: 100,
      backgroundColor: resolveVariable('sendbirdSearchBarInputBackgroundColor'),
      borderColor: resolveVariable('sendbirdSearchBarBorderColor'),
      borderWidth: 1,
      paddingTop: 11,
      paddingBottom: 11,
      paddingRight: 44,
      fontSize: 13,
      letterSpacing: -0.17,
      color: resolveVariable('sendbirdSearchBarInputColor'),
    },
    inputFocused: {
      borderColor: resolveVariable('sendbirdSearchBarFocusedBorderColor'),
    },
    icon: {
      color: resolveVariable('sendbirdSearchBarIconColor'),
    },
    iconWrapper: {
      position: 'absolute',
      right: 35,
      top: 28,
    },
  },

  [`${ext('MessageBubble')}`]: {
    container: {
      borderRadius: 30,
      marginLeft: 40,
      marginRight: 20,
      backgroundColor: resolveVariable('sendbirdSentMessageBackgroundColor'),
      padding: 15,
    },
    animatedContainer: {
      flexDirection: 'column',
      marginBottom: responsiveHeight(5),
    },
    ownMessagePosition: {
      alignItems: 'flex-end',
    },
    partnerMessagePosition: {
      alignItems: 'flex-start',
    },
    secondaryContainer: {
      marginLeft: 49,
      marginRight: 40,
      backgroundColor: resolveVariable(
        'sendbirdReceivedMessageBackgroundColor',
      ),
    },
    firstMessage: {
      borderTopEndRadius: 0,
    },
    fileMessage: {
      overflow: 'hidden',
      padding: 0,
    },
    firstMessageSecondary: {
      borderTopStartRadius: 0,
    },
    text: {
      fontSize: 13,
      letterSpacing: -0.17,
      color: resolveVariable('sendbirdSentMessageTextColor'),
    },
    withProfileImage: {
      marginLeft: 5,
    },
    secondaryText: {
      color: resolveVariable('sendbirdReceivedMessageTextColor'),
    },
    linkText: {
      color: resolveVariable('sendbirdMessageLinkTextColor'),
    },
    date: {
      opacity: 0.4,
      fontSize: 10,
      marginRight: 20,
      marginTop: 5,
    },
    dateSecondary: {
      marginRight: 0,
      marginLeft: 49,
    },
    profileImage: {
      width: 24,
      height: 24,
      marginLeft: 20,
      borderRadius: 12,
    },
    docImage: {
      width: 200,
      height: 200,
    },
    fileNameText: {
      fontWeight: resolveFontWeight('500'),
      fontSize: 13,
      lineHeight: 16,
      color: resolveVariable('sendbirdMessageFileTextColor'),
      maxWidth: 200,
    },
    fileSizeText: {
      fontSize: 10,
      lineHeight: 12,
      color: resolveVariable('sendbirdMessageFileTextColor'),
    },
  },

  [`${ext('NewMessagesLabel')}`]: {
    text: {
      color: resolveVariable('sendbirdNewMessageTextColor'),
      fontSize: 10,
    },
    leadingLine: {
      height: 1,
      flex: 1,
      marginRight: 10,
      backgroundColor: resolveVariable('sendbirdNewMessageDividerColor'),
      borderRadius: 1,
    },
    trailingLine: {
      height: 1,
      flex: 1,
      marginLeft: 10,
      backgroundColor: resolveVariable('sendbirdNewMessageDividerColor'),
      borderRadius: 1,
    },
    textContainer: {
      borderRadius: 100,
      borderWidth: 1,
      borderColor: resolveVariable('sendbirdNewMessageBorderColor'),
      paddingHorizontal: 8,
    },
  },

  [`${ext('ChatEncryptionMessage')}`]: {
    container: {
      flex: 0,
      transform: isAndroid
        ? [{ scaleY: -1 }, { scaleX: -1 }]
        : [{ scaleY: -1 }],
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      maxWidth: 205,
      borderColor: resolveVariable('sendbirdChatEncryptionBorderColor'),
      marginTop: 20,
    },
    text: {
      fontSize: 13,
      color: resolveVariable('sendbirdChatEncryptionTextColor'),
      maxWidth: 156,
    },
    image: {
      width: 24,
      height: 24,
      marginRight: 5,
    },
  },

  [`${ext('ChatInputBox')}`]: {
    container: {
      backgroundColor: resolveVariable('sendbirdChatInputBackgroundColor'),
      paddingLeft: 20,
      paddingTop: 14,
      paddingBottom: 20,
      paddingRight: 15,
      marginTop: 20,
      borderColor: resolveVariable('sendbirdChatInputContainerBorderColor'),
      borderTopWidth: 1,
    },
    attachIcon: {
      icon: {
        width: 24,
        height: 24,
      },
      wrapper: {
        marginRight: 15,
      },
    },
    input: {
      flex: 1,
      minHeight: 37,
      maxHeight: 80,
      borderRadius: 100,
      backgroundColor: resolveVariable('sendbirdChatInputFieldBackgroundColor'),
      borderColor: resolveVariable('sendbirdChatInputBorderColor'),
      borderWidth: 2,
      paddingTop: 9,
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 44,
      fontSize: 13,
      letterSpacing: -0.17,
      textAlignVertical: 'center',
      color: resolveVariable('sendbirdChatInputTextColor'),
      overflow: 'hidden',
    },
    sendIcon: {
      icon: {
        width: 29,
        height: 29,
      },
      wrapper: {
        position: 'absolute',
        top: isWeb ? undefined : '50%',
        right: 20,
      },
    },
  },

  [`${ext('ProgressBar')}`]: {
    container: {
      width: '100%',
      height: 5,
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
    },
    progress: {
      backgroundColor: resolveVariable('sendbirdProgressBarColor'),
      height: '100%',
    },
  },
});
