import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Image, InteractionManager, ColorPropType } from 'react-native';
import _ from 'lodash';

const DEFAULT_ZOOM_SETTINGS = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// ShoutEm HQ location
const DEFAULT_REGION = {
  longitude: 15.9994209,
  latitude: 45.8109446,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

function getUserLocation(success, error) {
  navigator.geolocation.getCurrentPosition(success, error);
}

function isLocatedAt(coordinates) {
  const { latitude, longitude } = coordinates;

  return marker =>
    marker.latitude === latitude && marker.longitude === longitude;
}

/**
 * A base class which needs to be subclassed by the OS-specific implementations.
 * Tracks state of the map regions and selected markers.
 *
 * @returns {null}
 */
export default class MapViewBase extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      isReady: false,
      region: null,
      initialRegion: null,
      markerCoordinates: null,
      selectedMarker: props.selectedMarker || null,
    };
  }

  componentDidMount() {
    this.resolveInitialRegion();
  }

  onMarkerPress(pressEvent) {
    const { markers, onMarkerPressed } = this.props;

    const selectedCoordinates = this.getCoordinatesFromNativeEvent(pressEvent);
    const selectedMarker = markers.find(isLocatedAt(selectedCoordinates));

    this.setState({
      markerCoordinates: selectedCoordinates,
      selectedMarker,
      ...DEFAULT_ZOOM_SETTINGS,
    });

    if (onMarkerPressed) {
      onMarkerPressed(selectedMarker);
    }
  }

  onRegionChange(region) {
    const { onRegionChanged } = this.props;

    if (onRegionChanged) {
      onRegionChanged(region);
    }
  }

  getInitialRegion() {
    return this.state.initialRegion;
  }

  getZindex(marker, index) {
    const { selectedMarker } = this.state;
    const { markers } = this.props;

    const topZindex = _.size(markers);

    return selectedMarker && _.isEqual(marker, selectedMarker)
      ? topZindex
      : index;
  }

  getMarkerImage(marker) {
    const { selectedMarkerImage, markerImage } = this.props;
    const { selectedMarker } = this.state;

    return selectedMarker && _.isEqual(marker, selectedMarker)
      ? selectedMarkerImage
      : markerImage;
  }

  resolveInitialRegion() {
    const { initialRegion, markers, focusUserLocation } = this.props;

    let region = DEFAULT_REGION;

    if (focusUserLocation) {
      getUserLocation(
        location => this.updateInitialRegion(location.coords),
        () => this.updateInitialRegion(region),
      );
      return;
    }

    if (initialRegion) {
      region = initialRegion;
    } else if (markers.length > 0) {
      region = markers[0];
    }

    this.updateInitialRegion(region);
  }

  isMapReadyToRender() {
    return this.state.isReady;
  }

  updateInitialRegion(region) {
    this.setState({
      initialRegion: {
        ...DEFAULT_ZOOM_SETTINGS,
        ...region,
      },
    });
    InteractionManager.runAfterInteractions(() =>
      this.setState({ isReady: true }),
    );
  }

  // Override in subclass
  render() {
    return null;
  }
}
/**
 * The region to be displayed by the map.
 *
 * The region is defined by the center coordinates and the span of
 * coordinates to display.
 */
const Region = PropTypes.shape({
  /**
   * Coordinates for the center of the map.
   */
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,

  /**
   * Distance between the minimum and the maximum latitude/longitude
   * to be displayed.
   */
  latitudeDelta: PropTypes.number,
  longitudeDelta: PropTypes.number,
});

/**
 * Map annotations with title and subtitle.
 */
const Annotations = PropTypes.arrayOf(
  PropTypes.shape({
    /**
     * The location of the annotation.
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,

    /**
     * Whether the pin drop should be animated or not
     */
    animateDrop: PropTypes.bool,

    /**
     * Whether the pin should be draggable or not
     */
    draggable: PropTypes.bool,

    /**
     * Event that fires when the annotation drag state changes.
     */
    onDragStateChange: PropTypes.func,

    /**
     * Event that fires when the annotation gets was tapped by the user
     * and the callout view was displayed.
     */
    onFocus: PropTypes.func,

    /**
     * Event that fires when another annotation or the mapview itself
     * was tapped and a previously shown annotation will be closed.
     */
    onBlur: PropTypes.func,

    /**
     * Annotation title and subtile.
     */
    title: PropTypes.string,
    subtitle: PropTypes.string,

    /**
     * Callout views.
     */
    leftCalloutView: PropTypes.element,
    rightCalloutView: PropTypes.element,
    detailCalloutView: PropTypes.element,

    /**
     * The pin color. This can be any valid color string, or you can use one
     * of the predefined PinColors constants. Applies to both standard pins
     * and custom pin images.
     *
     * Note that on iOS 8 and earlier, only the standard PinColor constants
     * are supported for regular pins. For custom pin images, any tintColor
     * value is supported on all iOS versions.
     */
    tintColor: ColorPropType,

    /**
     * Custom pin image. This must be a static image resource inside the app.
     */
    image: Image.propTypes.source,

    /**
     * Custom pin view. If set, this replaces the pin or custom pin image.
     */
    view: PropTypes.element,

    /**
     * annotation id
     */
    id: PropTypes.string,
  }),
);

MapViewBase.propTypes = {
  markerImage: Image.propTypes.source,
  selectedMarkerImage: Image.propTypes.source,
  selectedMarker: Region,
  style: PropTypes.object,
  initialRegion: Region,
  markers: Annotations,
  onMarkerPressed: PropTypes.func,
  onRegionChanged: PropTypes.func,
  focusUserLocation: PropTypes.bool,
};

MapViewBase.defaultProps = {
  markerImage: require('../assets/images/pin-light.png'),
  selectedMarkerImage: require('../assets/images/pin-dark.png'),
};
