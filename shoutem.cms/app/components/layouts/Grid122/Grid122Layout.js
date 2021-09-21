import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { GridRow, ListView } from '@shoutem/ui';
import { ext } from '../../../const';
import { FullGridRowItemView, HalfGridRowItemView } from './components';

let row = [];

export function Grid122Layout({
  data,
  descriptionPropResolver,
  getSectionId,
  imageUrlPropResolver,
  initialListSize,
  loading,
  onLoadMore,
  onPress,
  onRefresh,
  renderFavorite,
  renderRow: customRenderRow,
  titlePropResolver,
  ...otherProps
}) {
  function renderRow(item, index) {
    const title = _.get(item, `${titlePropResolver}`, '');
    const description = _.isFunction(descriptionPropResolver)
      ? descriptionPropResolver(item)
      : _.get(item, `${descriptionPropResolver}`, '');

    const imageUrl = _.isFunction(imageUrlPropResolver)
      ? imageUrlPropResolver(item)
      : _.get(item, `${imageUrlPropResolver}`, null);

    if (index === 0 || index % 5 === 0) {
      return (
        <FullGridRowItemView
          key={item.id}
          item={item}
          title={title}
          description={description}
          imageUrl={imageUrl}
          onPress={() => onPress(item)}
          renderFavorite={renderFavorite}
        />
      );
    }

    if (row.length === 0 || row.length === 1) {
      row.push(
        <HalfGridRowItemView
          key={item.id}
          item={item}
          title={title}
          description={description}
          imageUrl={imageUrl}
          onPress={() => onPress(item)}
          renderFavorite={renderFavorite}
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

  return (
    <ListView
      data={data}
      getSectionId={getSectionId}
      initialListSize={initialListSize}
      loading={loading}
      onLoadMore={onLoadMore}
      onRefresh={onRefresh}
      renderRow={customRenderRow || renderRow}
      {...otherProps}
    />
  );
}

Grid122Layout.propTypes = {
  data: PropTypes.array,
  titlePropResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  descriptionPropResolver: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  imageUrlPropResolver: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  getSectionId: PropTypes.func,
  initialListSize: PropTypes.number,
  loading: PropTypes.bool,
  onLoadMore: PropTypes.func,
  onPress: PropTypes.func,
  onRefresh: PropTypes.func,
  renderFavorite: PropTypes.func,
  renderRow: PropTypes.func,
};

Grid122Layout.defaultProps = {
  data: [],
  getSectionId: _.noop,
  initialListSize: 1,
  loading: false,
  onLoadMore: _.noop,
  onPress: _.noop,
  onRefresh: _.noop,
  renderFavorite: _.noop,
};

const StyledGrid122Layout = connectStyle(ext('Grid122Layout'))(Grid122Layout);
export default React.memo(StyledGrid122Layout);
