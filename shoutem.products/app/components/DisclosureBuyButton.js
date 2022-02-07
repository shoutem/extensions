import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Caption,
  Divider,
  Icon,
  Row,
  Subtitle,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { AppContextProvider } from 'shoutem-core';

function DisclosureBuyButton({ accessToken, onBuyPress, product }) {
  function handleBuyPress() {
    onBuyPress(accessToken);
  }

  return (
    <TouchableOpacity onPress={handleBuyPress}>
      <Divider styleName="section-header">
        <Caption />
      </Divider>
      <Row>
        <Icon styleName="indicator" name="laptop" />
        <View styleName="vertical">
          <Subtitle>{product?.buyTitle}</Subtitle>
          <Text numberOfLines={1}>{product.link}</Text>
        </View>
        <Icon styleName="indicator disclosure" name="right-arrow" />
      </Row>
    </TouchableOpacity>
  );
}

DisclosureBuyButton.propTypes = {
  product: PropTypes.object.isRequired,
  onBuyPress: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
};

DisclosureBuyButton.defaultProps = {
  accessToken: undefined,
};

export default function DisclosureBuyButtonWithContext(props) {
  return (
    <AppContextProvider>
      {context => {
        const accessToken = _.get(context, ['shoutem.auth', 'accessToken']);

        return <DisclosureBuyButton {...props} accessToken={accessToken} />;
      }}
    </AppContextProvider>
  );
}
