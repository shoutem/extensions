import React, { PureComponent } from 'react';
import { Image, View } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text } from '@shoutem/ui';
import { images } from '../assets';
import { ext } from '../const';

class ErrorModal extends PureComponent {
  render() {
    const {
      onDismissPress,
      style,
      title,
      description,
      buttonText,
      onButtonPress,
      visible,
      onModalHide,
    } = this.props;

    return (
      <Modal
        backdropOpacity={0.4}
        isVisible={visible}
        onBackdropPress={onDismissPress}
        onModalHide={onModalHide}
      >
        <View style={style.outerContainer}>
          <View style={style.container}>
            <Image source={images.errorGraphic} style={style.image} />
            {!!title && <Text style={style.title}>{title}</Text>}
            {!!description && (
              <Text style={style.description}>{description}</Text>
            )}
            <Button onPress={onButtonPress} style={style.button}>
              <Text style={style.buttonText}>{buttonText}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

ErrorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onModalHide: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  onButtonPress: PropTypes.func,
  onDismissPress: PropTypes.func,
};

ErrorModal.defaultProps = {
  buttonText: 'OK',
  style: {},
  title: '',
  description: '',
  onButtonPress: null,
  onDismissPress: null,
};

export default connectStyle(ext('ErrorModal'))(ErrorModal);
