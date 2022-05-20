import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';
import { restartApp } from 'shoutem.application/redux';
import { I18n } from 'shoutem.i18n';
import { ThemeListItem } from '../components';
import { ext } from '../const';
import { getAllThemes, getSelectedTheme, selectTheme } from '../redux';

export class ThemePickerScreen extends PureComponent {
  static propTypes = {
    restartApp: PropTypes.func.isRequired,
    selectedTheme: PropTypes.object.isRequired,
    selectTheme: PropTypes.func.isRequired,
    themes: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleThemeChangePress(theme) {
    const { selectedTheme, selectTheme, restartApp } = this.props;

    if (theme.id === selectedTheme.id || _.isEmpty(theme)) {
      return;
    }

    selectTheme(theme.id);
    Alert.alert(
      I18n.t(ext('themeChangedAlertTitle')),
      I18n.t(ext('themeChangedAlertMessage')),
      [
        {
          text: I18n.t(ext('themeChangedAlertConfirmationButton')),
          onPress: restartApp,
        },
      ],
    );
  }

  renderThemeItem(theme) {
    const { selectedTheme } = this.props;

    const isActive = selectedTheme.id === theme.id;

    return (
      <ThemeListItem
        active={isActive}
        theme={theme}
        onPress={this.handleThemeChangePress}
      />
    );
  }

  render() {
    const { themes, selectedTheme } = this.props;

    return (
      <Screen>
        <ListView
          data={themes}
          renderRow={this.renderThemeItem}
          extraData={selectedTheme}
        />
      </Screen>
    );
  }
}

const mapDispatchToProps = {
  selectTheme,
  restartApp,
};

const mapStateToProps = state => ({
  themes: getAllThemes(state),
  selectedTheme: getSelectedTheme(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ThemePickerScreen'))(ThemePickerScreen));
