import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import Select from 'react-select';
import { LANGUAGES } from 'src/services';
import LOCALIZATION from './localization';

export default class LanguageSelect extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      languageOptions: [],
      inError: false,
      inProgress: false,
    };
  }

  componentWillMount() {
    this.refreshData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.refreshData(nextProps, this.props);
  }

  refreshData(nextProps, props = {}) {
    const { availableLanguageCodes } = props;
    const { availableLanguageCodes: nextAvailableLanguageCodes } = nextProps;

    if (availableLanguageCodes !== nextAvailableLanguageCodes) {
      const languageOptions = _.chain(LANGUAGES)
        .mapValues((name, code) => ({ value: code, label: i18next.t(name) }))
        .values()
        .filter(
          languageOption =>
            _.isEmpty(nextAvailableLanguageCodes) ||
            _.includes(nextAvailableLanguageCodes, languageOption.value),
        )
        .sortBy(['label'])
        .value();

      this.setState({ languageOptions });
    }
  }

  render() {
    const { languageOptions } = this.state;

    return (
      <Select
        autoBlur
        clearable={false}
        options={languageOptions}
        placeholder={i18next.t(LOCALIZATION.PLACEHOLDER)}
        {...this.props}
      />
    );
  }
}

LanguageSelect.propTypes = {
  availableLanguageCodes: PropTypes.array,
};

LanguageSelect.defaultProps = {
  availableLanguageCodes: [],
};
