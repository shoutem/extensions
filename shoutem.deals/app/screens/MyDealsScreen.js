import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import MyDealsList from '../components/MyDeals/MyDealsList';
import FavoriteDealsList from '../components/MyDeals/FavoriteDealsList';
import { ext, TRANSLATIONS } from '../const';

const MY_DEALS_TAB = 'myDealsTab';
const FAVORITE_DEALS_TAB = 'favoriteDealsTab';

function renderTab(options) {
  const { isActive = false } = options;

  return (
    <TouchableOpacity
      onPress={options.onPress}
      styleName="flexible stretch h-center"
    >
      <View styleName="md-gutter stretch h-center">
        <Text styleName={`${isActive ? '' : 'muted'} h-center`}>
          {options.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export class MyDealsScreen extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      activeTab: FAVORITE_DEALS_TAB,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: I18n.t(TRANSLATIONS.MY_DEALS_TITLE) });
  }

  handleActivateTab(activeTab) {
    this.setState({ activeTab });
  }

  handleActivateMyDealsTab() {
    this.handleActivateTab(MY_DEALS_TAB);
  }

  handleActivateFavoritesTab() {
    this.handleActivateTab(FAVORITE_DEALS_TAB);
  }

  handleOpenDetails(deal) {
    const { onOpenDealDetails } = getRouteParams(this.props);
    onOpenDealDetails(deal);
  }

  render() {
    const { catalogId } = getRouteParams(this.props);
    const { activeTab } = this.state;
    // Tabs activation status
    const myDealsTabActive = activeTab === MY_DEALS_TAB;
    const favoriteDealsTabActive = activeTab === FAVORITE_DEALS_TAB;

    return (
      <Screen>
        <View key="my-deals-tabs" styleName="flexible">
          <View key="my-deals-tabs-controls" styleName="solid horizontal">
            {renderTab({
              isActive: favoriteDealsTabActive,
              onPress: this.handleActivateFavoritesTab,
              text: I18n.t(TRANSLATIONS.FAVORITE_DEALS_TAB_TEXT),
            })}

            {renderTab({
              isActive: myDealsTabActive,
              onPress: this.handleActivateMyDealsTab,
              text: I18n.t(TRANSLATIONS.MY_DEALS_TAB_TEXT),
            })}
          </View>

          {activeTab === FAVORITE_DEALS_TAB && (
            <FavoriteDealsList
              catalogId={catalogId}
              onOpenDealDetails={this.handleOpenDetails}
            />
          )}

          {activeTab === MY_DEALS_TAB && (
            <MyDealsList
              catalogId={catalogId}
              onOpenDealDetails={this.handleOpenDetails}
            />
          )}
        </View>
      </Screen>
    );
  }
}

export default connectStyle(ext('MyDealsScreen'), {})(MyDealsScreen);
