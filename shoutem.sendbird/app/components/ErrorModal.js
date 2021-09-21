import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import Modal from 'react-native-modal';
import { connectStyle } from '@shoutem/theme';
import { Text, Button } from '@shoutem/ui';
import { images } from '../assets';
import { ext } from '../const';

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
            {description && (
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

export default connectStyle(ext('ErrorModal'))(ErrorModal);
