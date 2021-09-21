import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import { navigateTo } from 'shoutem.navigation';
import { placeShape } from '../components/shapes';
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

      autoBindReact(this);
    }

    openPlaceDetailsScreen() {
      const { place } = this.props;

      navigateTo(ext('PlaceDetails'), {
        place,
        title: place.name,
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
    place: placeShape.isRequired,
  };

  return EnhancedComponent;
}
