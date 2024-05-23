import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { getExtensionInstallation, i18n } from 'environment';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import pack from '../../../package.json';
import translation from '../../../translations/en.json';

export class LocalizationProvider extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: true,
    };
  }

  componentDidMount() {
    const { ownExtensionName, extensionName } = this.props;
    const dictionary = _.get(translation, ownExtensionName);

    i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      ns: [ownExtensionName, extensionName],
      defaultNS: ownExtensionName,
      keySeparator: false,
      resources: {
        en: {
          [ownExtensionName]: dictionary,
        },
      },
    });

    this.handleInjection(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.handleInjection(this.props, nextProps);
  }

  async handleInjection(props, nextProps) {
    const promises = [];

    if (_.isEmpty(nextProps)) {
      const {
        locale,
        translationUrl,
        ownExtensionName,
        extensionName,
        extensionLocale,
        extensionTranslationUrl,
      } = props;

      promises.push(
        this.handleOwnInjection(ownExtensionName, locale, translationUrl),
      );

      promises.push(
        this.handleExtensionInjection(
          extensionName,
          extensionLocale,
          extensionTranslationUrl,
        ),
      );
    } else {
      const { locale, translationUrl } = props;
      const nextOwnExtensionName = _.get(nextProps, 'ownExtensionName');
      const nextLocale = _.get(nextProps, 'locale');
      const nextTranslationUrl = _.get(nextProps, 'translationUrl');

      if (translationUrl !== nextTranslationUrl || locale !== nextLocale) {
        promises.push(
          this.handleOwnInjection(
            nextOwnExtensionName,
            nextLocale,
            nextTranslationUrl,
          ),
        );
      }

      const { extensionLocale, extensionTranslationUrl } = props;
      const nextExtensionName = _.get(nextProps, 'extensionName');
      const nextExtensionLocale = _.get(nextProps, 'extensionLocale');
      const nextExtensionTranslationUrl = _.get(
        nextProps,
        'extensionTranslationUrl',
      );

      if (
        extensionTranslationUrl !== nextExtensionTranslationUrl ||
        extensionLocale !== nextExtensionLocale
      ) {
        promises.push(
          this.handleExtensionInjection(
            nextExtensionName,
            nextExtensionLocale,
            nextExtensionTranslationUrl,
          ),
        );
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      this.setState({ inProgress: false });
    }
  }

  async handleOwnInjection(canonicalName, locale, translationUrl) {
    if (canonicalName && locale && translationUrl) {
      try {
        const response = await fetch(translationUrl);
        const translation = await response.json();
        const dictionary = _.get(translation, canonicalName);

        if (dictionary) {
          await i18next.addResourceBundle(locale, canonicalName, dictionary);
          await i18next.changeLanguage(locale);
        }
      } catch (error) {
        // do nothing
      }
    }
  }

  async handleExtensionInjection(canonicalName, locale, translationUrl) {
    if (canonicalName && locale && translationUrl) {
      try {
        const response = await fetch(translationUrl);
        const translation = await response.json();
        const dictionary = _.get(translation, canonicalName);

        if (dictionary) {
          await i18next.addResourceBundle(locale, canonicalName, dictionary);
        }
      } catch (error) {
        // do nothing
      }
    }
  }

  render() {
    const { children } = this.props;
    const { inProgress } = this.state;

    if (inProgress) {
      return <LoaderContainer size="50px" isLoading />;
    }

    return children;
  }
}

LocalizationProvider.propTypes = {
  children: PropTypes.node,
  extensionLocale: PropTypes.string,
  extensionName: PropTypes.string,
  extensionTranslationUrl: PropTypes.string,
  locale: PropTypes.string,
  ownExtensionName: PropTypes.string,
  translationUrl: PropTypes.string,
};

function mapStateToProps() {
  const ownExtensionName = pack.name;
  const extensionInstallation = getExtensionInstallation();
  const extensionName = _.get(extensionInstallation, 'canonicalName');

  const extensionLocale = _.get(i18n, 'locale');
  const extensionTranslationUrl = _.get(i18n, 'translationUrl');

  const dependency = _.get(i18n, `dependencies.${ownExtensionName}`);
  const locale = _.get(dependency, 'locale') || extensionLocale;
  const translationUrl =
    _.get(dependency, 'translationUrl') || extensionTranslationUrl;

  return {
    ownExtensionName,
    extensionName,
    locale,
    translationUrl,
    extensionLocale,
    extensionTranslationUrl,
  };
}

export default connect(mapStateToProps)(LocalizationProvider);
