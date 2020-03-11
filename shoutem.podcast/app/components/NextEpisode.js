import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  ImageBackground,
  Tile,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

/**
 * A component used to render the next episode info on
 * the episode details screen.
 */
export class NextEpisode extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    openEpisode: PropTypes.func.isRequired,
  };

  render() {
    const { title, imageUrl, openEpisode } = this.props;
    return (
      <TouchableOpacity onPress={openEpisode}>
        <ImageBackground
          source={{ uri: imageUrl }}
          styleName="large-ultra-wide placeholder"
        >
          <Tile
            styleName="fill-parent md-gutter space-between"
          >
            <Caption styleName="bold h-left">{I18n.t(ext('upNext'))}</Caption>
            <Subtitle numberOfLines={2} styleName="h-left">{title}</Subtitle>
          </Tile>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}
