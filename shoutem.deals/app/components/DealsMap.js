import _ from 'lodash';

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  LayoutAnimation,
} from 'react-native';

import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';

import {
  View,
} from '@shoutem/ui';
import { MapView } from '@shoutem/ui-addons';

import { ext } from '../const';

import { getMarkersAndRegionFromDeals } from '../services';
import DealListView from './DealListView';

export class DealsMap extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
    onOpenDealDetails: PropTypes.func.isRequired,
    navigateTo: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleMapPress = this.handleMapPress.bind(this);
    this.handleMarkerPressed = this.handleMarkerPressed.bind(this);
    this.handleOpenDealDetails = this.handleOpenDealDetails.bind(this);

    this.state = {
      ...getMarkersAndRegionFromDeals(this.props.data),
      selectedDeal: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        ...getMarkersAndRegionFromDeals(nextProps.data),
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
    this.props.onOpenDealDetails(selectedDeal);
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

const mapDispatchToProps = dispatch => ({
  navigateTo: route => dispatch(navigateTo(route)),
});

export default connect(null, mapDispatchToProps)(
  connectStyle(ext('DealsMap', {}))(DealsMap),
);
