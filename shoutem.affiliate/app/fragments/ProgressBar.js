import React from 'react';
import { Linking, Platform, Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Spinner, Text, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { GaugeProgressBar } from '../components';
import { ext } from '../const';
import {
  getCollectMessage,
  getLevels,
  getLoading,
  getShareMessage,
  refreshCardState,
} from '../redux';

const IS_IOS = Platform.OS === 'ios';

export function ProgressBar(props) {
  const { points, maxLevelPoints, style } = props;
  const {
    progressRadius: radius,
    progressContainer: { height: progressHeight, width: progressWidth },
  } = style;

  const dispatch = useDispatch();

  const levels = useSelector(getLevels);
  const isLoading = useSelector(getLoading);

  const shareMessage = useSelector(getShareMessage);
  const { collectPhoneNumber, collectMessage } = useSelector(getCollectMessage);

  function handleRefreshCardState() {
    dispatch(refreshCardState());
  }

  function handleSharePress() {
    return Share.share({ message: shareMessage });
  }

  function handleCollectPress() {
    const smsDivider = IS_IOS ? '&' : '?';
    const url = `sms:${collectPhoneNumber}${smsDivider}body=${collectMessage}`;

    return Linking.openURL(url);
  }

  return (
    <View styleName="vertical">
      <View style={style.container} styleName="vertical v-center h-center">
        <GaugeProgressBar
          height={progressHeight}
          maxValue={maxLevelPoints}
          progressValue={points}
          radius={radius}
          levels={levels}
          width={progressWidth}
          style={style}
        />
        <View styleName="vertical h-center" style={style.pointsLabel}>
          {isLoading && <Spinner isLoading={isLoading} />}
          {!isLoading && (
            <>
              <Title>{points}</Title>
              <Text>{_.toUpper(I18n.t(ext('points')))}</Text>
              <Button onPress={handleRefreshCardState} styleName="clear">
                <Icon name="refresh" style={style.refreshIcon} />
                <Text>{I18n.t(ext('refreshButton'))}</Text>
              </Button>
            </>
          )}
        </View>
      </View>
      <View styleName="horizontal h-center">
        <View styleName="horizontal h-center">
          <Button
            styleName="secondary md-gutter-right"
            onPress={handleSharePress}
          >
            <Text>{I18n.t(ext('shareCodeButton'))}</Text>
          </Button>

          <Button onPress={handleCollectPress}>
            <Text>{I18n.t(ext('collectPointsButton'))}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

ProgressBar.propTypes = {
  maxLevelPoints: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('ProgressBar'))(ProgressBar);
