import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Overlay, Text, View } from '@shoutem/ui';
import { InlineMap } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

function DeliveryAddress({ address, style }) {
  const { latitude, longitude, address1, city, country } = address;

  const marker = useMemo(
    () => ({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [latitude, longitude],
  );

  const displayAddress = useMemo(() => `${address1}, ${city}, ${country}`, [
    address1,
    city,
    country,
  ]);

  return (
    <View style={style.container}>
      <Text style={style.title}>{I18n.t(ext('deliveryAddress'))}</Text>
      <InlineMap
        initialRegion={marker}
        style={style.map}
        markers={[marker]}
        selectedMarker={marker}
      >
        <Overlay style={style.mapTextContainer}>
          <Text style={style.mapText}>{displayAddress}</Text>
        </Overlay>
      </InlineMap>
    </View>
  );
}

DeliveryAddress.propTypes = {
  address: PropTypes.shape({
    address1: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('DeliveryAddress'))(DeliveryAddress);
