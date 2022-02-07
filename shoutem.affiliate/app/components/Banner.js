import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Image,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { getShortcut } from 'shoutem.application';
import { openInModal } from 'shoutem.navigation';
import { ext } from '../const';

function Banner({
  config: { showBanner, bannerLink, description, imageUrl = '', title },
  style,
}) {
  const shortcut = useSelector(state => getShortcut(state, bannerLink?.id));

  function handleBannerLinkPress() {
    if (!showBanner || !shortcut || (!shortcut.screen && !shortcut.action)) {
      return;
    }

    const screen = shortcut.screens.find(
      screen => screen.canonicalType === shortcut.screen,
    );

    if (!screen) {
      return;
    }

    const { settings: screenSettings = {} } = screen;

    openInModal(screen.canonicalName, {
      shortcut,
      screenSettings,
      title: shortcut.title,
    });
  }

  return (
    <TouchableOpacity onPress={handleBannerLinkPress}>
      <View styleName="md-gutter horizontal">
        <Image
          styleName="small rounded-corners placeholder"
          source={{ uri: imageUrl }}
        />
        <View styleName="flexible vertical stretch md-gutter-left">
          <Subtitle styleName="sm-gutter-bottom" style={style.title}>
            {title}
          </Subtitle>
          <Caption numberOfLines={2}>{description}</Caption>
        </View>
      </View>
      <Divider styleName="section-header" style={style.divider} />
    </TouchableOpacity>
  );
}

Banner.propTypes = {
  config: PropTypes.object.isRequired,
  style: PropTypes.object,
};

Banner.defaultProps = {
  style: {},
};

export default connectStyle(ext('Banner'))(Banner);
