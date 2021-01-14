import React, { PureComponent } from 'react';
import autoBind from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  EmptyListImage,
  HorizontalPager,
  Icon,
  ImageBackground,
  PageIndicators,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { closeModal, NavigationBar } from 'shoutem.navigation';
import { ext } from '../const';
import { setOnboardingCompleted } from '../redux'
import { StyleOptions } from '../services'

export class OnboardingScreen extends PureComponent {
  static propTypes = {
    closeModal: PropTypes.func,
    pages: PropTypes.array,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      currentPage: 0,
    };
  }

  getNavbarProps() {
    const { currentPage } = this.state;
    const { pages } = this.props;

    const lastPage = _.size(pages) === currentPage + 1;
    const navBarText = lastPage ? I18n.t(ext('continueButtonLabel')) : I18n.t(ext('skipButtonLabel'));

    return {
      styleName: 'clear',
      renderRightComponent: () => (
        <View styleName="container" virtual>
          <Button onPress={this.closeModal}>
            <Text>{navBarText}</Text>
            <Icon name="right-arrow"></Icon>
          </Button>
        </View>
      ),
    };
  }

  closeModal() {
    const { closeModal, setOnboardingCompleted } = this.props;

    /* When user skips or finishes the onboarding we set oboardingFinished to true, 
    so it doesn't get displayed again */
    setOnboardingCompleted()
      .then(() => closeModal())
      .catch(() => closeModal());
  }

  setIndex(index) {
    this.setState({ currentPage: index });
  }

  renderOverlay() {
    const { currentPage } = this.state;
    const { style, pages } = this.props;

    return (
      <PageIndicators
        activeIndex={currentPage}
        count={_.size(pages)}
        style={style.pageIndicators}
      />
    );
  }

  renderPage(page) {
    const { style } = this.props;
    const { title, description, imageUrl, textPosition } = page;

    const textPositionStyle = StyleOptions.resolveTextPositionStyle(textPosition, style);

    return (
      <ImageBackground
        source={{ uri: imageUrl }}
        style={style.imageBackground}
      >
        <View
          style={textPositionStyle}
          styleName="fill-parent md-gutter">
          <Subtitle numberOfLines={1} styleName="sm-gutter-bottom h-center">
            {title.toUpperCase()}
          </Subtitle>
          <Text numberOfLines={3} styleName="h-center">
            {description}
          </Text>
        </View>
      </ImageBackground>
    );
  }

  render() {
    const { currentPage } = this.state;
    const { pages } = this.props;

    if (_.isEmpty(pages)) {
      return <EmptyListImage />
    }

    return (
      <View>
        <NavigationBar {...this.getNavbarProps()} />
        <HorizontalPager
          bounces
          data={pages}
          onIndexSelected={this.setIndex}
          renderOverlay={this.renderOverlay}
          renderPage={this.renderPage}
          selectedIndex={currentPage}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const extensionSettings = getExtensionSettings(state, ext());
  const pages = _.get(extensionSettings, 'pageSettings', []);

  return {
    pages,
  };
}
const mapDispatchToProps = {
  closeModal,
  setOnboardingCompleted,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('OnboardingScreen'))(OnboardingScreen),
);
