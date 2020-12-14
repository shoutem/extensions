import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';

import { invalidateLoadedCollections } from 'shoutem.cms';
import { NavigationBar } from 'shoutem.navigation';

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

  getNavigationBarProps() {
    const { title } = this.props;

    return {
      title: title.toUpperCase(),
    };
  }

  handleLocaleChangePress(locale) {
    const { selectedLocale, setLocale, invalidateLoadedCollections } = this.props;

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

    return (
      <Screen>
        <NavigationBar {...this.getNavigationBarProps()} />
        <ListView
          data={locales}
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

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('SelectLanguageScreen'))(SelectLanguageScreen),
);
