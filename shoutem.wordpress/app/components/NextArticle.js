import React from 'react';
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
 * A component used to render the next article info on
 * the article details screen.
 */
export function NextArticle({ title, imageUrl, openArticle }) {
  const articleImage = imageUrl ? { uri: imageUrl } : assets.noImagePlaceholder;

  return (
    <TouchableOpacity onPress={openArticle}>
      <ImageBackground
        styleName="large-ultra-wide placeholder"
        source={articleImage}
      >
        <Tile styleName="fill-parent md-gutter space-between">
          <Caption styleName="bold h-left">{I18n.t(ext('upNext'))}</Caption>
          <Subtitle styleName="h-left" numberOfLines={2}>
            {title}
          </Subtitle>
        </Tile>
      </ImageBackground>
    </TouchableOpacity>
  );
}

NextArticle.propTypes = {
  openArticle: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
};

NextArticle.defaultProps = {
  imageUrl: undefined,
  title: '',
};
