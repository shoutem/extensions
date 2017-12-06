import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import { LANGUAGES } from 'src/services';

export default class LanguageSelect extends Component {
  constructor(props) {
    super(props);

    this.refreshData = this.refreshData.bind(this);

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
        .mapValues((name, code) => ({ value: code, label: name }))
        .values()
        .filter( languageOption => (
          _.isEmpty(nextAvailableLanguageCodes) ||
          _.includes(nextAvailableLanguageCodes, languageOption.value)
        ))
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
        placeholder={'Select language'}
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
