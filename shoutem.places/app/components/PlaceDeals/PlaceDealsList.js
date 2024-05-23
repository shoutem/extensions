import React, { useCallback } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ListView } from '@shoutem/ui';
import { openInModal } from 'shoutem.navigation';
import { DEALS_DETAILS_SCREEN, ext } from '../../const';
import DealListItem from './DealListItem';

const getNextDeal = (deal, deals) => {
  const currentDealIndex = _.findIndex(deals, { id: deal.id });

  return deals[currentDealIndex + 1];
};

const getPreviousDeal = (deal, deals) => {
  const currentDealIndex = _.findIndex(deals, { id: deal.id });
  return deals[currentDealIndex - 1];
};

const PlaceDealsList = ({ deals, loading, onLoadMore, style }) => {
  const handleOpenDealDetails = useCallback(
    deal =>
      openInModal(DEALS_DETAILS_SCREEN, {
        deal,
        nextDeal: getNextDeal(deal, deals),
        previousDeal: getPreviousDeal(deal, deals),
        onOpenDealDetails: handleOpenDealDetails,
        hasFavoriteButton: true,
        catalogId: _.get(deal, 'catalog'),
      }),
    [deals],
  );

  return (
    <ListView
      horizontal
      loading={loading}
      bounces={false}
      showsHorizontalScrollIndicator={false}
      data={deals}
      initialListSize={10}
      renderRow={deal => (
        <DealListItem deal={deal} onDealPress={handleOpenDealDetails} />
      )}
      onLoadMore={onLoadMore}
      style={style.list}
    />
  );
};

PlaceDealsList.propTypes = {
  deals: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default connectStyle(ext('PlaceDealsList'))(PlaceDealsList);
