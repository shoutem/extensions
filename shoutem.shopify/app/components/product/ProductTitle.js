import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { ext } from '../../const';

function ProductTitle({ title, isFeatured, style }) {
  const resolvedTitleStyle = useMemo(
    () => [style.title, isFeatured && style.featuredTitle],
    [style, isFeatured],
  );

  return (
    <Text numberOfLines={2} style={resolvedTitleStyle}>
      {title}
    </Text>
  );
}

ProductTitle.propTypes = {
  title: PropTypes.string.isRequired,
  isFeatured: PropTypes.bool,
  style: PropTypes.object,
};

ProductTitle.defaultProps = {
  isFeatured: false,
  style: {},
};

export default connectStyle(ext('ProductTitle'))(React.memo(ProductTitle));
