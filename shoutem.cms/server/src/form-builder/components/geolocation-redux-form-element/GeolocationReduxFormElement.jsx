import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { ReduxFormElement } from '@shoutem/react-web-ui';
import SelectReduxFormElement from '../select-redux-form-element';
import './style.scss';

const loadScript = (url, callback) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

export default class GeolocationReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    latitudeName: PropTypes.string,
    longitudeName: PropTypes.string,
    googleApiKey: PropTypes.string,
    field: PropTypes.object,
    touch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.autocompleteService = null;
    this.geocoderService = null;

    const { elementId, field, googleApiKey } = props;

    const googeMapsApiExist = _.get(window, 'google.maps');
    if (googeMapsApiExist) {
      this.handleScriptLoad();
    } else {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`,
        this.handleScriptLoad,
      );
    }

    const latElementId = `${elementId}-lat`;
    const lngElementId = `${elementId}-lng`;
    const input = _.get(field, 'value.formattedAddress');

    this.state = {
      latElementId,
      lngElementId,
      input,
      options: [],
    };
  }

  handleScriptLoad() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.geocoderService = new window.google.maps.Geocoder();
  }

  handleInputChange(input) {
    if (!input || !this.autocompleteService) {
      return;
    }

    this.autocompleteService.getPlacePredictions({ input }, response => {
      const options = _.map(response, item => {
        const option = {
          placeId: _.get(item, 'place_id'),
          value: _.get(item, 'description'),
          label: _.get(item, 'description'),
        };

        return option;
      });

      this.setState({ options, input });
    });
  }

  handleSelectionChanged(newSelectedItem) {
    const { field, touch } = this.props;

    const formattedAddress = _.get(newSelectedItem, 'label');
    field.onChange({
      ...field.value,
      formattedAddress,
    });

    if (_.isFunction(touch)) {
      touch([field.name]);
    }

    const placeId = _.get(newSelectedItem, 'placeId');
    if (placeId && this.geocoderService) {
      this.geocoderService.geocode({ placeId }, response => {
        const place = _.first(response);

        const latFunc = _.get(place, 'geometry.location.lat');
        const lngFunc = _.get(place, 'geometry.location.lng');
        if (_.isFunction(latFunc) && _.isFunction(lngFunc)) {
          const latitude = latFunc();
          const longitude = lngFunc();

          field.onChange({
            ...field.value,
            formattedAddress,
            latitude,
            longitude,
          });
        }
      });
    }
  }

  handleLatitudeChanged(event) {
    const { field } = this.props;

    const latitude = _.get(event, 'target.value');
    field.onChange({
      ...field.value,
      latitude,
    });
  }

  handleLongitudeChanged(event) {
    const { field } = this.props;

    const longitude = _.get(event, 'target.value');
    field.onChange({
      ...field.value,
      longitude,
    });
  }

  handleClose() {
    const { field, touch } = this.props;
    const { input } = this.state;

    field.onChange({
      ...field.value,
      formattedAddress: input,
    });

    if (_.isFunction(touch)) {
      touch([field.name]);
    }
  }

  render() {
    const {
      field,
      name,
      placeholder,
      latitudeName,
      longitudeName,
      ...otherProps
    } = this.props;
    const { options, latElementId, lngElementId } = this.state;

    const value = _.get(field, 'value.formattedAddress');
    const option = _.find(options, { value });
    if (!option && value) {
      options.push({ value, label: value });
    }

    const locationField = _.cloneDeep(field);
    locationField.value = value;

    const latField = _.cloneDeep(field);
    latField.value = _.get(field, 'value.latitude');

    const lngField = _.cloneDeep(field);
    lngField.value = _.get(field, 'value.longitude');

    return (
      <Row className="geolocation-form">
        <SelectReduxFormElement
          {...otherProps}
          placeholder={placeholder}
          name={name}
          field={locationField}
          options={options}
          filterOptions={null}
          onChange={this.handleSelectionChanged}
          onInputChange={this.handleInputChange}
          onClose={this.handleClose}
        />
        <Col xs={6} className="geolocation-latitude">
          <ReduxFormElement
            elementId={latElementId}
            name={latitudeName}
            field={latField}
            onChange={this.handleLatitudeChanged}
            onUpdate={this.handleLatitudeChanged}
            onDrop={this.handleLatitudeChanged}
            onBlur={this.handleLatitudeChanged}
          />
        </Col>
        <Col xs={6} className="geolocation-longitude">
          <ReduxFormElement
            elementId={lngElementId}
            name={longitudeName}
            field={lngField}
            onChange={this.handleLongitudeChanged}
            onUpdate={this.handleLongitudeChanged}
            onDrop={this.handleLongitudeChanged}
            onBlur={this.handleLongitudeChanged}
          />
        </Col>
      </Row>
    );
  }
}
