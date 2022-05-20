import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, ListView, View } from '@shoutem/ui';
import { ext } from '../const';
import { mapDataFor122Layout } from './services';

export function Grid122Layout({
  data,
  onPress,
  renderActions,
  renderRow: customRenderRow,
  emptyStateAction,
  emptyStateIconName,
  emptyStateMessage,
  hasFeaturedItem,
  imageUrlResolver,
  style,
  subtitleResolver,
  titleResolver,
  ...otherProps
}) {
  function renderRow(rowItems) {
    return (
      <View styleName="flexible horizontal space-between">{rowItems}</View>
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

  const mappedData = mapDataFor122Layout(
    data,
    onPress,
    hasFeaturedItem,
    {
      imageUrlResolver,
      subtitleResolver,
      titleResolver,
    },
    renderActions,
  );

  return (
    <ListView
      contentContainerStyle={style.list}
      data={mappedData}
      renderRow={customRenderRow || renderRow}
      {...otherProps}
    />
  );
}

Grid122Layout.propTypes = {
  data: PropTypes.array.isRequired,
  titleResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  emptyStateAction: PropTypes.func,
  emptyStateIconName: PropTypes.string,
  emptyStateMessage: PropTypes.string,
  hasFeaturedItem: PropTypes.bool,
  loading: PropTypes.bool,
  renderActions: PropTypes.func,
  renderRow: PropTypes.func,
  style: PropTypes.object,
  // eslint-disable-next-line react/sort-prop-types
  imageUrlResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  subtitleResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onPress: PropTypes.func,
};

Grid122Layout.defaultProps = {
  emptyStateAction: undefined,
  emptyStateIconName: undefined,
  emptyStateMessage: undefined,
  hasFeaturedItem: false,
  loading: false,
  renderActions: undefined,
  renderRow: undefined,
  style: {},
  imageUrlResolver: undefined,
  subtitleResolver: undefined,
  onPress: undefined,
};

export default connectStyle(ext('Grid122Layout'))(Grid122Layout);
