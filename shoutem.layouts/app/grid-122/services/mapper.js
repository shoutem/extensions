import React from 'react';
import _ from 'lodash';
import { resolveProp } from '../../services';
import FeaturedGridRowView from '../components/FeaturedGridRowView';
import FullGridRowItemView from '../components/FullGridRowItemView';
import HalfGridRowItemView from '../components/HalfGridRowItemView';

// Remap for 1-2-2 layout
export function mapDataFor122Layout(
  data,
  onPress,
  hasFeaturedItem,
  resolvers,
  renderActions,
) {
  return _.reduce(
    data,
    (result = [], item, index) => {
      const title = resolveProp(item, resolvers.titleResolver, '');
      const subtitle = resolveProp(item, resolvers.subtitleResolver, '');
      const imageUrl = resolveProp(item, resolvers.imageUrlResolver, null);

      if (index === 0 && hasFeaturedItem) {
        result.push([
          <FeaturedGridRowView
            id={item.id}
            imageUrl={imageUrl}
            key={item.id || index}
            subtitle={subtitle}
            title={title}
            onPress={onPress}
            renderActions={renderActions}
          />,
        ]);

        return result;
      }

      if (index % 5 === 0 || (index === 0 && !hasFeaturedItem)) {
        result.push([
          <FullGridRowItemView
            id={item.id}
            imageUrl={imageUrl}
            key={item.id || index}
            subtitle={subtitle}
            title={title}
            onPress={onPress}
            renderActions={renderActions}
          />,
        ]);

        return result;
      }

      if (index % 5 === 2 || index % 5 === 4) {
        result[result.length - 1].push(
          <HalfGridRowItemView
            id={item.id}
            imageUrl={imageUrl}
            key={item.id || index}
            subtitle={subtitle}
            title={title}
            onPress={onPress}
            renderActions={renderActions}
          />,
        );
      }

      if (index % 5 === 1 || index % 5 === 3) {
        result.push([
          <HalfGridRowItemView
            id={item.id}
            imageUrl={imageUrl}
            key={item.id || index}
            subtitle={subtitle}
            title={title}
            onPress={onPress}
            renderActions={renderActions}
          />,
        ]);
      }

      return result;
    },
    [],
  );
}
