import React from 'react';
import { Modal, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../const';
import LoadingButton from './LoadingButton';

export function ConfirmationModal({
  visible,
  onCancel,
  onConfirm,
  loading,
  cancelButtonText,
  confirmButtonText,
  description,
  style,
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableOpacity style={style.container} onPress={onCancel}>
        <Pressable style={style.contentContainer}>
          <Text style={style.caption}>{description}</Text>
          <View style={style.buttonContainer}>
            <Button style={style.button} onPress={onCancel} disabled={loading}>
              <Text>{cancelButtonText}</Text>
            </Button>
            {onConfirm && (
              <LoadingButton
                containerStyle={style.confirmButton}
                onPress={onConfirm}
                disabled={loading}
                loading={loading}
                label={confirmButtonText}
              />
            )}
          </View>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  description: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  loading: PropTypes.bool,
  style: PropTypes.object,
  visible: PropTypes.bool,
  onConfirm: PropTypes.func,
};

ConfirmationModal.defaultProps = {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Ok',
  visible: false,
  loading: false,
  style: {},
  onConfirm: undefined,
};

export default connectStyle(ext('ConfirmationModal'))(ConfirmationModal);
