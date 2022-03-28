import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Caption,
  ImageBackground,
  Subtitle,
  Tile,
  TouchableOpacity,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';

/**
 * A component used to render the next episode info on
 * the episode details screen.
 */
export default class NextEpisode extends PureComponent {
  render() {
    const { title, imageUrl, openEpisode } = this.props;

    const episodeImage = imageUrl
      ? { uri: imageUrl }
      : assets.noImagePlaceholder;

    return (
      <TouchableOpacity onPress={openEpisode}>
        <ImageBackground
          source={episodeImage}
          styleName="large-ultra-wide placeholder"
        >
          <Tile styleName="fill-parent md-gutter space-between">
            <Caption styleName="bold h-left">{I18n.t(ext('upNext'))}</Caption>
            <Subtitle numberOfLines={2} styleName="h-left">
              {title}
            </Subtitle>
          </Tile>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

NextEpisode.propTypes = {
  openEpisode: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
};

NextEpisode.defaultProps = {
  imageUrl: undefined,
  title: '',
};
