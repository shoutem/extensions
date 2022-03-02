import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, TextInput, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function SearchInput({ input, onChangeText, onClearPress, style }) {
  return (
    <View style={style.container}>
      <View
        styleName="horizontal v-center h-center"
        style={style.searchBackground}
      >
        <Icon name="search" style={style.searchIcon} />
        <TextInput
          autoCorrect={false}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={input}
          placeholder={I18n.t(ext('searchPlaceholder'))}
          style={style.searchTextInput}
        />
        <View
          styleName="horizontal v-center h-end"
          style={style.clearSearchContainer}
        >
          {!!input && (
            <Button styleName="clear" onPress={onClearPress}>
              <Icon name="clear-text" style={style.clearSearchIcon} />
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

SearchInput.propTypes = {
  input: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onClearPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

SearchInput.defaultProps = {
  style: {},
};

export default React.memo(connectStyle(ext('SearchInput'))(SearchInput));
