import { Platform, Share } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export const shareStream = (streamUrl, streamTitle) => {
  const shareMessage = I18n.t(ext('shareMessage'), { streamUrl });
  const shareTitle = I18n.t(ext('shareTitle'), { streamTitle });

  Share.share({
    title: shareTitle,
    message:
      Platform.OS === 'android' ? streamUrl : `${shareTitle}. ${shareMessage}`,
  });
};
