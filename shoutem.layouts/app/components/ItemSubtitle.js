import React from 'react';
import PropTypes from 'prop-types';
import { Caption, View } from '@shoutem/ui';

export default function ItemSubtitle({
  containerStyleName,
  subtitle,
  subtitleLeft,
  subtitleRight,
}) {
  if (subtitle) {
    if (typeof subtitle === 'string') {
      return <Caption numberOfLines={1}>{subtitle}</Caption>;
    }

    return subtitle;
  }

  if (subtitleLeft) {
    return (
      <View styleName={containerStyleName}>
        <Caption>{subtitleLeft}</Caption>
        {!!subtitleRight && <Caption>{subtitleRight}</Caption>}
      </View>
    );
  }

  return null;
}

ItemSubtitle.propTypes = {
  containerStyleName: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitleLeft: PropTypes.string,
  subtitleRight: PropTypes.string,
};

ItemSubtitle.defaultProps = {
  containerStyleName: 'horizontal',
  subtitle: '',
  subtitleLeft: '',
  subtitleRight: '',
};
