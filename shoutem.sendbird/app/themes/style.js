import { createScopedResolver, resolveFontWeight } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.sendbird.MessageListScreen': {
    sectionContainer: {
      backgroundColor: resolveVariable('backgroundColor'),
    },
    sectionTitle: {
      fontWeight: '500',
      margin: 20,
    },
  },

  'shoutem.sendbird.SectionFooter': {
    height: 15,
    backgroundColor: 'transparent',
  },

  'shoutem.sendbird.ErrorModal': {
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
      backgroundColor: '#FFFFFF',
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
      fontWeight: resolveFontWeight('500'),
      fontSize: 21,
      textAlign: 'center',
    },

    description: {
      fontSize: 15,
      marginBottom: 48,
      textAlign: 'center',
    },

    button: {
      backgroundColor: '#4AA8DA',
      borderRadius: 2,
    },

    buttonText: {
      fontSize: 13,
      fontWeight: resolveFontWeight('500'),
      color: '#FFFFFF',
    },
  },

  'shoutem.sendbird.SectionHeader': {
    container: {
      height: 57,
      paddingLeft: 20,
      backgroundColor: '#FFFFFF',
    },
    text: {
      letterSpacing: -0.165,
      fontSize: 21,
      color: '#333333',
    },
  },

  'shoutem.sendbird.ChatWindowScreen': {
    screen: {
      backgroundColor: '#FFFFFF',
    },
    spinnerContainer: {
      paddingVertical: 15,
    },
  },

  'shoutem.sendbird.ExistingChannelListItem': {
    row: {
      height: 80,
      borderColor: 'rgba(130, 130, 130, 0.1)',
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
      backgroundColor: '#FF4F4F',
      height: 16,
      width: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadCountText: {
      color: '#FFFFFF',
      fontSize: 10,
    },
    text: {
      letterSpacing: -0.17,
      color: '#333333',
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

  'shoutem.sendbird.MemberListItem': {
    row: {
      height: 80,
      borderColor: 'rgba(130, 130, 130, 0.1)',
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
      color: '#333333',
      fontSize: 13,
    },
    nickname: {
      fontSize: 15,
    },
  },

  'shoutem.sendbird.SearchBar': {
    placeholderTextColor: 'rgba(0, 0, 0, 0.3)',
    container: {
      padding: 20,
      height: 80,
      backgroundColor: resolveVariable('backgroundColor'),
      borderColor: 'rgba(130, 130, 130, 0.1)',
      borderBottomWidth: 1,
    },
    input: {
      height: 40,
      borderRadius: 100,
      backgroundColor: '#F9F9F9',
      borderColor: 'rgba(130, 130, 130, 0.1)',
      borderWidth: 1,
      paddingTop: 11,
      paddingBottom: 11,
      paddingRight: 44,
      fontSize: 13,
      letterSpacing: -0.17,
      color: '#000000',
    },
    inputFocused: {
      borderColor: '#828282',
    },
    icon: {
      color: '#C4C4C4',
    },
    iconWrapper: {
      position: 'absolute',
      right: 35,
      top: 28,
    },
  },

  'shoutem.sendbird.EmptyChannelListComponent': {
    image: {
      resizeMode: 'contain',
      marginTop: 45,
      marginBottom: 30,
      height: (resolveVariable('sizes.window.height') * 227) / 812,
      width: resolveVariable('sizes.window.width') - 80,
    },
    title: {
      fontWeight: resolveFontWeight('500'),
      fontSize: 21,
      lineHeight: 25,
      marginBottom: 20,
      letterSpacing: -0.165,
      color: '#000000',
    },
    description: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.165,
      color: '#333333',
      maxWidth: 200,
    },
  },

  'shoutem.sendbird.MessageBubble': {
    container: {
      borderRadius: 30,
      marginLeft: 40,
      marginRight: 20,
      backgroundColor: 'rgba(28, 171, 221, 0.1)',
      padding: 15,
    },
    secondaryContainer: {
      marginLeft: 49,
      marginRight: 40,
      backgroundColor: '#F9F9F9',
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
      color: '#000000',
    },
    withProfileImage: {
      marginLeft: 5,
    },
    secondaryText: {
      color: '#333333',
    },
    linkText: {
      color: '#0645AD',
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
      color: '#000000',
      maxWidth: 200,
    },
    fileSizeText: {
      fontSize: 10,
      lineHeight: 12,
      color: '#000000',
    },
  },

  'shoutem.sendbird.NewMessagesLabel': {
    text: {
      color: '#000000',
      fontSize: 10,
    },
    leadingLine: {
      height: 1,
      flex: 1,
      marginRight: 10,
      backgroundColor: '#333333',
      borderRadius: 1,
    },
    trailingLine: {
      height: 1,
      flex: 1,
      marginLeft: 10,
      backgroundColor: '#333333',
      borderRadius: 1,
    },
    textContainer: {
      borderRadius: 100,
      borderWidth: 1,
      borderColor: '#000000',
      paddingHorizontal: 8,
    },
  },

  'shoutem.sendbird.ChatEncryptionMessage': {
    container: {
      flex: 0,
      transform: [{ scaleY: -1 }],
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      maxWidth: 205,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      marginTop: 20,
    },
    text: {
      fontSize: 13,
      maxWidth: 156,
    },
    image: {
      width: 24,
      height: 24,
      marginRight: 5,
    },
  },

  'shoutem.sendbird.ChatInputBox': {
    container: {
      backgroundColor: '#FFFFFF',
      paddingLeft: 20,
      paddingTop: 14,
      paddingBottom: 9,
      paddingRight: 15,
      borderColor: 'rgba(130, 130, 130, 0.1)',
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
      backgroundColor: 'transparent',
      borderColor: '#333333',
      borderWidth: 2,
      paddingTop: 9,
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 44,
      fontSize: 13,
      letterSpacing: -0.17,
      textAlignVertical: 'center',
      color: '#000000',
      overflow: 'hidden',
    },
    sendIcon: {
      icon: {
        width: 29,
        height: 29,
      },
      wrapper: {
        position: 'absolute',
        top: '50%',
        right: 20,
      },
    },
  },

  'shoutem.sendbird.ProgressBar': {
    container: {
      width: '100%',
      height: 5,
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
    },
    progress: {
      backgroundColor: '#39FF14',
      height: '100%',
    },
  },
});
