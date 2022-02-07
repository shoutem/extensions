import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { InlineMap } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function Map({ caption, marker, onMapPress, region, subtitle }) {
  return (
    <View>
      <Divider styleName="section-header">
        <Caption>{I18n.t('shoutem.cms.mapTitle')}</Caption>
      </Divider>
      <TouchableOpacity onPress={onMapPress}>
        <InlineMap
          initialRegion={region}
          markers={[marker]}
          selectedMarker={marker}
          styleName="medium-tall"
        >
          <View styleName="overlay vertical v-center h-center fill-parent">
            <Subtitle>{subtitle}</Subtitle>
            <Caption>{caption}</Caption>
          </View>
        </InlineMap>
      </TouchableOpacity>
    </View>
  );
}

Map.propTypes = {
  onMapPress: PropTypes.func.isRequired,
  caption: PropTypes.string,
  marker: PropTypes.object,
  region: PropTypes.object,
  subtitle: PropTypes.string,
};

Map.defaultProps = {
  caption: '',
  marker: {},
  region: undefined,
  subtitle: '',
};

export default connectStyle(ext('Map'))(Map);
