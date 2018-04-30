import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isValid } from '@shoutem/redux-io';
import {
  ControlLabel,
  FormGroup,
} from 'react-bootstrap';
import {
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { connect } from 'react-redux';
import { AssetManager } from '@shoutem/assets-sdk';
import { LanguageSelect } from 'src/components';
import { TranslationsDashboard } from 'src/modules/translations';
import { invalidateCurrentBuild, navigateToUrl } from 'src/redux';
import './style.scss';

const DEFAULT_LANGUAGE_CODE = 'en';

class LanguagePage extends Component {
  static propTypes = {
    appId: PropTypes.string,
    extension: PropTypes.object,
    updateExtensionSettings: PropTypes.func,
    invalidateCurrentBuild: PropTypes.func,
    navigateToUrl: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.checkData = this.checkData.bind(this);
    this.handleTranslationChange = this.handleTranslationChange.bind(this);
    this.handleTranslationDelete = this.handleTranslationDelete.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);

    const { appId } = props;
    const { page } = context;

    const appsUrl = _.get(page, 'pageContext.url.apps', {});

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    this.state = {
      translations: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { extension } = props;
    const { extension: nextExtension } = nextProps;

    const nextTranslations = _.get(nextExtension, 'settings.translations');

    if (isValid(nextExtension) && extension !== nextExtension) {
      this.setState({
        translations: nextTranslations,
      });
    }
  }

  handleLocaleChange(languageOption) {
    const { value: locale } = languageOption;
    this.props.updateExtensionSettings({ locale });
  }

  handleTranslationChange(translation) {
    const { languageCode, translationUrl } = translation;

    return this.props.updateExtensionSettings({
      translations: {
        [languageCode]: translationUrl,
      },
    }).then(this.props.invalidateCurrentBuild);
  }

  handleTranslationDelete(languageCode) {
    const { extension } = this.props;
    const currentLocale = _.get(extension, 'settings.locale');
    const useDefaultLocale = languageCode === currentLocale;

    return this.props.updateExtensionSettings({
      locale: useDefaultLocale ? DEFAULT_LANGUAGE_CODE : currentLocale,
      translations: {
        [languageCode]: null,
      },
    });
  }

  render() {
    const { extension, navigateToUrl } = this.props;
    const { translations } = this.state;

    const locale = _.get(extension, 'settings.locale', DEFAULT_LANGUAGE_CODE);
    const translationLanguageCodes = _.union(_.keys(translations), [DEFAULT_LANGUAGE_CODE]);

    return (
      <div className="languages-page settings-page">
        <h3>Default language</h3>
        <FormGroup className="languages-page__language">
          <ControlLabel>Select language</ControlLabel>
          <LanguageSelect
            onChange={this.handleLocaleChange}
            value={locale}
            availableLanguageCodes={translationLanguageCodes}
          />
        </FormGroup>
        <TranslationsDashboard
          className="language-page__dashboard"
          translations={translations}
          assetManager={this.assetManager}
          onCreate={this.handleTranslationChange}
          onUpdate={this.handleTranslationChange}
          onDelete={this.handleTranslationDelete}
        />
        <p>
          To download the source language file click{' '}
          <a href="https://shoutem.github.io/static/localization/en.json.zip">
           here
          </a>.
          <br/>
          <br/>
          You can find a tutorial on how to translate it{' '}
          <a onClick={navigateToUrl}>
           here
          </a>.
        </p>
      </div>
    );
  }
}

LanguagePage.contextTypes = {
  page: PropTypes.object,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { extension, appId } = ownProps;
  const url = "https://shoutem.github.io/docs/extensions/tutorials/using-localization";

  return {
    updateExtensionSettings: (settingsPatch) => (
      dispatch(updateExtensionSettings(extension, settingsPatch))
    ),
    invalidateCurrentBuild: () => (
      dispatch(invalidateCurrentBuild(appId))
    ),
    navigateToUrl: () => dispatch(navigateToUrl(url)),
  };
}

export default connect(null, mapDispatchToProps)(LanguagePage);
