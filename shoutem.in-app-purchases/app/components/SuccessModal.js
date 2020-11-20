import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import {
  Text,
  Button,
} from '@shoutem/ui';
import { ext } from '../const';

class SuccessModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    onButtonPress: PropTypes.func,
    onModalHide: PropTypes.func,
  };

  static defaultProps = { buttonText: 'OK' };

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
        isVisible={visible}
        onModalHide={onModalHide}
        hasBackdrop={false}
        useNativeDriver
        style={style.modal}
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

export default connectStyle(ext('SuccessModal'))(SuccessModal);
