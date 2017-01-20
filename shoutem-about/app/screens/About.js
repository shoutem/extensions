import React from 'react';
import { Linking, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import {
  Title,
  Image,
  Text,
  View,
  Divider,
  Caption,
  Button,
  Icon,
  Screen,
  Overlay,
  Subtitle,
  TouchableOpacity,
  Spinner,
  ScrollView,
} from '@shoutem/ui';
import {
  EmptyStateView,
  RichMedia,
  InlineMap,
} from '@shoutem/ui-addons';
import { navigateTo as navigateToAction } from '@shoutem/core/navigation';
import {
  isValid,
  isBusy,
  isError,
  find as findAction,
  getCollection,
} from '@shoutem/redux-io';
import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';

import { openURL as openUrlAction } from 'shoutem.web-view';

import { ext } from '../const';

export class About extends React.Component {
  static propTypes = {
    aboutInfo: React.PropTypes.object,
    find: React.PropTypes.func,
    openURL: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
    data: React.PropTypes.array,
    parentCategoryId: React.PropTypes.any,
    title: React.PropTypes.string,
  };

  componentDidMount() {
    this.fetchData();
  }

  getNavigationBarProps(aboutInfo) {
    const hasImage = !!aboutInfo.image;

    if (hasImage) {
      StatusBar.setBarStyle('light-content');
    }

    return {
      title: _.get(aboutInfo, 'name'),
      styleName: hasImage ? 'fade clear' : '',
      animationName: hasImage ? 'solidify' : 'boxing',
      share: {
        title: _.get(aboutInfo, 'name'),
        text: _.get(aboutInfo, 'info'),
        link: _.get(aboutInfo, 'web'),
      },
    };
  }

  fetchData() {
    const { find, parentCategoryId } = this.props;

    find(ext('About'), undefined, {
      'filter[categories]': parentCategoryId,
    });
  }

  renderImage(aboutInfo) {
    return (aboutInfo && aboutInfo.image ?
      <Image
        styleName="large"
        source={{ uri: aboutInfo.image.url }}
        defaultSource={require('../assets/images/image-fallback.png')}
        animationName="hero"
      />
      : <View styleName="xl-gutter-top"><Divider /></View>);
  }

  renderTitle(aboutInfo) {
    const extraSpace = aboutInfo.image ? null : 'xl-gutter-bottom';

    return (aboutInfo && aboutInfo.name ?
      <View styleName={extraSpace}>
        <Title styleName="xl-gutter-top lg-gutter-bottom h-center">
          {aboutInfo.name.toUpperCase()}
        </Title>
      </View>
      : null);
  }

  renderInfo(aboutInfo) {
    return (aboutInfo && aboutInfo.info ?
      <RichMedia body={aboutInfo.info} attachments={aboutInfo.attachments} /> : null);
  }

  renderMap(aboutInfo) {
    const { navigateTo } = this.props;

    if (aboutInfo && aboutInfo.latitude && aboutInfo.longitude) {
      const marker = {
        latitude: parseFloat(aboutInfo.latitude),
        longitude: parseFloat(aboutInfo.longitude),
        title: aboutInfo.address,
      };

      const openMap = () => navigateTo({
        screen: ext('Map'),
        props: { marker, title: aboutInfo.name },
      });

      return (
        <View styleName="collapsed">
          <Divider styleName="section-header">
            <Caption>LOCATION</Caption>
          </Divider>

          <TouchableOpacity onPress={openMap}>
            <InlineMap
              initialRegion={{
                longitude: marker.longitude,
                latitude: marker.latitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03 }}
              markers={[marker]}
              selectedMarker={marker}
              style={{ height: 160 }}
            >
              <Overlay styleName="fill-parent secondary">
                <View styleName="vertical v-center h-center">
                  <Subtitle>{aboutInfo.name}</Subtitle>
                  <Caption>{aboutInfo.address}</Caption>
                </View>
              </Overlay>
            </InlineMap>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  renderOpeningHours(aboutInfo) {
    return (aboutInfo && aboutInfo.hours ?
      <View styleName="vertical">
        <Divider styleName="section-header">
          <Caption>OPENING HOURS</Caption>
        </Divider>

        <RichMedia body={aboutInfo.hours} />

        <Divider />
      </View>
      : null);
  }

  renderSocialButton(name, url, title, iconName = null) {
    const { openURL } = this.props;

    if (name === 'Phone' || name === 'Email') {
      return (
        <Button styleName="stacked clear tight" onPress={() => Linking.openURL(url)}>
          <Icon name={iconName || name.toLowerCase()} />
          <Text>{name}</Text>
        </Button>
      );
    }

    return (
      <Button styleName="stacked clear tight" onPress={() => openURL(url, title)}>
        <Icon name={iconName || name.toLowerCase()} />
        <Text>{name}</Text>
      </Button>
    );
  }

  renderFooterButtons(aboutInfo) {
    const web = this.renderSocialButton('Web', aboutInfo.web, aboutInfo.name);
    const twitter = this.renderSocialButton('Twitter', aboutInfo.twitter, aboutInfo.name, 'tweet');
    const linkedin = this.renderSocialButton('Linkedin', aboutInfo.linkedin, aboutInfo.name);
    const facebook = this.renderSocialButton('Facebook', aboutInfo.facebook, aboutInfo.name);
    /* eslint-disable max-len */
    const phone = this.renderSocialButton('Phone', `tel:${aboutInfo.phone}`, aboutInfo.name, 'call');
    const mail = this.renderSocialButton('Email', `mailto:${aboutInfo.mail}`, aboutInfo.name, 'email');

    return (aboutInfo ?
      <View styleName="center" style={{ width: 360 }}>
        <View styleName="horizontal h-start wrap">
          {aboutInfo.web ? web : null}

          {aboutInfo.phone ? phone : null}

          {aboutInfo.twitter ? twitter : null}

          {aboutInfo.mail ? mail : null}

          {aboutInfo.linkedin ? linkedin : null}

          {aboutInfo.facebook ? facebook : null}
        </View>
      </View>
      : null);
  }

  renderEmptyStateScreen(message) {
    return (
      <Screen>
        <NavigationBar title={this.props.title} />
        <EmptyStateView message={message} />
      </Screen>
    );
  }

  /**
   * Display screens depending on current data.
   * Those are: loading or empty data screen.
   */
  showInfoScreens() {
    const { data } = this.props;
    const validData = isValid(data);

    if (!validData || isBusy(data)) {
      // Data request is still ongoing
      return (
        <Screen styleName="full-screen paper">
          <NavigationBar styleName="clear" />
          <Spinner style={{ paddingTop: 95 }} />
        </Screen>);
    } else if (isError(data)) {
      return this.renderEmptyStateScreen('Unexpected error occurred.');
    } else if (data.length === 0 && validData) {
      // Request finished but no data
      return this.renderEmptyStateScreen('This screen has no content.');
    }
    return null;
  }

  render() {
    const { data } = this.props;
    const screen = this.showInfoScreens();
    // If valid data is retrieved, take first input only
    const aboutInfo = _.first(data);

    return (screen ||
      <Screen styleName="full-screen paper">
        <NavigationBar
          {...this.getNavigationBarProps(aboutInfo)}
        />

        <ScrollView>
          {this.renderImage(aboutInfo)}

          <View styleName="solid">
            {this.renderTitle(aboutInfo)}

            {this.renderInfo(aboutInfo)}

            {this.renderMap(aboutInfo)}

            {this.renderOpeningHours(aboutInfo)}

            {this.renderFooterButtons(aboutInfo)}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategoryId');

  return {
    data: getCollection(state[ext()].allAbout[parentCategoryId], state),
    parentCategoryId,
  };
};

export const mapDispatchToProps = {
  navigateTo: navigateToAction,
  openURL: openUrlAction,
  find: findAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('About'), {})(About)
);


