import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { i18n } from 'environment';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import pack from '../../../package.json';
import translation from '../../../translations/en.json';

export class LocalizationProvider extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

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

  componentDidUpdate(prevProps) {
    const { locale, translationUrl } = this.props;
    const {
      locale: prevLocale,
      translationUrl: prevTranslationUrl,
    } = prevProps;

    if (translationUrl !== prevTranslationUrl || prevLocale !== locale) {
      this.handleInjection(locale, translationUrl);
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
  locale: PropTypes.string,
  ownExtensionName: PropTypes.string,
  translationUrl: PropTypes.string,
};

LocalizationProvider.defaultProps = {
  children: undefined,
  locale: undefined,
  ownExtensionName: undefined,
  translationUrl: undefined,
};

function mapStateToProps() {
  const ownExtensionName = pack.name;
  const locale = _.get(i18n, 'locale');
  const translationUrl = _.get(i18n, 'translationUrl');

  return {
    ownExtensionName,
    locale,
    translationUrl,
  };
}

export default connect(mapStateToProps)(LocalizationProvider);
