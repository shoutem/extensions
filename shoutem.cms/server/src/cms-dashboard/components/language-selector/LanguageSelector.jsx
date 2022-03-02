import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { LoaderContainer, MultiselectDropdown } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export function createLanguageOptions(languages) {
  if (_.isEmpty(languages)) {
    return [];
  }

  return _.reduce(
    languages,
    (result, item) => {
      const value = _.toString(_.get(item, 'id'));
      const label = _.get(item, 'name');

      if (value && label) {
        result.push({ value, label });
      }

      return result;
    },
    [],
  );
}

export default class LanguageSelector extends Component {
  static propTypes = {
    selectedLanguages: PropTypes.array,
    languages: PropTypes.array.isRequired,
    onSelectionChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
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
    const { languages, selectedLanguages } = props;
    const {
      languages: nextLanguages,
      selectedLanguages: nextSelectedLanguages,
    } = nextProps;

    if (languages !== nextLanguages) {
      const languageOptions = createLanguageOptions(nextLanguages);
      this.setState({ languageOptions });
    }

    if (selectedLanguages !== nextSelectedLanguages) {
      this.setState({
        selectedLanguages: nextSelectedLanguages,
      });
    }
  }

  handleSelectionChanged(selectedLanguages) {
    const { onSelectionChanged } = this.props;
    this.setState({
      inProgress: true,
      selectedLanguages,
    });

    Promise.resolve(onSelectionChanged(selectedLanguages))
      .then(() => this.setState({ inProgress: false }))
      .catch(() => this.setState({ inProgress: false }));
  }

  render() {
    const { languageOptions, inProgress, selectedLanguages } = this.state;

    return (
      <LoaderContainer
        className="language-selector"
        isLoading={inProgress}
        isOverlay
        size="24px"
      >
        <MultiselectDropdown
          displayLabelMaxSelectedOptions={1}
          emptyText={i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_LABEL)}
          onSelectionChanged={this.handleSelectionChanged}
          options={languageOptions}
          selectNoneText={i18next.t(LOCALIZATION.SELECT_NONE_LABEL)}
          selectAllText={i18next.t(LOCALIZATION.SELECT_ALL_LABEL)}
          selectText={i18next.t(LOCALIZATION.SELECT_LABEL)}
          selectedValues={selectedLanguages}
          showSelectNoneOption
          showSelectAllOption
        />
      </LoaderContainer>
    );
  }
}
