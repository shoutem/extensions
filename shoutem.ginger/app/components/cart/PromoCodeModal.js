import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../../assets';
import { ext } from '../../const';
import LoadingButton from '../LoadingButton';

const KEYBOARD_AVOIDING_BEHAVIOUR =
  Platform.OS === 'android' ? 'null' : 'padding';

export function PromoCodeModal({
  visible,
  onClose,
  onApplyCode,
  style,
  loading,
  activeCode,
  error,
  onClearCode,
}) {
  const [code, setCode] = useState(activeCode);
  const [showClearButton, setShowClearButton] = useState(!!activeCode);

  useEffect(() => {
    if (activeCode && !showClearButton) {
      _.delay(() => setShowClearButton(true), 550);
    }

    if (!activeCode && showClearButton) {
      setCode();
      _.delay(() => setShowClearButton(false), 550);
    }
  }, [activeCode, showClearButton]);

  function handleConfirmPress() {
    onApplyCode(code);
  }

  const buttonDisabled = useMemo(() => loading || !code, [loading, code]);
  const captionText = useMemo(
    () => error || I18n.t(ext('cartPromoCodeCaseSensitiveLabel')),
    [error],
  );
  const captionStyle = useMemo(() => [style.info, error && style.infoError], [
    error,
    style.infoError,
    style.info,
  ]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={KEYBOARD_AVOIDING_BEHAVIOUR}
        style={style.container}
      >
        <TouchableOpacity style={style.container} onPress={onClose}>
          <Pressable style={style.contentContainer} onPress={_.noop}>
            <View style={style.headerContainer}>
              <Text style={style.title}>
                {I18n.t(ext('cartApplyPromoCode'))}
              </Text>
              <TouchableOpacity style={style.iconContainer} onPress={onClose}>
                <Image source={images.arrowLeft} style={style.icon} />
              </TouchableOpacity>
            </View>
            <Text style={style.label}>{I18n.t(ext('cartPromoCodeLabel'))}</Text>
            <TextInput
              style={style.input}
              onChangeText={setCode}
              value={code}
            />
            <Text style={captionStyle}>{captionText}</Text>
            <LoadingButton
              loading={loading}
              disabled={buttonDisabled}
              containerStyle={style.button}
              onPress={handleConfirmPress}
              label={I18n.t(ext('cartPromoCodeApplyButton'))}
            />
            {showClearButton && (
              <LoadingButton
                loading={loading}
                disabled={loading}
                containerStyle={[style.button, style.clearButton]}
                onPress={onClearCode}
                label={I18n.t(ext('cartPromoCodeClearButton'))}
              />
            )}
            <Text style={style.info}>
              {I18n.t(ext('cartPromoCodeDisclaimer'))}
            </Text>
          </Pressable>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

PromoCodeModal.propTypes = {
  onApplyCode: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  activeCode: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool,
  style: PropTypes.object,
  visible: PropTypes.bool,
  onClearCode: PropTypes.func,
};

PromoCodeModal.defaultProps = {
  activeCode: '',
  error: undefined,
  onClearCode: undefined,
  visible: false,
  loading: false,
  style: {},
};

export default connectStyle(ext('PromoCodeModal'))(PromoCodeModal);
