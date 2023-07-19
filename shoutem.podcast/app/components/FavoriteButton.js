import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon } from '@shoutem/ui';
import { ext } from '../const';

export function FavoriteButton({ iconColor, isFavorited, onPress }) {
  const iconName = useMemo(
    () => (isFavorited ? 'add-to-favorites-on' : 'add-to-favorites-off'),
    [isFavorited],
  );

  return (
    <Button onPress={onPress} styleName="clear tight">
      <Icon name={iconName} iconFill={iconColor} />
    </Button>
  );
}

FavoriteButton.propTypes = {
  isFavorited: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  iconColor: PropTypes.string,
};

FavoriteButton.defaultProps = {
  iconColor: null,
};

export default connectStyle(ext('FavoriteButton'))(FavoriteButton);
