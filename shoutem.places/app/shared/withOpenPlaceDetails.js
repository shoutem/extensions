import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';

/**
 * Wraps the received component with the method used to navigate to the
 * place details screen. Also, second parameter allows us to control the prop name
 * of the wrapped component, to which we assing the openPlaceDetailsScreen method
 *
 * @param RowComponent {object} Underlying component to which we apply HOC
 * @param prop {string} Prop name of underlying component, to which we pass the
 * openPlaceDetailsScreen handler, used to navigate to Details screen
 * @returns {object} Wrapped component
 */
export default function withOpenPlaceDetails(RowComponent, prop = 'onPress') {
  class EnhancedComponent extends PureComponent {
    constructor(props) {
      super(props);
      this.openPlaceDetailsScreen = this.openPlaceDetailsScreen.bind(this);
    }

    openPlaceDetailsScreen() {
      const { place } = this.props;

      navigateTo(ext('PlaceDetails'), {
        title: place.name,
        place,
        analyticsPayload: {
          itemId: place.id,
          itemName: place.name,
        },
      });
    }

    render() {
      const passedProps = {
        ...this.props,
        [prop]: this.openPlaceDetailsScreen,
      };

      return <RowComponent {...passedProps} />;
    }
  }

  EnhancedComponent.propTypes = {
    place: PropTypes.object.isRequired,
  };

  return EnhancedComponent;
}
