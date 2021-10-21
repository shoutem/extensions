import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Spinner, Text, TextInput, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { deleteUser, logout } from '../redux';

export function ConfirmDeletionScreen(props) {
  const { deleteUser, logout, navigation, style } = props;

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const isButtonDisabled =
    loading || inputText !== I18n.t(ext('deleteText')).toUpperCase();
  const buttonTextStyle = isButtonDisabled
    ? style.deleteAccountButtonText.disabled
    : style.deleteAccountButtonText.enabled;

  function getNavBarProps() {
    return { title: I18n.t(ext('deletionNavBarTitle')).toUpperCase() };
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      ...getNavBarProps(),
    });
  }, []);

  function handleDeleteUser() {
    setLoading(true);

    deleteUser()
      .then(() => {
        setLoading(false);
        logout();
      })
      .catch(() => {
        setLoading(false);
        Alert.alert(
          I18n.t(ext('alertErrorTitle')),
          I18n.t(ext('alertTryAgainMessage')),
        );
      });
  }

  return (
    <Screen>
      <View styleName="lg-gutter-vertical md-gutter-horizontal">
        <Text style={style.deleteAccountDescription}>
          {I18n.t(ext('deleteAccountDescription'))}
        </Text>
      </View>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        highlightOnFocus
        keyboardAppearance="dark"
        keyboardType="email-address"
        onChangeText={setInputText}
        placeholder={I18n.t(ext('typeHerePlaceholder'))}
        returnKeyType="done"
        value={inputText}
        style={style.textInput}
        styleName="sm-gutter-top"
      />
      <View style={style.deleteAccountButtonContainer}>
        <Button
          disabled={isButtonDisabled}
          styleName="full-width secondary"
          onPress={handleDeleteUser}
        >
          <Text style={buttonTextStyle}>
            {!loading && I18n.t(ext('deleteAccountButtonText')).toUpperCase()}
            {loading && <Spinner />}
          </Text>
        </Button>
      </View>
    </Screen>
  );
}

ConfirmDeletionScreen.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

ConfirmDeletionScreen.defaultProps = {
  style: {},
};

export const mapDispatchToProps = { deleteUser, logout };

export default connect(
  null,
  mapDispatchToProps,
)(connectStyle(ext('ConfirmDeletionScreen'))(ConfirmDeletionScreen));
