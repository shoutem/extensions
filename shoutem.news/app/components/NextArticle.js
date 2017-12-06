import React from 'react';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  Image,
  Tile,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

/**
 * A component used to render the next article info on
 * the article details screen.
 */
export class NextArticle extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    imageUrl: React.PropTypes.string,
    openArticle: React.PropTypes.func.isRequired,
  };

  render() {
    const { title, imageUrl, openArticle } = this.props;
    return (
      <TouchableOpacity onPress={openArticle}>
        <Image
          styleName="large-ultra-wide placeholder"
          source={{ uri: imageUrl }}
        >
          <Tile
            styleName="fill-parent md-gutter space-between"
          >
            <Caption styleName="bold h-left">{I18n.t(ext('upNext'))}</Caption>
            <Subtitle styleName="h-left" numberOfLines={2}>{title}</Subtitle>
          </Tile>
        </Image>
      </TouchableOpacity>
    );
  }
}
