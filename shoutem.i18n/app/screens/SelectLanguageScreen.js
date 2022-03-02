import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';
import { invalidateLoadedCollections } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { LanguageListItem } from '../components';
import { ext } from '../const';
import { actions, selectors } from '../redux';

export class SelectLanguageScreen extends PureComponent {
  static propTypes = {
    locales: PropTypes.array,
    title: PropTypes.string,
    selectedLocale: PropTypes.string,
    setLocale: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleLocaleChangePress(locale) {
    const {
      selectedLocale,
      setLocale,
      invalidateLoadedCollections,
    } = this.props;

    if (locale === selectedLocale || !locale || _.isEmpty(locale)) {
      return;
    }

    setLocale(locale);
    invalidateLoadedCollections();
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
  invalidateLoadedCollections,
};

const mapStateToProps = state => ({
  locales: selectors.getActiveLocales(state),
  selectedLocale: selectors.getSelectedLocale(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SelectLanguageScreen'))(SelectLanguageScreen));
