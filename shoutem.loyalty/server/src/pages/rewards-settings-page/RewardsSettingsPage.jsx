import React, { Component, PropTypes } from 'react';
import { isInitialized } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import _ from 'lodash';
import { initializeApiEndpoints } from 'src/services';
import { PlaceRewards } from 'src/modules/place-rewards';
import './style.scss';

const PLACES_DESCRIPTOR = {
  categoryIdSelector: 'parentCategory.id',
  filterKeyProp: 'id',
  filterLabelProp: 'name',
};

const REWARDS_DESCRIPTOR = {
  categoryIdSelector: 'cmsCategory.id',
  columns: [
    {
      header: 'Title',
      value: 'title',
      required: true,
    },
    {
      header: 'Points',
      value: 'pointsRequired',
    },
    {
      header: 'Store',
      value: 'place.name',
    },
  ],
};

export default class RewardsPage extends Component {
  constructor(props) {
    super(props);

    const { ownExtension: { settings } } = props;
    initializeApiEndpoints(settings);

    this.state = {
      rewardsCategoryId: null,
      placesCategoryId: null,
    };
  }

  render() {
    const {
      appId,
      shortcut,
      shortcutId,
      ownExtensionName,
    } = this.props;

    const settings = _.get(shortcut, 'settings');
    const rewardsCategoryId = _.get(settings, REWARDS_DESCRIPTOR.categoryIdSelector);
    const placesCategoryId = _.get(settings, PLACES_DESCRIPTOR.categoryIdSelector);

    return (
      <LoaderContainer
        className="rewards-settings-page"
        isLoading={!isInitialized(shortcut)}
      >
        <PlaceRewards
          appId={appId}
          extensionName={ownExtensionName}
          newCategoryName="Rewards"
          placesCategoryId={placesCategoryId}
          placesDescriptor={PLACES_DESCRIPTOR}
          rewardsCategoryId={rewardsCategoryId}
          rewardsDescriptor={REWARDS_DESCRIPTOR}
          shortcut={shortcut}
          shortcutId={shortcutId}
        />
      </LoaderContainer>
    );
  }
}

RewardsPage.propTypes = {
  appId: PropTypes.string,
  shortcut: PropTypes.object,
  ownExtension: PropTypes.object,
  fetchShortcut: PropTypes.func,
  fetchExtension: PropTypes.func,
  updateRewardsCategoryId: PropTypes.func,
  shortcutId: PropTypes.string,
  ownExtensionName: PropTypes.string,
};
