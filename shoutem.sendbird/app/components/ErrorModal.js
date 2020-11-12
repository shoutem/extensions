import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';
import autoBindReact from 'auto-bind/react';
import Modal from 'react-native-modal';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import {
  Text,
  Button,
} from '@shoutem/ui';
import { ext } from '../const';
import { images } from '../assets';

class ErrorModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    onButtonPress: PropTypes.func,
    onDismissRequest: PropTypes.func,
    onModalHide: PropTypes.func,
  };

  static defaultProps = { buttonText: 'OK' };

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
            {title && <Text style={style.title}>{title}</Text>}
            {description && <Text style={style.description}>{description}</Text>}
            <Button onPress={onButtonPress} style={style.button}>
              <Text style={style.buttonText}>{buttonText}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

export default connectStyle(ext('ErrorModal'))(ErrorModal);
