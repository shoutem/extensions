import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ListView } from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import { resolveProp } from '../services';
import { LargeListItem } from './components';

export function LargeListLayout({
  data,
  hasOverlay,
  onPress,
  renderActions,
  renderOverlayChild,
  renderRow: customRenderRow,
  overlayStyleName,
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
      <LargeListItem
        hasOverlay={hasOverlay}
        imageSource={imageSource}
        item={item}
        onPress={onPress}
        overlayStyleName={overlayStyleName}
        renderActions={renderActions}
        renderOverlayChild={renderOverlayChild}
        subtitle={subtitle}
        subtitleLeft={subtitleLeft}
        subtitleRight={subtitleRight}
        title={title}
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

LargeListLayout.propTypes = {
  data: PropTypes.array.isRequired,
  titleResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  emptyStateAction: PropTypes.func,
  emptyStateIconName: PropTypes.string,
  emptyStateMessage: PropTypes.string,
  hasOverlay: PropTypes.bool,
  loading: PropTypes.bool,
  overlayStyleName: PropTypes.string,
  renderActions: PropTypes.func,
  renderOverlayChild: PropTypes.func,
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

LargeListLayout.defaultProps = {
  emptyStateAction: undefined,
  emptyStateIconName: undefined,
  emptyStateMessage: undefined,
  hasOverlay: false,
  loading: false,
  overlayStyleName: '',
  renderActions: undefined,
  renderOverlayChild: undefined,
  renderRow: undefined,
  imageUrlResolver: undefined,
  subtitleLeftResolver: undefined,
  subtitleResolver: undefined,
  subtitleRightResolver: undefined,
  onPress: undefined,
};

export default connectStyle(ext('LargeListLayout'))(LargeListLayout);
