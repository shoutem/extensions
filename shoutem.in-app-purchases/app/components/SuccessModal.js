import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text } from '@shoutem/ui';
import { ext } from '../const';

class SuccessModal extends PureComponent {
  render() {
    const {
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
        hasBackdrop={false}
        isVisible={visible}
        onModalHide={onModalHide}
        style={style.modal}
        useNativeDriver
      >
        <View style={style.container}>
          {title && <Text style={style.title}>{title}</Text>}
          {description && <Text style={style.description}>{description}</Text>}
          <Button onPress={onButtonPress} style={style.button}>
            <Text style={style.buttonText}>{buttonText}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

SuccessModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onButtonPress: PropTypes.func.isRequired,
  onModalHide: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
};

SuccessModal.defaultProps = {
  description: null,
  buttonText: 'OK',
  style: {},
  title: null,
};

export default connectStyle(ext('SuccessModal'))(SuccessModal);
