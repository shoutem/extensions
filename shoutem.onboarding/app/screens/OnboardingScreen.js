import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  EmptyListImage,
  HorizontalPager,
  ImageBackground,
  PageIndicators,
  Text,
  View,
} from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, goBack } from 'shoutem.navigation';
import { images } from '../assets';
import { ImageContent, TextContent } from '../components';
import { ext } from '../const';
import { setOnboardingCompleted } from '../redux';

function OnboardingScreen({
  navigation,
  route: {
    params: { onOnboardingCompleted },
  },
  style,
}) {
  const dispatch = useDispatch();

  const extensionSettings = useSelector(state =>
    getExtensionSettings(state, ext()),
  );
  const pages = _.get(extensionSettings, 'pageSettings', []);

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      headerLeft: null,
      title: '',
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });
  }, [navigation]);

  function closeModal() {
    goBack();
    dispatch(setOnboardingCompleted({ onOnboardingCompleted }));
  }

  function renderOverlay() {
    return (
      <View style={style.footerContainer}>
        <PageIndicators
          activeIndex={currentPage}
          count={pages.length}
          style={style.pageIndicators}
        />
        <Button style={style.button} onPress={closeModal}>
          <Text>{I18n.t(ext('getStartedLabel'))}</Text>
        </Button>
      </View>
    );
  }

  function renderPage(page, index) {
    const { title, description, featuredImageUrl = null, textPosition } = page;
    const hasFeaturedImage = !!featuredImageUrl;

    return (
      <ImageBackground
        source={images[`image${index}`]}
        style={style.imageBackground}
        imageStyle={style.image}
      >
        <View styleName="fill-parent" style={style.container}>
          {hasFeaturedImage && (
            <ImageContent
              title={title}
              description={description}
              featuredImage={images[`featuredImage${index}`]}
              textPosition={textPosition}
            />
          )}
          {!hasFeaturedImage && (
            <TextContent
              title={title}
              description={description}
              textPosition={textPosition}
            />
          )}
        </View>
      </ImageBackground>
    );
  }

  if (pages.length === 0) {
    return (
      <EmptyListImage
        title={I18n.t(ext('noPagesTitle'))}
        message={I18n.t(ext('noPagesMessage'))}
      />
    );
  }

  return (
    <View>
      <HorizontalPager
        bounces
        data={pages}
        onIndexSelected={setCurrentPage}
        renderOverlay={renderOverlay}
        renderPage={renderPage}
        selectedIndex={currentPage}
      />
    </View>
  );
}

OnboardingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onOnboardingCompleted: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  style: PropTypes.object,
};

OnboardingScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('OnboardingScreen'))(OnboardingScreen);
