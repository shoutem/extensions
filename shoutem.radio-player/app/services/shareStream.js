import { Share } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { isAndroid } from 'shoutem-core';
import { ext } from '../const';
import { unavailableInWeb } from 'shoutem.application';

export const shareStream = (streamUrl, streamTitle) => {
  const shareMessage = I18n.t(ext('shareMessage'), { streamUrl });
  const shareTitle = I18n.t(ext('shareTitle'), { streamTitle });

  unavailableInWeb(() =>
    Share.share({
      title: shareTitle,
      message: isAndroid ? streamUrl : `${shareTitle}. ${shareMessage}`,
    }),
  )();
};
