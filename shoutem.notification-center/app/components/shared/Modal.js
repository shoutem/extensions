import React from 'react';
import RNModal from 'react-native-modal';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../../const';

function Modal(props) {
  const {
    children,
    handleModalClose,
    swipeDirection,
    isVisible,
    style,
    ...otherProps
  } = props;

  // Unmount modal as soon as possible
  if (!isVisible) {
    return null;
  }

  return (
    <RNModal
      isVisible={isVisible}
      propagateSwipe
      style={style.modal}
      swipeDirection={swipeDirection}
      onBackButtonPress={handleModalClose}
      onBackdropPress={handleModalClose}
      onSwipeComplete={handleModalClose}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...otherProps}
    >
      <View style={style.container}>{children}</View>
    </RNModal>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  style: PropTypes.object,
  swipeDirection: PropTypes.array,
};

Modal.defaultProps = {
  swipeDirection: ['up', 'down'],
  style: {},
};

export default connectStyle(ext('Modal'))(Modal);
