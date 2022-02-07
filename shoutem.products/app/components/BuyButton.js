import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Text } from '@shoutem/ui';
import { AppContextProvider } from 'shoutem-core';

function BuyButton({ accessToken, onBuyPress, product }) {
  if (!product?.link) {
    return null;
  }

  function handleBuyPress() {
    onBuyPress(accessToken);
  }

  return (
    <Button styleName="md-gutter-top" onPress={handleBuyPress}>
      <Text>{product.buyTitle}</Text>
    </Button>
  );
}

BuyButton.propTypes = {
  product: PropTypes.object.isRequired,
  onBuyPress: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
};

BuyButton.defaultProps = {
  accessToken: undefined,
};

export default function BuyButtonWithContext(props) {
  return (
    <AppContextProvider>
      {context => {
        const accessToken = _.get(context, ['shoutem.auth', 'accessToken']);

        return <BuyButton {...props} accessToken={accessToken} />;
      }}
    </AppContextProvider>
  );
}
