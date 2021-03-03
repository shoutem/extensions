import React from 'react';
import CompactListPhotoView from './CompactListPhotoView';
import LargeListPhotoView from './LargeListPhotoView';
import MediumListPhotoView from './MediumListPhotoView';
import TileListPhotoView from './TileListPhotoView';

const layoutItems = {
  'compact-list': CompactListPhotoView,
  'medium-list': MediumListPhotoView,
  'large-list': LargeListPhotoView,
  'tile-list': TileListPhotoView,
};

/**
 * Creates a specific list item for a given layout with data about a photo.
 *
 * @param {string} layoutName A name of the layout
 * @param {*} photo Object that contains data about a photo
 * @param {function} onPress A function that is called after a click on the item
 * @returns List item component
 */
export const createListItem = (layoutName, photo, onPress) => {
  if (!layoutItems[layoutName]) {
    console.error(`List item not registered for layout ${layoutName}`);
    return null;
  }

  const ListItem = layoutItems[layoutName];
  return <ListItem photo={photo} onPress={onPress} />;
};
