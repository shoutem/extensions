import autoBind from 'auto-bind';
import Uri from 'urijs';

class GooglePlaces {
  constructor() {
    autoBind(this);

    this.apiKey = null;
    this.locale = 'en';
  }

  init(apiKey, locale) {
    this.apiKey = apiKey;
    this.locale = locale;
  }

  buildAutocompleteUrl(input, location = null, radius) {
    const params = {
      key: this.apiKey,
      types: 'establishment',
      input,
    };

    if (location && radius) {
      const {
        coords: { latitude, longitude },
      } = location;

      params.location = `${latitude},${longitude}`;
      params.radius = parseInt(radius);
    }

    const url = new Uri('/maps/api/place/autocomplete/json')
      .protocol('https')
      .host('maps.googleapis.com')
      .query(params)
      .toString();

    return url;
  }

  buildDetailsUrl(placeId) {
    const params = {
      key: this.apiKey,
      place_id: placeId,
      fields: 'name,geometry,formatted_address,opening_hours',
      language: this.locale,
    };

    return new Uri('/maps/api/place/details/json')
      .protocol('https')
      .host('maps.googleapis.com')
      .query(params)
      .toString();
  }
}

export const googlePlaces = new GooglePlaces();
