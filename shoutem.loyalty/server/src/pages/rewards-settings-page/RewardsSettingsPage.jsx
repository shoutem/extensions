import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { isInitialized } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import _ from 'lodash';
import { initializeApiEndpoints } from 'src/services';
import { PlaceRewards } from 'src/modules/place-rewards';
import LOCALIZATION from './localization';
import './style.scss';

const PLACES_DESCRIPTOR = {
  categoryIdSelector: 'parentCategory.id',
  filterKeyProp: 'id',
  filterLabelProp: 'name',
};

function resolveRewardsDescriptor() {
  return {
    categoryIdSelector: 'cmsCategory.id',
    columns: [
      {
        header: i18next.t(LOCALIZATION.REWARDS_DESCRIPTION_TITLE),
        value: 'title',
        required: true,
      },
      {
        header: i18next.t(LOCALIZATION.REWARDS_DESCRIPTION_POINTS),
        value: 'pointsRequired',
      },
      {
        header: i18next.t(LOCALIZATION.REWARDS_DESCRIPTION_STORE),
        value: 'place.name',
      },
    ],
  };
}

export default class RewardsPage extends Component {
  constructor(props) {
    super(props);

    const {
      ownExtension: { settings },
    } = props;
    initializeApiEndpoints(settings);

    this.state = {
      rewardsCategoryId: null,
      placesCategoryId: null,
    };
  }

  render() {
    const { appId, shortcut, shortcutId, ownExtensionName } = this.props;

    const rewardsDescriptor = resolveRewardsDescriptor();
    const settings = _.get(shortcut, 'settings');

    const rewardsCategoryId = _.get(
      settings,
      rewardsDescriptor.categoryIdSelector,
    );
    const placesCategoryId = _.get(
      settings,
      PLACES_DESCRIPTOR.categoryIdSelector,
    );

    return (
      <LoaderContainer
        className="rewards-settings-page"
        isLoading={!isInitialized(shortcut)}
      >
        <PlaceRewards
          appId={appId}
          extensionName={ownExtensionName}
          newCategoryName={i18next.t(LOCALIZATION.NEW_CATEGORY_NAME)}
          placesCategoryId={placesCategoryId}
          placesDescriptor={PLACES_DESCRIPTOR}
          rewardsCategoryId={rewardsCategoryId}
          rewardsDescriptor={rewardsDescriptor}
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
