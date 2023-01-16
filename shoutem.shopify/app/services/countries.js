import _ from 'lodash';
import countryData from 'world-countries';

const EMPTY_OPTION = { name: 'Select', cca2: '' };

export function loadCountries() {
  return _.sortBy(
    _.map(countryData, ({ name: { common: name }, cca2 }) => ({ name, cca2 })),
    'name',
  );
}

export const countries = [EMPTY_OPTION, ...loadCountries()];

// Move element in array from one index to another
const arrayMove = function(arr, from, to) {
  return arr.splice(to, 0, arr.splice(from, 1)[0]);
};

// Reorder Countries in checkout
['US', 'CA'].map((country, i) => {
  const countryIndex = countries.findIndex(c => c.cca2 === country);

  // Move country after placeholder option
  arrayMove(countries, countryIndex, 1 + i);
});
