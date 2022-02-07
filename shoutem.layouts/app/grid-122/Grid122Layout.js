import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, GridRow, ListView } from '@shoutem/ui';
import { ext } from '../const';
import { resolveProp } from '../services';
import { FullGridRowItemView, HalfGridRowItemView } from './components';

let row = [];

export function Grid122Layout({
  data,
  onPress,
  renderActions,
  renderRow: customRenderRow,
  emptyStateAction,
  emptyStateIconName,
  emptyStateMessage,
  imageUrlResolver,
  subtitleResolver,
  titleResolver,
  ...otherProps
}) {
  function renderRow(item, index) {
    const title = resolveProp(item, titleResolver, '');
    const subtitle = resolveProp(item, subtitleResolver, '');
    const imageUrl = resolveProp(item, imageUrlResolver, null);

    if (index === 0 || index % 5 === 0) {
      return (
        <FullGridRowItemView
          key={item.id}
          item={item}
          title={title}
          subtitle={subtitle}
          imageUrl={imageUrl}
          onPress={onPress}
          renderActions={renderActions}
        />
      );
    }

    if (row.length === 0 || row.length === 1) {
      row.push(
        <HalfGridRowItemView
          key={item.id}
          item={item}
          title={title}
          subtitle={subtitle}
          imageUrl={imageUrl}
          onPress={onPress}
          renderActions={renderActions}
        />,
      );
    }

    if (row.length === 2 || index === data.length - 1) {
      const itemsRow = row;
      row = [];

      return (
        <GridRow styleName="no-padding" columns={2}>
          {itemsRow}
        </GridRow>
      );
    }

    return null;
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

Grid122Layout.propTypes = {
  data: PropTypes.array.isRequired,
  titleResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  emptyStateAction: PropTypes.func,
  emptyStateIconName: PropTypes.string,
  emptyStateMessage: PropTypes.string,
  loading: PropTypes.bool,
  renderActions: PropTypes.func,
  renderRow: PropTypes.func,
  // eslint-disable-next-line react/sort-prop-types
  imageUrlResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  subtitleResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onPress: PropTypes.func,
};

Grid122Layout.defaultProps = {
  emptyStateAction: undefined,
  emptyStateIconName: undefined,
  emptyStateMessage: undefined,
  loading: false,
  renderActions: undefined,
  renderRow: undefined,
  imageUrlResolver: undefined,
  subtitleResolver: undefined,
  onPress: undefined,
};

export default connectStyle(ext('Grid122Layout'))(Grid122Layout);
