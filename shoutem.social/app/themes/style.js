import {
  changeColorAlpha,
  getSizeRelativeToReference,
  INCLUDE,
  inverseColorBrightnessForAmount,
} from '@shoutem/theme';
import {
  calculateLineHeight,
  createScopedResolver,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
} from '@shoutem/ui';
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
    overlay: {
      backgroundColor: resolveVariable('imageOverlayColor'),
      borderRadius: 10,
    },
    removeImageIcon: {
      color: '#FFFFFF',
      height: getSizeRelativeToReference(
        18,
        375,
        resolveVariable('sizes.window.width'),
      ),
      width: getSizeRelativeToReference(
        18,
        375,
        resolveVariable('sizes.window.width'),
      ),
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
    placeholderText: { opacity: 0.5 },
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
      marginRight: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    likeButtonWidth: {
      width: getSizeRelativeToReference(
        80,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    commentsButtonWidth: {
      width: getSizeRelativeToReference(
        110,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    icon: {
      color: resolveVariable('text.color'),
    },
    iconText: {
      marginLeft: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '500',
        resolveVariable('text.fontStyle'),
      ),
    },
  },

  'shoutem.social.Like': {
    heartIcon: {
      color: resolveVariable('paperColor'),
      stroke: resolveVariable('text.color'),
    },
    heartIconLiked: {
      color: resolveVariable('likeButtonFillColor'),
      stroke: resolveVariable('likeButtonFillColor'),
    },
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
    commentAttachment: {
      height: getSizeRelativeToReference(
        160,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 10,
    },
    statusAttachment: {
      height: getSizeRelativeToReference(
        210,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: 10,
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

  'shoutem.social.NewStatusFooter': {
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: getSizeRelativeToReference(
        15,
        375,
        resolveVariable('sizes.window.width'),
      ),
      paddingTop: getSizeRelativeToReference(
        5,
        812,
        resolveVariable('sizes.window.height'),
      ),
      paddingBottom: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    attachmentIcon: {
      width: getSizeRelativeToReference(
        24,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        24,
        375,
        resolveVariable('sizes.window.width'),
      ),
      color: resolveVariable('text.color'),
    },
    button: {
      justifyContent: 'center',
      padding: resolveVariable('mediumGutter'),
      backgroundColor: 'rgba(136, 143, 161, 0.1)',
      borderRadius: 10,
    },
    cameraButton: {
      marginRight: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    galleryButton: {
      marginRight: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
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
    attachmentsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    button: {
      maxHeight: 100,
      justifyContent: 'flex-end',
      paddingHorizontal: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
      paddingVertical: getSizeRelativeToReference(
        15,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    overlay: {
      [INCLUDE]: ['fillParent'],
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      paddingRight: getSizeRelativeToReference(
        5,
        375,
        resolveVariable('sizes.window.width'),
      ),
      paddingTop: getSizeRelativeToReference(
        5,
        815,
        resolveVariable('sizes.window.height'),
      ),
      backgroundColor: resolveVariable('imageOverlayColor'),
      borderRadius: 10,
    },
    deleteAttachmentIcon: {
      color: '#FFFFFF',
      height: getSizeRelativeToReference(
        18,
        375,
        resolveVariable('sizes.window.width'),
      ),
      width: getSizeRelativeToReference(
        18,
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
