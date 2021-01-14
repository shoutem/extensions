import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import Select from 'react-select';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, isBusy, isInitialized } from '@shoutem/redux-io/status';
import {
  updateExtensionSettings,
  getExtension,
  fetchShortcuts,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import { invalidateCurrentBuild } from 'src/redux';
import { TranslationTable } from '../../components';
import { createLanguageOptions } from '../../services';
import { DEFAULT_LOCALE } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

function resolveTranslationOptions(translationOptions) {
  return _.filter(translationOptions, option => {
    return option.value !== DEFAULT_LOCALE.value;
  });
}

class ScreensPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const screenTranslations = _.get(props, 'extension.settings.shortcuts', {});

    this.state = {
      initialScreenTranslations: screenTranslations,
      screenTranslations,
      translationOptions: [],
      translateTo: null,
      error: null,
      hasChanges: false,
    };
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { languageCodes, extension } = props;
    const { languageCodes: nextLanguageCodes } = nextProps;

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      this.props.fetchShortcuts();
    }

    if (isInitialized(extension)) {
      const { settings: extSettings } = extension;
      const { settings: nextExtSettings } = extension;

      if (nextExtSettings !== extSettings) {
        this.setState({
          screenTranslations: nextExtSettings.shortcuts,
        });
      }
    }

    if (languageCodes !== nextLanguageCodes) {
      const languageOptions = createLanguageOptions(nextLanguageCodes);

      const translationOptions = _.reduce(
        languageOptions,
        (availableTranslations, languageOption) => {
          const arrowUnicode = '\u2192';
          const value = languageOption.value;
          const label = `${DEFAULT_LOCALE.label} ${arrowUnicode} ${languageOption.label}`;
          const title = languageOption.label;

          if (languageOption.value === DEFAULT_LOCALE.value) {
            return availableTranslations;
          }

          return [
            ...availableTranslations,
            {
              value,
              label,
              title,
            },
          ];
        },
        [],
      );

      this.setState({ translationOptions });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { updateExtensionSettings, invalidateCurrentBuild } = this.props;
    const { screenTranslations: shortcuts } = this.state;

    this.setState({ error: null });

    const settingsPatch = {
      shortcuts,
    };

    updateExtensionSettings(settingsPatch)
      .then(this.setState({ initialScreenTranslations: shortcuts }))
      .then(invalidateCurrentBuild)
      .catch(({ payload: { message: error } }) => this.setState({ error }));
  }

  handleTranslationChange(translateTo) {
    this.setState({ translateTo });
  }

  handleTranslateInputChange(translation) {
    const { screenTranslations } = this.state;

    this.setState({
      screenTranslations: _.merge({}, screenTranslations, {
        [translation.shortcutKey]: {
          [translation.languageCode]: translation.value,
        },
      }),
    });
  }

  render() {
    const { extension, shortcuts } = this.props;
    const {
      initialScreenTranslations,
      translationOptions,
      translateTo,
      screenTranslations,
      error,
    } = this.state;

    const resolvedTranslationOptions = resolveTranslationOptions(
      translationOptions,
    );

    const resolvedTranslateTo =
      translateTo || _.head(resolvedTranslationOptions);

    const isLoading = !isInitialized(extension) || isBusy(extension);
    const hasChanges =
      JSON.stringify(initialScreenTranslations) !==
      JSON.stringify(screenTranslations);

    if (!resolvedTranslateTo) {
      return <p>{i18next.t(LOCALIZATION.NO_LANGUAGES_ADDED_LABEL)}</p>;
    }

    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.SELECT_LANGUAGE_LABEL)}
            </ControlLabel>
            <LoaderContainer isLoading={isLoading}>
              <Select
                onChange={this.handleTranslationChange}
                value={resolvedTranslateTo}
                autoBlur
                clearable={false}
                options={resolvedTranslationOptions}
              />
            </LoaderContainer>
          </FormGroup>
          <FormGroup>
            <TranslationTable
              shortcuts={shortcuts}
              translations={screenTranslations}
              onChange={this.handleTranslateInputChange}
              translateTo={resolvedTranslateTo}
            />
          </FormGroup>
        </form>
        <div className="screens-page__button">
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              disabled={!hasChanges}
              onClick={this.handleSave}
            >
              <LoaderContainer isLoading={isLoading}>
                {i18next.t(LOCALIZATION.BUTTON_TEXT)}
              </LoaderContainer>
            </Button>
          </ButtonToolbar>
        </div>
      </>
    );
  }
}

ScreensPage.propTypes = {
  extension: PropTypes.object,
  updateExtensionSettings: PropTypes.func,
  shortcuts: PropTypes.array,
  fetchShortcuts: PropTypes.func,
  invalidateCurrentBuild: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  const extension = getExtension(state, extensionName);
  const translations = _.get(extension, 'settings.translations');
  const languageCodes = _.keys(translations).sort();
  const shortcuts = getShortcuts(state);

  return {
    extension,
    translations,
    languageCodes,
    shortcuts,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extension, appId } = ownProps;

  return {
    updateExtensionSettings: settingsPatch =>
      dispatch(updateExtensionSettings(extension, settingsPatch)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    invalidateCurrentBuild: () => dispatch(invalidateCurrentBuild(appId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreensPage);
