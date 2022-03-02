import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TextInput, View } from '@shoutem/ui';
import { ext } from '../const';

function CodeInput({ onSubmit, maxLength, style }) {
  const [code, setCode] = useState('');
  const showFocusedCell = _.size(code) < maxLength;
  const remainingCells = maxLength - _.size(code) - 1;

  useEffect(() => {
    if (_.size(code) === maxLength) {
      onSubmit(code);
    }
  }, [code, maxLength, onSubmit]);

  function handleSubmit() {
    if (_.size(code) === maxLength) {
      return onSubmit(code);
    }

    return null;
  }

  const filledCellStyle = useMemo(() => [style.cell, style.filledCell], [
    style.cell,
    style.filledCell,
  ]);
  const focusedCellStyle = useMemo(() => [style.cell, style.focusedCell], [
    style.cell,
    style.focusedCell,
  ]);

  return (
    <View styleName="lg-gutter-top">
      <View styleName="horizontal">
        {_.map(code, (digit, index) => (
          <View key={index} style={filledCellStyle}>
            <Text style={style.code}>{digit}</Text>
          </View>
        ))}
        {showFocusedCell && (
          <View key={maxLength + 1} style={focusedCellStyle}>
            <Text style={style.code}> </Text>
          </View>
        )}
        {_.times(remainingCells, index => (
          <View key={-index} style={style.cell}>
            <Text style={style.code}> </Text>
          </View>
        ))}
      </View>
      <TextInput
        autoCorrect={false}
        blurOnSubmit
        caretHidden
        clearButtonMode="never"
        keyboardType="number-pad"
        maxLength={maxLength}
        onChangeText={setCode}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        selectTextOnFocus
        selectionColor="rgba(0, 0, 0, 0)"
        spellCheck={false}
        style={style.textInput}
        textContentType="oneTimeCode"
        value={code}
      />
    </View>
  );
}

CodeInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  style: PropTypes.object,
};

CodeInput.defaultProps = {
  style: {},
  maxLength: 4,
};

export default connectStyle(ext('CodeInput'))(CodeInput);
