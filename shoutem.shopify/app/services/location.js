import _ from 'lodash';

export function formatAutocompleteData(data) {
  const addressParts = _.get(data, 'address_components', []);

  const street = _.get(
    _.find(addressParts, part => _.includes(part.types, 'route')),
    'long_name',
    '',
  );
  const streetNumber = _.get(
    _.find(addressParts, part => _.includes(part.types, 'street_number')),
    'long_name',
    '',
  );
  const address = _.trim(`${street} ${streetNumber}`);
  const postalCode = _.get(
    _.find(addressParts, part => _.includes(part.types, 'postal_code')),
    'long_name',
  );
  const city = _.get(
    _.find(
      addressParts,
      part =>
        _.includes(part.types, 'locality') &&
        _.includes(part.types, 'political'),
    ),
    'long_name',
  );
  const countryName = _.get(
    _.find(
      addressParts,
      part =>
        _.includes(part.types, 'country') &&
        _.includes(part.types, 'political'),
    ),
    'long_name',
  );
  const countryCode = _.get(
    _.find(
      addressParts,
      part =>
        _.includes(part.types, 'country') &&
        _.includes(part.types, 'political'),
    ),
    'short_name',
  );
  const province = _.get(
    _.find(addressParts, part =>
      _.includes(part.types, 'administrative_area_level_1'),
    ),
    'long_name',
  );

  return {
    street,
    streetNumber,
    address,
    postalCode,
    city,
    countryName,
    countryCode,
    province,
  };
}
