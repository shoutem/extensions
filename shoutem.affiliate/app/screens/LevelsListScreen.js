import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getCollection, isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Screen,
  ScrollView,
  Spinner,
  View,
} from '@shoutem/ui';
import { isAuthenticated, loginRequired } from 'shoutem.auth';
import { I18n, selectors as i18nSelectors } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { Banner, LevelItem } from '../components';
import { ext } from '../const';
import { ProgressBar } from '../fragments';
import { getCardPoints, loadLevels, refreshCardState } from '../redux';
import { getMaxLevelPoints } from '../services';

export class LevelsListScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { isLoggedIn: prevIsLoggedIn } = prevProps;
    const { isLoggedIn } = this.props;

    if (!prevIsLoggedIn && isLoggedIn) {
      this.fetchData();
    }
  }

  fetchData() {
    const {
      channelId,
      isLoggedIn,
      loadLevels,
      refreshCardState,
      parentCategoryId,
    } = this.props;

    loadLevels(channelId, parentCategoryId);

    if (isLoggedIn) {
      refreshCardState();
    }
  }

  handleLevelItemPress(level) {
    navigateTo(ext('LevelDetailsScreen'), {
      level,
    });
  }

  render() {
    const { data, style, points, maxLevelPoints } = this.props;

    const bannerConfig = _.get(
      getRouteParams(this.props),
      'shortcut.settings.bannerConfig',
      {},
    );
    const { showBanner, ...otherBannerConfig } = bannerConfig;
    const isBannerVisible = showBanner && !_.isEmpty(otherBannerConfig);

    const isDataLoading = isBusy(data) || !isInitialized(data);

    return (
      <Screen>
        {isBannerVisible && <Banner config={bannerConfig} />}
        <ScrollView>
          <View style={style.gaugeContainer}>
            <ProgressBar points={points} maxLevelPoints={maxLevelPoints} />
          </View>
          <View>
            <Divider styleName="section-header">
              <Caption>{I18n.t(ext('level')).toUpperCase()}</Caption>
            </Divider>
            <View>
              {/* We can't use ListView inside ScrollView. Using plain map
                  to handle this. Later, if we expect more than 20 items, we'll have to
                  use ListView for load more feature */}
              {isDataLoading && <Spinner style={style.spinner} />}
              {!isDataLoading &&
                data.map(level => (
                  <LevelItem
                    key={level.id}
                    level={level}
                    points={points}
                    onPress={this.handleLevelItemPress}
                  />
                ))}
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

LevelsListScreen.propTypes = {
  data: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  loadLevels: PropTypes.func.isRequired,
  maxLevelPoints: PropTypes.number.isRequired,
  parentCategoryId: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  refreshCardState: PropTypes.func.isRequired,
  channelId: PropTypes.number,
  style: PropTypes.object,
};

LevelsListScreen.defaultProps = {
  channelId: null,
  style: {},
};

const mapStateToProps = (state, ownProps) => {
  const channelId = i18nSelectors.getActiveChannelId(state);
  const parentCategoryId = _.get(
    ownProps,
    'route.params.shortcut.settings.parentCategory.id',
  );
  const collections = state[ext()].allLevels;
  const data = getCollection(collections[parentCategoryId], state);

  const points = getCardPoints(state);
  const maxLevelPoints = getMaxLevelPoints(data);

  return {
    channelId,
    data,
    isLoggedIn: isAuthenticated(state),
    maxLevelPoints,
    parentCategoryId,
    points,
  };
};

const mapDispatchToProps = { loadLevels, refreshCardState };

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('LevelsListScreen'))(LevelsListScreen)),
);
