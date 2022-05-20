import React from 'react';
import _ from 'lodash';
import { HeaderBackground } from '../components';

let HeaderStyles = null;

export function composeNavigationStyles(styleNames) {
  if (_.isEmpty(styleNames)) {
    return {};
  }

  if (!_.isArray(styleNames)) {
    console.warn(
      'composeNavigationStyles expects to receive array of string stylenames',
    );
    return {};
  }

  return _.reduce(
    styleNames,
    (result, styleName) => {
      const matchingStyle = HeaderStyles[styleName];

      if (matchingStyle) {
        const resolvedStyle = _.isFunction(matchingStyle)
          ? matchingStyle()
          : matchingStyle;
        return { ...result, ...resolvedStyle };
      }

      return result;
    },
    {},
  );
}

export function createNavigatonStyles(config) {
  const { theme, animationDriver, navBarSettings } = config;

  const {
    backgroundImage,
    showTitle,
    backgroundImageEnabledFirstScreen,
  } = navBarSettings;

  const shouldHideTitle =
    !_.isEmpty(backgroundImage) &&
    !showTitle &&
    !backgroundImageEnabledFirstScreen;

  const headerStyle = _.get(theme, 'shoutem.navigation.NavigationBar');

  if (!headerStyle) {
    return null;
  }

  const statusBarStyle = _.get(
    headerStyle,
    'statusBar.statusBarStyle.dropdownValue',
  );
  const resolvedStatusBarStyle =
    statusBarStyle === 'dark' ? 'dark-content' : 'light-content';
  const headerIconStyle = _.get(headerStyle, 'icon');
  const headerContainerStyle = _.get(headerStyle, 'container');
  const headerTitleStyle = {
    ..._.get(headerStyle, 'title'),
    ...(shouldHideTitle && { color: 'transparent' }),
  };
  const headerLeftContainerStyle = _.get(headerStyle, 'leftContainer');
  const headerRightContainerStyle = _.get(headerStyle, 'rightContainer');

  const headerClearStyle = _.get(headerStyle, ['.clear', 'container']);
  const headerSolidifyStyle = _.get(headerStyle, 'solidifyAnimation', () => {});
  const headerBoxingAnimation = _.get(headerStyle, 'boxingAnimation', () => {});
  const headerFadeAnimation = _.get(headerStyle, 'fadeAnimation', () => {});
  const headerTitleClearStyle = _.get(headerStyle, ['.clear', 'title']);

  const headerNoBorderStyle = _.get(headerStyle, ['.no-border', 'container']);

  const headerIconFeaturedStyle = _.get(headerStyle, ['.featured', 'icon']);
  const headerFeaturedStyle = _.get(headerStyle, ['.featured', 'container']);
  const headerFeaturedTitleStyle = _.get(headerStyle, ['.featured', 'title']);

  const defaultStyle = {
    headerStyle: headerContainerStyle,
    headerTitleStyle,
    headerTintColor: headerIconStyle,
    headerLeftContainerStyle,
    headerRightContainerStyle,
    headerBackground: () => (
      <HeaderBackground
        style={headerContainerStyle}
        settings={navBarSettings}
      />
    ),
  };

  const clearStyle = {
    ...defaultStyle,
    headerStyle: { ...headerContainerStyle, ...headerClearStyle },
    headerTitleStyle: { ...headerTitleStyle, ...headerTitleClearStyle },
    headerTransparent: true,
    headerBackground: undefined,
  };

  const noBorderStyle = {
    ...defaultStyle,
    headerStyle: { ...headerContainerStyle, ...headerNoBorderStyle },
  };

  const featuredStyle = {
    ...defaultStyle,
    headerTintColor: { ...headerIconStyle, ...headerIconFeaturedStyle },
    headerStyle: { ...headerContainerStyle, ...headerFeaturedStyle },
    headerTitleStyle: {
      ...headerTitleStyle,
      ...headerFeaturedTitleStyle,
      ...(shouldHideTitle && { color: 'transparent' }),
    },
    headerBackground: () => (
      <HeaderBackground
        settings={navBarSettings}
        style={{ ...headerContainerStyle, ...headerFeaturedStyle }}
      />
    ),
  };

  const solidify = () => ({
    ...defaultStyle,
    headerTitleStyle: {
      ...headerTitleStyle,
      ...headerSolidifyStyle(animationDriver).title,
    },
    headerBackground: () => (
      <HeaderBackground
        settings={navBarSettings}
        style={headerSolidifyStyle(animationDriver).container}
      />
    ),
  });

  const fade = () => ({
    ...solidify(),
    headerBackground: () => (
      <HeaderBackground
        settings={navBarSettings}
        style={{
          ...headerSolidifyStyle(animationDriver).container,
          ...headerFadeAnimation(animationDriver).container,
        }}
      />
    ),
  });

  const boxing = () => ({
    ...defaultStyle,
    headerStyle: {
      ...headerContainerStyle,
      ...headerBoxingAnimation(animationDriver).container,
    },
    headerTitleStyle: {
      ...headerTitleStyle,
      ...headerBoxingAnimation(animationDriver).title,
    },
    headerBackground: () => (
      <HeaderBackground
        settings={navBarSettings}
        style={{
          ...headerContainerStyle,
          ...headerBoxingAnimation(animationDriver).container,
        }}
      />
    ),
  });

  HeaderStyles = {
    default: defaultStyle,
    clear: clearStyle,
    noBorder: noBorderStyle,
    featured: featuredStyle,
    statusBarStyle: resolvedStatusBarStyle,
    solidify,
    boxing,
    fade,
  };

  return HeaderStyles;
}

export { HeaderStyles };
