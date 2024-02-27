import { useCallback, useState } from 'react';
import { Platform, Share } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

/**
 * Hook for managing the radio action sheet, providing functionality to show/hide the action sheet
 * and share the stream's title and URL.
 *
 * @param {string} streamUrl - The URL of the radio stream.
 * @param {string} streamTitle - The title of the radio stream.
 * @returns {object}
 *   - {boolean} active - Indicates if the action sheet is currently active or not.
 *   - {function} showActionSheet - Function to set the action sheet as active.
 *   - {function} hideActionSheet - Function to set the action sheet as inactive.
 *   - {function} shareStream - Function to share the stream's title and URL.
 */
export const useRadioActionSheet = (streamUrl, streamTitle) => {
  const [actionSheetActive, setActionSheetActive] = useState(false);

  const showActionSheet = useCallback(() => setActionSheetActive(true), []);
  const hideActionSheet = useCallback(() => setActionSheetActive(false), []);

  const shareStream = useCallback(() => {
    const shareMessage = I18n.t(ext('shareMessage'), { streamUrl });
    const shareTitle = I18n.t(ext('shareTitle'), { streamTitle });

    Share.share({
      title: shareTitle,
      message:
        Platform.OS === 'android'
          ? streamUrl
          : `${shareTitle}. ${shareMessage}`,
    });
  }, [streamTitle, streamUrl]);

  return {
    active: actionSheetActive,
    showActionSheet,
    hideActionSheet,
    shareStream,
  };
};
