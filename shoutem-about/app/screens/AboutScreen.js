import React from 'react';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Title,
  Image,
  View,
  Divider,
  Caption,
  Subtitle,
  TouchableOpacity,
  ScrollView,
  Html,
} from '@shoutem/ui';
import {
  InlineMap,
} from '@shoutem/ui-addons';

import { connectStyle } from '@shoutem/theme';

import {
  isBusy,
  isInitialized,
} from '@shoutem/redux-io';

import { BaseAboutScreen, mapDispatchToProps, mapStateToProps } from './BaseAboutScreen';
import SocialButton from '../components/SocialButton';
import { ext } from '../const';

export class AboutScreen extends BaseAboutScreen {
  static propTypes = {
    ...BaseAboutScreen.propTypes,
    navigateTo: React.PropTypes.func,
    openURL: React.PropTypes.func,
  };

  getNavBarProps() {
    const { data, title, parentCategoryId } = this.props;

    if (!_.isUndefined(parentCategoryId) && (isBusy(data) || !isInitialized(data))) {
      // Do not show shortcut title in NavigationBar if still loading
      return {};
    }

    if (!data || _.isEmpty(data)) {
      // Show shortcut title if `EmptyStateView` is rendered (no collection or empty collection)
      return {
        title,
      };
    }

    const profile = _.first(data);
    const hasImage = !!profile.image;

    if (hasImage) {
      StatusBar.setBarStyle('light-content');
    }

    return {
      title: _.get(profile, 'name'),
      styleName: hasImage ? 'fade clear' : '',
      animationName: hasImage ? 'solidify' : 'boxing',
      share: _.isUndefined(profile, 'web') ? null : {
        title: _.get(profile, 'name'),
        link: _.get(profile, 'web'),
      },
    };
  }

  renderImage(profile, styleName) {
    if (!_.get(profile, 'image')) {
      return (
        <View styleName="xl-gutter-top">
          <Divider />
        </View>
      );
    }

    return (
      <Image
        styleName={styleName || 'large'}
        source={{ uri: profile.image.url }}
        defaultSource={require('../assets/images/image-fallback.png')}
        animationName="hero"
      />
    );
  }

  renderTitle(profile) {
    if (!_.get(profile, 'name')) {
      return null;
    }

    const extraSpace = profile.image ? null : 'xl-gutter-bottom';

    return (
      <View styleName={extraSpace}>
        <Title styleName="xl-gutter-top lg-gutter-bottom h-center">
          {profile.name.toUpperCase()}
        </Title>
      </View>
    );
  }

  renderInfo(profile) {
    if (!_.get(profile, 'info')) {
      return null;
    }

    return (
      <Html body={profile.info} />
    );
  }

  renderMap(profile) {
    const { navigateTo } = this.props;

    if (!_.get(profile, 'location.latitude') || !_.get(profile, 'location.longitude')) {
      return null;
    }

    const marker = {
      latitude: parseFloat(profile.location.latitude),
      longitude: parseFloat(profile.location.longitude),
      title: _.get(profile, 'location.formattedAddress'),
    };

    const initialRegion = {
      longitude: marker.longitude,
      latitude: marker.latitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    const openMap = () => navigateTo({
      screen: ext('MapScreen'),
      props: { marker, title: profile.name },
    });

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>LOCATION</Caption>
        </Divider>
        <TouchableOpacity onPress={openMap}>
          <InlineMap
            initialRegion={initialRegion}
            markers={[marker]}
            selectedMarker={marker}
            styleName="medium-tall"
          >
            <View styleName="overlay vertical v-center h-center fill-parent">
              <Subtitle>{profile.name}</Subtitle>
              <Caption>{_.get(profile, 'location.formattedAddress')}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderOpeningHours(profile) {
    if (!_.get(profile, 'hours')) {
      return null;
    }

    return (
      <View styleName="vertical">
        <Divider styleName="section-header">
          <Caption>OPENING HOURS</Caption>
        </Divider>
        <Html body={profile.hours} />
        <Divider />
      </View>
    );
  }

  renderFooterButtons(profile) {
    const { openURL } = this.props;
    if (!profile) {
      return null;
    }

    return (
      <View styleName="horizontal h-center">
        <View styleName="horizontal h-start wrap">
          <SocialButton
            icon="web"
            url={profile.web}
            title="Web"
            openURL={openURL}
          />
          <SocialButton
            icon="call"
            url={profile.phone && `tel:${profile.phone}`}
            title="Phone"
          />
          <SocialButton
            icon="tweet"
            url={profile.twitter}
            title="Twitter"
            openURL={openURL}
          />
          <SocialButton
            icon="email"
            url={profile.mail && `mailto:${profile.mail}`}
            title="Email"
          />
          <SocialButton
            icon="linkedin"
            url={profile.linkedin}
            title="LinkedIn"
            openURL={openURL}
          />
          <SocialButton
            icon="facebook"
            url={profile.facebook}
            title="Facebook"
            openURL={openURL}
          />
        </View>
      </View>
    );
  }

  renderAboutInfo(profile) {
    return (
      <ScrollView>
        {this.renderImage(profile)}
        <View styleName="solid">
          {this.renderTitle(profile)}
          {this.renderInfo(profile)}
          {this.renderMap(profile)}
          {this.renderOpeningHours(profile)}
          {this.renderFooterButtons(profile)}
          <Divider />
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('About'))(AboutScreen)
);
