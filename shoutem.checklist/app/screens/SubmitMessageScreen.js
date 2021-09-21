import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Icon,
  Image,
  ImageBackground,
  Screen,
  ScrollView,
  Text,
  Tile,
  Title,
} from '@shoutem/ui';
import { getShortcut } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { goBack, getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';

export class SubmitMessageScreen extends PureComponent {
  static propTypes = {
    contactEmail: PropTypes.string,
    imageUrl: PropTypes.string,
    imageOverlayMessage: PropTypes.string,
    navigateBack: PropTypes.func,
    style: PropTypes.object,
    submitMessage: PropTypes.string,
    submitMessageTitle: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  getNavBarProps() {
    return {
      headerLeft: () => null,
    };
  }

  openEmailUrl() {
    const { contactEmail } = this.props;

    Linking.openURL(`mailto:${contactEmail}`);
  }

  render() {
    const {
      contactEmail,
      imageUrl,
      imageOverlayMessage,
      style,
      submitMessage,
      submitMessageTitle,
    } = this.props;

    const hasImageOverlayMessage = !!imageOverlayMessage;
    const contentContainerStyle = contactEmail
      ? style.scrollViewContainerTwoButtons
      : style.scrollViewContainerOneButton;

    return (
      <Screen>
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          endFillColor={style.endFillColor}
        >
          {hasImageOverlayMessage && (
            <ImageBackground
              source={{ uri: imageUrl }}
              styleName="large-square placeholder"
            >
              <Tile>
                <Title style={style.overlayText}>
                  {imageOverlayMessage.toUpperCase()}
                </Title>
              </Tile>
            </ImageBackground>
          )}
          {!hasImageOverlayMessage && (
            <Image source={{ uri: imageUrl }} styleName="large placeholder" />
          )}
          <Title styleName="lg-gutter-top md-gutter-horizontal">
            {submitMessageTitle}
          </Title>
          <Text styleName="md-gutter">{submitMessage}</Text>
        </ScrollView>
        {contactEmail && (
          <Button onPress={this.openEmailUrl} style={style.contactButton}>
            <Text style={style.contactButtonText}>
              {I18n.t(ext('contactButton'))}
            </Text>
            <Icon
              fill={style.contactButtonIconFill}
              name="right-arrow"
              style={style.contactButtonIcon}
            />
          </Button>
        )}
        <Button onPress={goBack} style={style.goBackButton}>
          <Text style={style.goBackButtonText}>
            {I18n.t(ext('goBackButton'))}
          </Text>
        </Button>
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shortcutId } = getRouteParams(ownProps);

  const shortcut = getShortcut(state, shortcutId);
  const { settings = {} } = shortcut;

  const contactEmail = settings?.contactEmail;
  const imageUrl = settings?.imageUrl;
  const imageOverlayMessage = settings?.imageOverlayMessage;
  const submitMessage = settings?.submitMessage;
  const submitMessageTitle = settings?.submitMessageTitle;
  const title = shortcut?.title;

  return {
    contactEmail,
    imageUrl,
    imageOverlayMessage,
    submitMessage,
    submitMessageTitle,
    title,
  };
};

export default connect(
  mapStateToProps,
  null,
)(connectStyle(ext('SubmitMessageScreen'))(SubmitMessageScreen));
