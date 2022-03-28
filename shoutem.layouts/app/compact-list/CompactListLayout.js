import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, ListView } from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import { resolveProp } from '../services';
import { CompactListItem } from './components';

export function CompactListLayout({
  data,
  onPress,
  renderActions,
  renderRow: customRenderRow,
  emptyStateAction,
  emptyStateIconName,
  emptyStateMessage,
  imageUrlResolver,
  subtitleResolver,
  subtitleLeftResolver,
  subtitleRightResolver,
  titleResolver,
  ...otherProps
}) {
  function renderRow(item) {
    const imageUrl = resolveProp(item, imageUrlResolver, null);
    const subtitle = resolveProp(item, subtitleResolver, '');
    const subtitleLeft = resolveProp(item, subtitleLeftResolver, '');
    const subtitleRight = resolveProp(item, subtitleRightResolver, '');
    const title = resolveProp(item, titleResolver, '');

    const imageSource = imageUrl
      ? { uri: imageUrl }
      : assets.noImagePlaceholder;

    return (
      <CompactListItem
        imageSource={imageSource}
        item={item}
        onPress={onPress}
        renderActions={renderActions}
        subtitle={subtitle}
        subtitleLeft={subtitleLeft}
        subtitleRight={subtitleRight}
        title={title}
      />
    );
  }

  if ((!data || !data.length) && emptyStateMessage) {
    return (
      <EmptyStateView
        onRetry={emptyStateAction}
        message={emptyStateMessage}
        icon={emptyStateIconName}
      />
    );
  }

  return (
    <ListView
      data={data}
      renderRow={customRenderRow || renderRow}
      {...otherProps}
    />
  );
}

CompactListLayout.propTypes = {
  data: PropTypes.array.isRequired,
  titleResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  emptyStateAction: PropTypes.func,
  emptyStateIconName: PropTypes.string,
  emptyStateMessage: PropTypes.string,
  loading: PropTypes.bool,
  renderActions: PropTypes.func,
  renderRow: PropTypes.func,
  /* eslint-disable react/sort-prop-types */
  imageUrlResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  // If subtitleResolver is provided, left and right will not be utilized
  subtitleResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  subtitleLeftResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /* eslint-enable react/sort-prop-types */
  // If subtitleLeftResolver is not provided, right will not be utilized
  subtitleRightResolver: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  onPress: PropTypes.func,
};

CompactListLayout.defaultProps = {
  emptyStateAction: undefined,
  emptyStateIconName: undefined,
  emptyStateMessage: undefined,
  loading: false,
  renderActions: undefined,
  renderRow: undefined,
  imageUrlResolver: undefined,
  subtitleResolver: undefined,
  subtitleLeftResolver: undefined,
  subtitleRightResolver: undefined,
  onPress: undefined,
};

export default connectStyle(ext('CompactListLayout'))(CompactListLayout);
