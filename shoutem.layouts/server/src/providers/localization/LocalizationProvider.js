import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import _ from 'lodash';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { i18n, getExtensionInstallation } from 'environment';
import translation from '../../../translations/en.json';
import pack from '../../../package.json';

export class LocalizationProvider extends Component {
  constructor(props) {
    super(props);

    this.handleInjection = this.handleInjection.bind(this);
    this.handleOwnInjection = this.handleOwnInjection.bind(this);
    this.handleExtensionInjection = this.handleExtensionInjection.bind(this);

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

  componentWillReceiveProps(nextProps) {
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
  ownExtensionName: PropTypes.string,
  extensionName: PropTypes.string,
  locale: PropTypes.string,
  translationUrl: PropTypes.string,
  extensionLocale: PropTypes.string,
  extensionTranslationUrl: PropTypes.string,
};

function mapStateToProps() {
  const ownExtensionName = pack.name;
  const extensionInstallation = getExtensionInstallation();
  const extensionName = _.get(extensionInstallation, 'canonicalName');

  const dependency = _.get(i18n, `dependencies.${ownExtensionName}`);
  const locale = _.get(dependency, 'locale') || _.get(i18n, 'locale');
  const translationUrl =
    _.get(dependency, 'translationUrl') || _.get(i18n, 'translationUrl');

  // special case when translating screens of other extension
  const extensions = _.get(i18n, `dependencies.extensions`);
  const extensionLocale = _.get(extensions, `locale`);
  const extensionTranslationUrl = _.get(extensions, `translationUrl`);

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
