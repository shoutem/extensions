import autoBind from 'auto-bind';
import Uri from 'urijs';

class BestTime {
  constructor() {
    autoBind(this);

    this.apiKey = null;
  }

  init(apiKey) {
    this.apiKey = apiKey;
  }

  buildNewForecastUrl(place) {
    const params = {
      api_key_private: this.apiKey,
      venue_name: place.name,
      venue_address: place.formatted_address,
    };

    return new Uri('/api/v1/forecasts')
      .protocol('https')
      .host('besttime.app')
      .query(params)
      .toString();
  }

  buildLiveForecastUrl(place) {
    const params = {
      api_key_private: this.apiKey,
      venue_name: place.name,
      venue_address: place.formatted_address,
    };

    return new Uri('/api/v1/forecasts/live')
      .protocol('https')
      .host('besttime.app')
      .query(params)
      .toString();
  }
}

export const bestTime = new BestTime();
