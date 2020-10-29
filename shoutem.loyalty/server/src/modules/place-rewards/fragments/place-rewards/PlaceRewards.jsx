import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { shouldRefresh, isBusy } from '@shoutem/redux-io';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { getShortcutState } from '@shoutem/redux-api-sdk';
import { loadLoyaltyPlaces, getLoyaltyPlaces } from 'src/modules/program';
import { CmsTable, CmsSelect } from 'src/modules/cms';
import {
  getShortcutRewards,
  loadShortcutRewards,
  deleteReward,
  createRewardsCategory,
  openRewardsCmsEditor,
} from '../../redux';
import LOCALIZATION from './localization';

export class PlaceRewards extends Component {
  constructor(props, context) {
    super(props, context);
    autoBindReact(this);

    this.state = {
      currentPlaceId: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      rewards: nextRewards,
      places: nextPlaces,
      placesCategoryId: nextPlacesCategoryId,
      rewardsCategoryId: nextRewardsCategoryId,
    } = nextProps;
    const { placesCategoryId, rewardsCategoryId } = props;
    const { currentPlaceId } = this.state;

    if (
      placesCategoryId !== nextPlacesCategoryId ||
      (nextPlacesCategoryId && shouldRefresh(nextPlaces))
    ) {
      this.props.loadPlaces(nextPlacesCategoryId);
    }

    if (
      rewardsCategoryId !== nextRewardsCategoryId ||
      (nextRewardsCategoryId && shouldRefresh(nextRewards))
    ) {
      this.props.loadRewards(nextRewardsCategoryId, currentPlaceId);
    }
  }

  handlePlaceChange(placeId) {
    const { rewardsCategoryId } = this.props;
    if (!rewardsCategoryId) {
      return;
    }

    this.props
      .loadRewards(rewardsCategoryId, placeId)
      .then(() => this.setState({ currentPlaceId: placeId }));
  }

  handleAddReward() {
    const {
      categoryNameTemplate,
      placesCategoryId,
      rewardsCategoryId,
    } = this.props;

    if (!placesCategoryId) {
      return;
    }

    if (rewardsCategoryId) {
      this.props.openCmsEditor(rewardsCategoryId);
      return;
    }

    this.props
      .createCategory(categoryNameTemplate)
      .then(newCategoryId => this.props.openCmsEditor(newCategoryId));
  }

  render() {
    const { rewards, places, rewardsDescriptor, placesDescriptor } = this.props;

    const rewardsEnabled = !_.isEmpty(places);
    const rewardsTableEmptyText = rewardsEnabled
      ? i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_MESSAGE)
      : i18next.t(LOCALIZATION.PLEASE_CREATE_STORES_MESSAGE);
    const addRewardButtonText = _.isEmpty(rewards)
      ? i18next.t(LOCALIZATION.BUTTON_ADD_ITEMS_TITLE)
      : i18next.t(LOCALIZATION.BUTTON_EDIT_ITEMS_TITLE);

    return (
      <div className="places-rewards-page">
        <CmsSelect
          allItemsLabel={i18next.t(LOCALIZATION.ALL_STORES_TITLE)}
          descriptor={placesDescriptor}
          disabled={isBusy(rewards)}
          dropdownLabel={i18next.t(LOCALIZATION.SELECT_STORE_TITLE)}
          onFilterChange={this.handlePlaceChange}
          resources={places}
        />
        <CmsTable
          addItemBtnText={addRewardButtonText}
          addItemEnabled={rewardsEnabled}
          descriptor={rewardsDescriptor}
          emptyStateText={rewardsTableEmptyText}
          onAddItemBtnClick={this.handleAddReward}
          onDeleteItem={this.props.deleteReward}
          resources={rewards}
          title={i18next.t(LOCALIZATION.TABLE_TITLE)}
        />
      </div>
    );
  }
}

PlaceRewards.propTypes = {
  appId: PropTypes.string,
  rewards: PropTypes.array,
  places: PropTypes.array,
  categoryNameTemplate: PropTypes.string,
  rewardsCategoryId: PropTypes.string,
  rewardsDescriptor: PropTypes.object,
  placesCategoryId: PropTypes.string,
  placesDescriptor: PropTypes.object,
  loadPlaces: PropTypes.func,
  loadRewards: PropTypes.func,
  deleteReward: PropTypes.func,
  createCategory: PropTypes.func,
  openCmsEditor: PropTypes.func,
};

PlaceRewards.contextTypes = {
  page: PropTypes.object,
};

PlaceRewards.defaultProps = {
  categoryNameTemplate: i18next.t(LOCALIZATION.CATEGORY_NAME_TEMPLATE),
};

function mapStateToProps(state, ownProps) {
  const { extensionName, shortcutId } = ownProps;
  const shortcutState = getShortcutState(state, extensionName, shortcutId);

  return {
    rewards: getShortcutRewards(shortcutState, state),
    places: getLoyaltyPlaces(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, extensionName, shortcutId, shortcut } = ownProps;
  const scope = { extensionName, shortcutId };

  return {
    loadPlaces: categoryId =>
      dispatch(loadLoyaltyPlaces(appId, categoryId, scope)),
    loadRewards: (categoryId, placeId) =>
      dispatch(loadShortcutRewards(appId, categoryId, placeId, scope)),
    deleteReward: resourceId =>
      dispatch(deleteReward(appId, resourceId, scope)),
    createCategory: categoryName =>
      dispatch(createRewardsCategory(appId, categoryName, shortcut, scope)),
    openCmsEditor: categoryId =>
      dispatch(openRewardsCmsEditor(appId, categoryId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceRewards);
