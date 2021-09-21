import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LayoutAnimation } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { MapView } from 'shoutem.application';
import { getMarkersAndRegionFromDeals } from '../services';
import { ext } from '../const';
import DealListView from './DealListView';

export class DealsMap extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
    onOpenDealDetails: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...getMarkersAndRegionFromDeals(this.props.data),
      selectedDeal: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        ...getMarkersAndRegionFromDeals(data),
      });
    }
  }

  handleMapPress(event) {
    const { selectedDeal } = this.state;

    if (event.nativeEvent.action !== 'marker-press' && selectedDeal) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ selectedDeal: null });
    }
  }

  handleMarkerPressed(marker) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ selectedDeal: _.get(marker, 'deal', null) });
  }

  handleOpenDealDetails() {
    const { selectedDeal } = this.state;
    const { onOpenDealDetails } = this.props;

    onOpenDealDetails(selectedDeal);
  }

  renderSelectedDeal() {
    const { selectedDeal } = this.state;

    if (!selectedDeal) {
      return null;
    }

    return (
      <DealListView
        deal={selectedDeal}
        key={selectedDeal.id}
        onPress={this.handleOpenDealDetails}
      />
    );
  }

  render() {
    const { markers, region } = this.state;

    return (
      <View styleName="flexible">
        <MapView
          markers={markers}
          initialRegion={region}
          onMarkerPressed={this.handleMarkerPressed}
          onPress={this.handleMapPress}
        />
        {this.renderSelectedDeal()}
      </View>
    );
  }
}

export default connectStyle(ext('DealsMap', {}))(DealsMap);
