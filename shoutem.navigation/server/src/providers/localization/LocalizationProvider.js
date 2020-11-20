import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import _ from 'lodash';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { i18n } from 'environment';
import translation from '../../../translations/en.json';
import pack from '../../../package.json';

export class LocalizationProvider extends Component {
  constructor(props) {
    super(props);

    this.handleInjection = this.handleInjection.bind(this);

    this.state = {
      inProgress: true,
    };
  }

  componentDidMount() {
    const { ownExtensionName, locale, translationUrl } = this.props;
    const dictionary = _.get(translation, ownExtensionName);

    i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      ns: [ownExtensionName],
      defaultNS: ownExtensionName,
      nsSeparator: false,
      keySeparator: false,
      resources: {
        en: {
          [ownExtensionName]: dictionary,
        },
      },
    });

    this.handleInjection(locale, translationUrl);
  }

  componentWillReceiveProps(nextProps) {
    const {
      locale: nextLocale,
      translationUrl: nextTranslationUrl,
    } = nextProps;
    const { locale, translationUrl } = this.props;

    if (translationUrl !== nextTranslationUrl || nextLocale !== locale) {
      this.handleInjection(nextLocale, nextTranslationUrl);
    }
  }

  async handleInjection(locale, translationUrl) {
    const { ownExtensionName } = this.props;

    if (translationUrl) {
      try {
        const response = await fetch(translationUrl);
        const translation = await response.json();
        const dictionary = _.get(translation, ownExtensionName);

        if (dictionary) {
          await i18next.addResourceBundle(locale, ownExtensionName, dictionary);
          await i18next.changeLanguage(locale);
        }
      } catch (error) {
        // do nothing
      }
    }

    this.setState({ inProgress: false });
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
  locale: PropTypes.string,
  translationUrl: PropTypes.string,
};

function mapStateToProps() {
  const ownExtensionName = pack.name;

  const dependency = _.get(i18n, `dependencies.${ownExtensionName}`);
  const locale = _.get(dependency, 'locale') || _.get(i18n, 'locale');
  const translationUrl =
    _.get(dependency, 'translationUrl') || _.get(i18n, 'translationUrl');

  return {
    ownExtensionName,
    locale,
    translationUrl,
  };
}

export default connect(mapStateToProps)(LocalizationProvider);
