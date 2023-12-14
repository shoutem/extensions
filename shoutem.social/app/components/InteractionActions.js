import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { getCurrentRoute, navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { likeStatus, unlikeStatus } from '../redux';

function InteractionActions({
  statusId,
  statusLiked,
  maxStatusLength,
  addCommentInputRef,
  style,
}) {
  const dispatch = useDispatch();

  const [optimisticLikeState, setOptimisticLikeState] = useState(statusLiked);

  useEffect(() => {
    setOptimisticLikeState(statusLiked);
  }, [statusLiked]);

  const { enableComments, enableInteractions } = useSelector(state =>
    getExtensionSettings(state, ext()),
  );

  if (!enableComments && !enableInteractions) {
    return null;
  }

  const handleOpenDetailsAndFocusInput = () => {
    const activeRoute = getCurrentRoute();

    // If comment button is pressed while on Wall screen, open Status details screen and focus
    // new comment input on mount.
    // If comment button is pressed while on status details screen, focus the comment input.
    if (activeRoute.name === ext('SocialWallScreen')) {
      navigateTo(ext('StatusDetailsScreen'), {
        statusId,
        focusAddCommentInput: true,
        maxStatusLength,
        addCommentInputRef,
        focusAddCommentInputOnMount: true,
      });
    }

    addCommentInputRef?.current?.focus();
  };

  const toggleLikeStatus = () => {
    setOptimisticLikeState(!statusLiked);

    if (!statusLiked) {
      dispatch(authenticate(() => dispatch(likeStatus(statusId))));
    } else {
      dispatch(unlikeStatus(statusId));
    }
  };

  return (
    <View style={style.container}>
      {enableInteractions && (
        <Pressable style={style.interactionButton} onPress={toggleLikeStatus}>
          <Text style={optimisticLikeState ? style.likedStatusButtonText : {}}>
            {optimisticLikeState
              ? I18n.t(ext('likedStatusButtonText'))
              : I18n.t(ext('likeStatusButtonText'))}
          </Text>
        </Pressable>
      )}
      {enableComments && (
        <Pressable
          style={style.interactionButton}
          onPress={handleOpenDetailsAndFocusInput}
        >
          <Text>{I18n.t(ext('newCommentPlaceholder'))}</Text>
        </Pressable>
      )}
    </View>
  );
}

InteractionActions.propTypes = {
  maxStatusLength: PropTypes.number.isRequired,
  statusId: PropTypes.number.isRequired,
  statusLiked: PropTypes.bool.isRequired,
  addCommentInputRef: PropTypes.object,
  style: PropTypes.object,
};

InteractionActions.defaultProps = {
  addCommentInputRef: { current: {} },
  style: {},
};

export default connectStyle(ext('InteractionActions'))(InteractionActions);
