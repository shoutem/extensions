import React, { useCallback } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Spinner, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { isPreviewApp } from 'shoutem.preview';
import { ext } from '../const';
import { formatSubscribeMessage } from '../services';

const SubscribeButtons = ({
  products,
  style,
  onSubscribePress,
  onRestorePress,
  loading,
  trialDuration,
}) => {
  const handleSubscribePress = useCallback(
    productId => {
      onSubscribePress(productId);
    },
    [onSubscribePress],
  );

  return (
    <View style={style.container}>
      {!isPreviewApp &&
        _.map(products, product => (
          <Button
            disabled={loading}
            onPress={() => handleSubscribePress(product.sku)}
            style={style.button}
          >
            {!loading && (
              <Text style={style.buttonText}>
                {formatSubscribeMessage(product)}
              </Text>
            )}
            {loading && <Spinner style={style.spinner} />}
          </Button>
        ))}
      {isPreviewApp && (
        <Button
          disabled={loading}
          onPress={handleSubscribePress}
          style={style.button}
        >
          {!loading && (
            <Text style={style.buttonText}>{formatSubscribeMessage()}</Text>
          )}
          {loading && <Spinner style={style.spinner} />}
        </Button>
      )}
      {trialDuration && <Text style={style.trialText}>{trialDuration}</Text>}
      <Button
        disabled={loading}
        onPress={onRestorePress}
        style={[style.button, style.buttonSecondary]}
      >
        {!loading && (
          <Text style={[style.buttonText, style.buttonTextSecondary]}>
            {I18n.t(ext('restoreButtonTitle'))}
          </Text>
        )}
        {loading && <Spinner style={style.spinnerSecondary} />}
      </Button>
    </View>
  );
};

SubscribeButtons.propTypes = {
  products: PropTypes.array.isRequired,
  onRestorePress: PropTypes.func.isRequired,
  onSubscribePress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  style: PropTypes.object,
  trialDuration: PropTypes.string,
};

SubscribeButtons.defaultProps = {
  loading: false,
  style: {},
  trialDuration: undefined,
};

export default connectStyle(ext('SubscribeButtons'))(SubscribeButtons);
