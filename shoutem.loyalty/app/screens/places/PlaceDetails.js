import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { find, getCollection, isBusy } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  ImageBackground,
  ListView,
  Screen,
  ScrollView,
  SimpleHtml,
  Subtitle,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { InlineMap } from 'shoutem.application';
import { UNIVERSAL_LINK_TYPE, UniversalLinkButton } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  HeaderTextButton,
  navigateTo,
  openInModal,
} from 'shoutem.navigation';
import PlaceLoyaltyPointsView from '../../components/PlaceLoyaltyPointsView';
import PlaceRewardListView from '../../components/PlaceRewardListView';
import {
  placeShape,
  rewardShape,
  transactionShape,
} from '../../components/shapes';
import { ext } from '../../const';
import { fetchPlaceRewards, getCardStateForPlace } from '../../redux';
import { refreshTransactions } from '../../services';

export class PlaceDetails extends PureComponent {
  static propTypes = {
    // The place
    place: placeShape.isRequired,
    // Rewards for this place
    rewards: PropTypes.arrayOf(rewardShape),
    /* Actions */
    find: PropTypes.func,
    // Opens the assign points flow in a modal dialog
    fetchPlaceRewards: PropTypes.func,
    refreshTransactions: PropTypes.func,
    // Transactions for this place
    transactions: PropTypes.arrayOf(transactionShape),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      animateLeadImage: false,
    };
  }

  componentDidMount() {
    const {
      fetchPlaceRewards,
      place,
      refreshTransactions,
      navigation,
    } = this.props;

    this.setState({ animateLeadImage: true });

    fetchPlaceRewards(place.id);
    refreshTransactions();
    navigation.setOptions({ ...this.getNavBarProps() });
  }

  getNavBarProps() {
    const {
      place: { image, name = '' },
    } = this.props;
    const navBarStyle = image
      ? ['clear', 'solidify']
      : ['noBorder', 'solidify'];

    return {
      ...composeNavigationStyles([navBarStyle]),
      title: name,
      headerRight: this.renderRightNavBarComponent,
    };
  }

  navigateToPointsHistoryScreen() {
    const { place } = this.props;

    navigateTo(ext('PointsHistoryScreen'), {
      place,
    });
  }

  navigateToRewardDetailsScreen(reward) {
    const { place } = this.props;
    const { placeRewardsParentCategoryId: parentCategoryId } = place;

    navigateTo(ext('RewardDetailsScreen'), {
      reward: { ...reward, parentCategoryId, location: place.id },
      place,
    });
  }

  collectPoints() {
    const { place } = this.props;

    openInModal(ext('VerificationScreen'), {
      place,
    });
  }

  openMapScreen() {
    const { place } = this.props;

    navigateTo(ext('SinglePlaceMap'), {
      place,
      title: place.name,
    });
  }

  renderRightNavBarComponent(props) {
    const { transactions } = this.props;

    const hasTransactions = !!_.size(transactions);

    if (!hasTransactions) {
      return null;
    }

    return (
      <HeaderTextButton
        {...props}
        onPress={this.navigateToPointsHistoryScreen}
        title={I18n.t(ext('navigationHistoryButton'))}
      />
    );
  }

  renderLeadImage() {
    const { animateLeadImage } = this.state;
    const {
      place: { image, location = {}, name },
    } = this.props;
    const { formattedAddress = '' } = location;

    return (
      <ImageBackground
        styleName="large"
        source={image && { uri: image.url }}
        animationName={animateLeadImage ? 'hero' : undefined}
      >
        <Tile>
          <Title>{name.toUpperCase()}</Title>
          <Caption styleName="sm-gutter-top">{formattedAddress}</Caption>
        </Tile>
      </ImageBackground>
    );
  }

  renderPoints() {
    const { place } = this.props;

    return (
      <PlaceLoyaltyPointsView
        onCollectPointsPress={this.collectPoints}
        place={place}
      />
    );
  }

  renderRewardRow(reward) {
    const { place } = this.props;

    return (
      <PlaceRewardListView
        key={reward.id}
        onPress={this.navigateToRewardDetailsScreen}
        place={place}
        reward={reward}
      />
    );
  }

  renderRewards() {
    const { rewards } = this.props;

    const data = isBusy(rewards) ? [] : [...rewards];

    return (
      <View styleName="solid">
        <Divider styleName="section-header">
          <Caption>{I18n.t(ext('storeRewardsListTitle'))}</Caption>
        </Divider>
        {!isBusy(rewards) && _.isEmpty(rewards) ? (
          <Caption styleName="h-center md-gutter-top xl-gutter-horizontal">
            {I18n.t(ext('noRewardsForStore'))}
          </Caption>
        ) : (
          <ListView
            data={data}
            loading={isBusy(rewards)}
            renderRow={this.renderRewardRow}
          />
        )}
      </View>
    );
  }

  renderInlineMap() {
    const {
      place: { location = {}, name },
    } = this.props;
    const { latitude, longitude, formattedAddress } = location;

    if (!latitude || !longitude) {
      return null;
    }

    const marker = {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };
    const region = {
      ...marker,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return (
      <View styleName="solid">
        <TouchableOpacity onPress={this.openMapScreen}>
          <InlineMap
            initialRegion={region}
            markers={[marker]}
            selectedMarker={marker}
            styleName="medium-tall"
          >
            <View styleName="fill-parent overlay vertical v-center h-center">
              <Subtitle numberOfLines={1}>{name}</Subtitle>
              <Caption numberOfLines={2}>{formattedAddress}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderDescription() {
    const {
      place: { description },
    } = this.props;

    if (description) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>{I18n.t(ext('storeDescriptionTitle'))}</Caption>
          </Divider>
          <View styleName="md-gutter">
            <SimpleHtml body={description} />
          </View>
          <Divider styleName="line" />
        </Tile>
      );
    }

    return null;
  }

  renderOpeningHours() {
    const {
      place: { openingHours },
    } = this.props;

    if (openingHours) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>{I18n.t(ext('openHours'))}</Caption>
          </Divider>
          <Text styleName="md-gutter">{openingHours}</Text>
        </Tile>
      );
    }

    return null;
  }

  render() {
    const { place } = this.props;

    return (
      <Screen styleName="paper">
        <ScrollView>
          {this.renderLeadImage()}
          {this.renderPoints()}
          {this.renderRewards()}
          {this.renderOpeningHours()}
          {this.renderInlineMap()}
          {this.renderDescription(place)}
          <UniversalLinkButton
            type={UNIVERSAL_LINK_TYPE.LOCATION}
            location={place.location}
            title={I18n.t('shoutem.cms.directionsButton')}
            subtitle={place.location?.formattedAddress}
          />
          <UniversalLinkButton
            link={place.url}
            title={I18n.t('shoutem.cms.websiteButton')}
            subtitle={place.url}
          />
          <UniversalLinkButton
            type={UNIVERSAL_LINK_TYPE.EMAIL}
            link={place.mail}
            title={I18n.t('shoutem.cms.emailButton')}
            subtitle={place.mail}
          />
          <UniversalLinkButton
            type={UNIVERSAL_LINK_TYPE.PHONE}
            link={place.phone}
            title={I18n.t('shoutem.cms.phoneButton')}
            subtitle={place.phone}
          />
          <UniversalLinkButton
            link={place.twitter}
            title={I18n.t('shoutem.cms.twitterButton')}
            subtitle={place.twitter}
            iconName="tweet"
          />
          <UniversalLinkButton
            link={place.instagram}
            title={I18n.t('shoutem.cms.instagramButton')}
            subtitle={place.instagram}
            iconName="instagram"
          />
          <UniversalLinkButton
            link={place.facebook}
            title={I18n.t('shoutem.cms.facebookButton')}
            subtitle={place.facebook}
            iconName="facebook"
          />
          <UniversalLinkButton
            link={place.tiktok}
            title={I18n.t('shoutem.cms.tiktokButton')}
            subtitle={place.tiktok}
            iconName="tiktok"
          />
          <UniversalLinkButton
            link={place.linkedin}
            title={I18n.t('shoutem.cms.linkedInButton')}
            subtitle={place.linkedin}
            iconName="linkedin"
          />
        </ScrollView>
      </Screen>
    );
  }
}

const getTransactionsForPlace = (transactions, place) =>
  _.filter(transactions, transaction => {
    const { transactionData } = transaction;

    return place.id === transactionData.location;
  });

export const mapStateToProps = (state, ownProps) => {
  const { allPlaceRewards, allTransactions } = state[ext()];

  const { place } = getRouteParams(ownProps);

  const cardState = getCardStateForPlace(state, place.id);
  const points = cardState ? cardState.points : 0;

  const transactions = getCollection(allTransactions, state);

  return {
    place: { ...place, points },
    rewards: getCollection(allPlaceRewards, state),
    transactions: getTransactionsForPlace(transactions, place),
  };
};

export const mapDispatchToProps = {
  fetchPlaceRewards,
  find,
  refreshTransactions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PlaceDetails'))(PlaceDetails));
