import {
  changeColorAlpha,
  getSizeRelativeToReference,
  inverseColorBrightnessForAmount,
} from '@shoutem/theme';
import {
  calculateLineHeight,
  createScopedResolver,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
import { isWeb } from 'shoutem-core';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.social.CreateStatusScreen': {
    textInput: {
      width: '90%',
      height: '100%',
      ...resolveVariable('text'),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        resolveVariable('text.fontWeight'),
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight(resolveVariable('text.fontWeight')),
      fontStyle: resolveFontStyle(resolveVariable('text.fontStyle')),
      padding: resolveVariable('mediumGutter'),
      outline: 'none',
    },
    profileAvatar: {
      width: getSizeRelativeToReference(
        40,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        40,
        375,
        resolveVariable('sizes.window.width'),
      ),
      borderRadius: getSizeRelativeToReference(
        20,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    image: {
      width: getSizeRelativeToReference(
        145,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        92,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 10,
    },
    attachmentContainer: {
      height: getSizeRelativeToReference(
        135,
        812,
        resolveVariable('sizes.window.height'),
      ),
      backgroundColor: resolveVariable('paperColor'),
    },
    attachmentRow: {
      maxHeight: getSizeRelativeToReference(
        100,
        812,
        resolveVariable('sizes.window.height'),
      ),
      justifyContent: 'center',
      position: 'absolute',
      left: getSizeRelativeToReference(
        30,
        375,
        resolveVariable('sizes.window.width'),
      ),
      bottom: getSizeRelativeToReference(
        20,
        812,
        resolveVariable('sizes.window.height'),
      ),
      padding: 0,
      margin: 0,
    },
    keyboardDismissContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
      alignItems: 'flex-start',
    },
    removeAttachmentButton: {
      height: responsiveHeight(30),
      width: responsiveHeight(30),
      borderRadius: responsiveHeight(15),
      backgroundColor: 'grey',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: responsiveWidth(130),
      top: responsiveHeight(5),
      zIndex: 5,
    },
    removeAttachmentIcon: {
      color: '#FFFFFF',
      height: responsiveHeight(18),
      width: responsiveHeight(18),
    },
  },

  'shoutem.social.SearchScreen': {
    contentContainerStyle: {
      flexGrow: 1,
    },
  },
  'shoutem.social.StatusDetailsScreen': {
    headerContainer: {
      backgroundColor: '#000',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingLeft: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    list: {
      listContent: {
        backgroundColor: resolveVariable('paperColor'),
        marginTop: getSizeRelativeToReference(
          6,
          812,
          resolveVariable('sizes.window.height'),
        ),
      },
    },
    closeIcon: { color: '#FFF' },
  },

  'shoutem.social.MemberView': {
    menuButton: {
      width: 24,
      height: 24,
      color: '#C4C4C4',
      paddingVertical: 10,
      paddingLeft: 10,
    },
    userProfileName: {
      color: changeColorAlpha(resolveVariable('text.subtitle'), 0.5),
      fontFamily: resolveFontFamily(
        resolveVariable('subtitle.fontFamily'),
        resolveVariable('subtitle.fontWeight'),
        'italic',
      ),
      fontStyle: resolveFontStyle('italic'),
    },
    avatar: {
      backgroundColor: inverseColorBrightnessForAmount(
        resolveVariable('paperColor'),
        10,
      ),
      width: getSizeRelativeToReference(
        65,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        65,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: getSizeRelativeToReference(
        33,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
  },

  'shoutem.social.SocialWallScreen': {
    screen: {
      backgroundColor: resolveVariable('paperColor'),
    },
    list: {
      listContent: {
        backgroundColor: resolveVariable('paperColor'),
        marginTop: getSizeRelativeToReference(
          15,
          812,
          resolveVariable('sizes.window.height'),
        ),
      },
    },
    newStatusInput: {
      backgroundColor: resolveVariable('searchInputBackgroundColor'),
      height: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 10,
      justifyContent: 'center',
    },
    newStatusPlaceholderText: { opacity: 0.5 },
    profileAvatar: {
      height: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: getSizeRelativeToReference(
        20,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    attachmentsContainer: {
      position: 'absolute',
      right: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    button: {
      maxHeight: 100,
      justifyContent: 'flex-end',
      padding: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    attachmentIcon: {
      width: getSizeRelativeToReference(
        20,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        20,
        812,
        resolveVariable('sizes.window.height'),
      ),
      color: resolveVariable('text.color'),
    },
  },

  'shoutem.social.StatusView': {
    container: {
      backgroundColor: resolveVariable('paperColor'),
      marginHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginBottom: getSizeRelativeToReference(
        6,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderColor: resolveVariable('paperColor'),
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 1, height: 2 },
      elevation: 2,
    },
    newComment: {
      backgroundColor: resolveVariable('searchInputBackgroundColor'),
      borderRadius: 10,
      height: getSizeRelativeToReference(
        38,
        812,
        resolveVariable('sizes.window.height'),
      ),
      padding: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginTop: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginBottom: getSizeRelativeToReference(
        15,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
  },

  'shoutem.social.StatusContent': {
    statusText: {
      container: {
        paddingHorizontal: 0,
      },
      tags: {
        p: {
          fontSize: 13,
          lineHeight: calculateLineHeight(13),
          marginVertical: 0,
        },
        a: {
          fontSize: 13,
          lineHeight: calculateLineHeight(13),
          // TODO: SimpleHtml blocks font changes. For now, this works for iOS only
          fontWeight: '400',
          color: '#0000EE',
        },
      },
    },
  },

  'shoutem.social.StatusViewSkeleton': {
    statusItemContainerSkeleton: {
      backgroundColor: resolveVariable('paperColor'),
      marginHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginTop: getSizeRelativeToReference(
        15,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginBottom: getSizeRelativeToReference(
        6,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderColor: resolveVariable('paperColor'),
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 1, height: 2 },
      elevation: 2,
    },
    profileImageSkeleton: {
      width: getSizeRelativeToReference(
        40,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        40,
        375,
        resolveVariable('sizes.window.width'),
      ),
      borderRadius: getSizeRelativeToReference(
        20,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginRight: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    userNameSkeleton: {
      height: getSizeRelativeToReference(
        12,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: '60%',
      marginBottom: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    timeAgoSkeleton: {
      height: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: '50%',
      marginBottom: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    contentLineSkeleton: {
      height: 10,
      marginTop: getSizeRelativeToReference(
        15,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginBottom: getSizeRelativeToReference(
        -10,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    longLine: {
      width: '80%',
    },
    shortLine: {
      width: '60%',
    },
    emptySpace: {
      marginBottom: getSizeRelativeToReference(
        70,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
  },

  'shoutem.social.StatusHeader': {
    profileImage: {
      height: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 20,
    },
    moreIcon: {
      color: resolveVariable('shoutem.navigation', 'navBarIconsColor'),
    },
  },

  'shoutem.social.Interactions': {
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    icon: {
      color: resolveVariable('text.color'),
    },
    iconText: {
      marginLeft: getSizeRelativeToReference(
        2,
        375,
        resolveVariable('sizes.window.width'),
      ),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '500',
        resolveVariable('text.fontStyle'),
      ),
    },
    heartIcon: {
      color: resolveVariable('paperColor'),
      stroke: resolveVariable('text.color'),
    },
  },

  'shoutem.social.InteractionActions': {
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    interactionButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: resolveVariable('paperColor'),
      borderWidth: 1,
      borderColor: resolveVariable('lineColor'),
      borderRadius: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        38,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginVertical: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginHorizontal: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    likedStatusButtonText: { color: resolveVariable('featuredColor') },
  },

  'shoutem.social.CommentView': {
    container: {
      flexDirection: 'row',
      marginVertical: getSizeRelativeToReference(
        5,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    profileImage: {
      marginRight: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginTop: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    contentContainer: {
      flex: 1,
      backgroundColor: resolveVariable('paperColor'),
      padding: getSizeRelativeToReference(
        3,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginHorizontal: 0,
      marginBottom: getSizeRelativeToReference(
        6,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 12,
      borderColor: resolveVariable('paperColor'),
      borderWidth: 1,
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 1, height: 2 },
      elevation: 1,
    },
    row: {
      paddingTop: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    contentInnerContainer: { padding: 0 },
    username: {
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '500',
        resolveVariable('text.fontStyle'),
      ),
    },
    timeAgo: { fontSize: 10, lineHeight: calculateLineHeight(10) },
    comment: {
      container: {
        paddingHorizontal: getSizeRelativeToReference(
          5,
          375,
          resolveVariable('sizes.window.width'),
        ),
        paddingBottom: 0,
      },
      tags: {
        p: {
          fontSize: 13,
          lineHeight: calculateLineHeight(13),
          marginVertical: 0,
        },
        a: {
          fontSize: 13,
          lineHeight: calculateLineHeight(13),
          // TODO: SimpleHtml blocks font changes. For now, this works for iOS only
          fontWeight: '400',
          color: '#0000EE',
        },
      },
    },
    actionSheet: {
      option: {
        text: { color: '#F9483E' }, // iOS destructive red
      },
    },
  },

  'shoutem.social.CommentViewSkeleton': {
    container: {
      flexDirection: 'row',
      marginVertical: getSizeRelativeToReference(
        5,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    profileImageSkeleton: {
      width: getSizeRelativeToReference(
        30,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        30,
        375,
        resolveVariable('sizes.window.width'),
      ),
      borderRadius: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginRight: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginTop: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    contentContainer: {
      flex: 1,
      backgroundColor: resolveVariable('paperColor'),
      padding: getSizeRelativeToReference(
        3,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginHorizontal: 0,
      marginBottom: getSizeRelativeToReference(
        6,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 12,
      borderColor: resolveVariable('paperColor'),
      borderWidth: 1,
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 1, height: 2 },
      elevation: 1,
    },
    row: {
      paddingTop: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    contentInnerContainer: { padding: 0 },
    userNameSkeleton: {
      height: getSizeRelativeToReference(
        12,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: '40%',
    },
    captionLineSkeleton: {
      height: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginBottom: getSizeRelativeToReference(
        3,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    timeAgoWidth: { width: '20%' },
    longContentLineWidth: { width: '90%' },
    shortContentLineWidth: { width: '80%' },
  },

  'shoutem.social.AudioAttachment': {
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: inverseColorBrightnessForAmount(
        resolveVariable('paperColor'),
        3,
      ),
      padding: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
      borderRadius: 12,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    audioTitle: { flex: 1, fontSize: 8, lineHeight: calculateLineHeight(10) },
    icon: {
      marginLeft: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginRight: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
  },

  'shoutem.social.ImageAttachment': {
    imagePreview: {
      ...(!isWeb && { flex: 1 }),
    },
    loadingIndicator: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  'shoutem.social.WebsiteAttachment': {
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: inverseColorBrightnessForAmount(
        resolveVariable('paperColor'),
        3,
      ),
      borderRadius: 12,
    },
    image: {
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      width: getSizeRelativeToReference(
        70,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        70,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 8,
      borderRadius: 10,
    },
    url: {
      fontSize: 8,
      color: changeColorAlpha(resolveVariable('text.caption'), 0.5),
    },
    title: {
      fontSize: 10,
    },
  },

  'shoutem.social.VideoAttachment': {
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
      borderRadius: 10,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: inverseColorBrightnessForAmount(
        resolveVariable('paperColor'),
        3,
      ),
      borderRadius: 12,
    },
    image: {
      width: '100%',
      height: getSizeRelativeToReference(
        200,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    title: {
      marginBottom: getSizeRelativeToReference(
        5,
        812,
        resolveVariable('sizes.window.height'),
      ),
      fontWeight: resolveFontWeight('700'),
      fontSize: 12,
      lineHeight: calculateLineHeight(14),
    },
    description: { fontSize: 12, lineHeight: calculateLineHeight(14) },
  },

  'shoutem.social.RecentImages': {
    image: {
      width: getSizeRelativeToReference(
        54,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        54,
        375,
        resolveVariable('sizes.window.width'),
      ),
      borderRadius: 10,
      marginRight: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    recentImagesList: {
      listContent: {
        backgroundColor: resolveVariable('paperColor'),
      },
    },
  },

  'shoutem.social.NewStatusFooter': {
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingRight: isWeb ? 0 : responsiveWidth(15),
      paddingTop: responsiveHeight(5),
      paddingBottom: responsiveHeight(10),
    },
    expandButton: {
      justifyContent: 'center',
      paddingVertical: responsiveHeight(15),
      paddingHorizontal: responsiveWidth(20),
      borderRadius: 10,
    },
    plusIconRotated: {
      transform: [{ rotate: '45deg' }],
    },
  },

  'shoutem.social.NewCommentFooter': {
    textInput: {
      flex: 1,
      maxHeight: 100,
      justifyContent: 'center',
      padding: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      margin: getSizeRelativeToReference(
        5,
        812,
        resolveVariable('sizes.window.height'),
      ),
      backgroundColor: resolveVariable('searchInputBackgroundColor'),
      borderRadius: 10,
      ...resolveVariable('text'),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        resolveVariable('text.fontWeight'),
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight(resolveVariable('text.fontWeight')),
      fontStyle: resolveFontStyle(resolveVariable('text.fontStyle')),
    },
    textInputMarginLeft: {
      marginLeft: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    removeAttachmentIcon: {
      color: '#FFFFFF',
      height: responsiveHeight(18),
      width: responsiveHeight(18),
    },
    image: {
      width: getSizeRelativeToReference(
        145,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        92,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 10,
    },
    postButtonContainer: {
      height: getSizeRelativeToReference(
        48,
        812,
        resolveVariable('sizes.window.height'),
      ),
      paddingRight: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
      paddingLeft: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
      justifyContent: 'center',
    },
    plusIconRotated: {
      transform: [{ rotate: '45deg' }],
    },
    removeAttachmentButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'grey',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 130,
      top: 5,
      zIndex: 5,
    },
  },

  'shoutem.social.AddAttachmentButtons': {
    attachmentsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    button: {
      maxHeight: 100,
      justifyContent: 'flex-end',
      paddingHorizontal: responsiveWidth(20),
      paddingVertical: responsiveHeight(15),
    },
    icon: {
      width: responsiveHeight(18),
      height: responsiveHeight(18),
    },
    buttonText: {
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '700',
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight('700'),
    },
  },

  'shoutem.social.GiphyPicker': {
    modal: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
    },
    screen: {
      flex: 1,
      backgroundColor: 'white',
      width: '100%',
      paddingVertical: isWeb ? responsiveHeight(30) : undefined,
    },
    closeButton: { position: 'absolute' },
    title: {
      alignSelf: 'center',
      fontFamily: resolveFontFamily(
        resolveVariable('title.fontFamily'),
        resolveVariable('title.fontWeight'),
        resolveVariable('title.fontStyle'),
      ),
      fontWeight: resolveFontWeight(resolveVariable('title.fontWeight')),
      fontStyle: resolveFontStyle(resolveVariable('title.fontStyle')),
    },
    searchInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      paddingVertical: 20,
    },
    searchInput: {
      borderColor: resolveVariable('inputBorderColor'),
      borderWidth: 1,
      borderRadius: 6,
      height: responsiveHeight(30),
      width: responsiveWidth(300),
      paddingVertical: responsiveHeight(3),
      margin: responsiveHeight(10),
    },
    giphyPickerFooter: {
      width: '100%',
      height: responsiveHeight(50),
      alignSelf: 'center',
    },
  },

  'shoutem.social.GiphyImage': {
    loadingIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    image: {
      margin: responsiveHeight(2),
      borderRadius: 6,
    },
  },

  'shoutem.social.BlockedUsers': {
    screen: {
      backgroundColor: resolveVariable('paperColor'),
    },
    list: {
      listContent: { backgroundColor: resolveVariable('paperColor') },
    },
  },

  'shoutem.social.MembersScreen': {
    screen: {
      backgroundColor: resolveVariable('paperColor'),
    },
    list: {
      listContent: { backgroundColor: resolveVariable('paperColor') },
    },
  },
});
