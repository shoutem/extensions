import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { LanguageListItem } from '../components';
import { ext } from '../const';
import { actions, selectors } from '../redux';

export class SelectLanguageScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleLocaleChangePress(locale) {
    const { selectedLocale, setLocale, localeChanged } = this.props;

    if (locale === selectedLocale || !locale || _.isEmpty(locale)) {
      return;
    }

    setLocale(locale);
    // We are dispatching another action because we want locale to be updated first.
    // After locale has been updated, we want to be able to react on update via middlewares,
    // by utilizing this action.
    // Before this was added, we had only setLocale action and respective middleware, app was
    // fetching same data twice inside componentDidUpdate, after CMS collections were invalidated - once
    // when locale is changed and again when collections were invalidated. Change triggered so fast,
    // collections didn't have time to update their status to busy to prevent another fetch with shouldRefresh.
    localeChanged();
  }

  renderLanguageItem(locale) {
    const { selectedLocale } = this.props;

    const isActive = selectedLocale === locale;

    return (
      <LanguageListItem
        active={isActive}
        locale={locale}
        onPress={this.handleLocaleChangePress}
      />
    );
  }

  render() {
    const { locales } = this.props;

    // TODO: Create extension-level translations for i18n specifically
    // This would mean replacing 'shoutem.application' with 'ext()'
    // Currently not possible as we don't have a way to merge en.json files
    return (
      <Screen>
        <ListView
          data={locales}
          emptyListMessage={I18n.t('shoutem.application.emptyListMessage')}
          emptyListTitle={I18n.t('shoutem.application.emptyListTitle')}
          renderRow={this.renderLanguageItem}
        />
      </Screen>
    );
  }
}

const mapDispatchToProps = {
  setLocale: actions.setLocale,
  localeChanged: actions.localeChanged,
};

const mapStateToProps = state => ({
  locales: selectors.getActiveLocales(state),
  selectedLocale: selectors.getSelectedLocale(state),
});

SelectLanguageScreen.propTypes = {
  localeChanged: PropTypes.func.isRequired,
  locales: PropTypes.array.isRequired,
  selectedLocale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SelectLanguageScreen'))(SelectLanguageScreen));
