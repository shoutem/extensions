import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isBusy, isInitialized, next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Caption, Divider, Tile, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { fetchPlaceDeals, getPlaceDeals } from '../../redux';
import PlaceDealsList from './PlaceDealsList';

const PlaceDealsSection = ({ placeId }) => {
  const dispatch = useDispatch();
  const deals = useSelector(state => getPlaceDeals(state, placeId));

  const loading = isBusy(deals) || !isInitialized(deals);

  const handleLoadMore = useCallback(() => {
    dispatch(next(deals));
  }, [deals, dispatch]);

  useEffect(() => {
    dispatch(fetchPlaceDeals(placeId));
  }, [dispatch, placeId]);

  if (deals.length === 0) {
    return null;
  }

  return (
    <Tile styleName="md-gutter-bottom">
      <Divider styleName="section-header md-gutter-bottom">
        <View styleName="flexible horizontal space-between v-center md-gutter-horizontal sm-gutter-bottom">
          <Caption>{I18n.t(ext('dealsSectionTitle')).toUpperCase()}</Caption>
        </View>
      </Divider>
      <PlaceDealsList
        deals={deals}
        loading={loading}
        onLoadMore={handleLoadMore}
      />
    </Tile>
  );
};

PlaceDealsSection.propTypes = {
  placeId: PropTypes.string.isRequired,
};

export default connectStyle(ext('PlaceDealsSection'))(PlaceDealsSection);
