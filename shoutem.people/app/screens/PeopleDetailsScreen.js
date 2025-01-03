import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Icon,
  Image,
  Screen,
  ScrollView,
  SimpleHtml,
  Text,
  Title,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { ext } from '../const';

export class PeopleDetailsScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions(this.getNavBarProps());
  }

  getNavBarProps() {
    const { person } = getRouteParams(this.props);

    const navBarStyles = person.image
      ? { ...composeNavigationStyles(['clear', 'solidify']) }
      : { ...composeNavigationStyles(['boxing']) };

    return {
      ...navBarStyles,
      title: '',
    };
  }

  renderImage() {
    const { person } = getRouteParams(this.props);

    return person.image ? (
      <Image
        animationName="hero"
        styleName="large-square placeholder"
        source={{ uri: person.image && person.image.url }}
      />
    ) : (
      <View styleName="sm-gutter-top" />
    );
  }

  renderFooterButtons() {
    const { person } = getRouteParams(this.props);

    return (
      <View styleName="flexible horizontal h-center">
        <View styleName="flexible horizontal wrap h-start">
          {this.renderLinkButton(
            'web',
            I18n.t('shoutem.cms.websiteButton'),
            person.websiteUrl,
          )}
          {this.renderLinkButton(
            'call',
            I18n.t('shoutem.cms.phoneButton'),
            person.phone ? `tel:${person.phone}` : null,
          )}
          {this.renderLinkButton('tweet', 'X (Twitter)', person.twitterPageUrl)}
          {this.renderLinkButton(
            'linkedin',
            'LinkedIn',
            person.linkedinProfileUrl,
          )}
          {this.renderLinkButton(
            'facebook',
            'Facebook',
            person.facebookProfileUrl,
          )}
          {this.renderLinkButton(
            'email',
            I18n.t('shoutem.cms.emailButton'),
            person.email ? `mailto:${person.email}` : null,
          )}
        </View>
      </View>
    );
  }

  renderLinkButton(icon, name, url) {
    if (!url) return null; // field is empty

    const { person } = getRouteParams(this.props);
    const fullName = `${person.firstName} ${person.lastName}`;

    if (icon === 'email' || icon === 'call') {
      return (
        <Button
          styleName="stacked clear tight"
          onPress={() => Linking.openURL(url)}
        >
          <Icon name={icon} />
          <Text>{name}</Text>
        </Button>
      );
    }

    return (
      <Button
        styleName="stacked clear tight"
        onPress={() => openURL(url, fullName)}
      >
        <Icon name={icon} />
        <Text>{name}</Text>
      </Button>
    );
  }

  render() {
    const { person } = getRouteParams(this.props);
    const fullName = `${person.firstName} ${person.lastName}`.toUpperCase();

    return (
      <Screen styleName="paper">
        <ScrollView>
          {this.renderImage()}
          <View styleName="solid">
            <View styleName="vertical xl-gutter-top lg-gutter-bottom md-gutter-horizontal">
              <Title styleName="h-center md-gutter-bottom">{fullName}</Title>
              <Caption styleName="h-center">{person.profession}</Caption>
            </View>

            <SimpleHtml body={person.biography} />
          </View>

          {this.renderFooterButtons()}
        </ScrollView>
      </Screen>
    );
  }
}

PeopleDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('PeopleDetailsScreen'))(PeopleDetailsScreen);
