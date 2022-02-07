import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Text, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';

function SubmissionCompletedScreen(props) {
  const { navigation, style } = props;
  const { onSubmitSuccess } = getRouteParams(props);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: I18n.t(ext('submissionCompletedTitle')),
        headerLeft: () => null,
      }),
    [navigation],
  );

  return (
    <Screen>
      <View styleName="flexible vertical h-center v-center md-gutter">
        <Title styleName="lg-gutter-bottom" style={style.title}>
          {I18n.t(ext('userProfileCompletedTitle'))}
        </Title>
        <Title style={style.description}>
          {I18n.t(ext('userProfileCompletedDescription'))}
        </Title>
        <Button styleName="xl-gutter-top" onPress={onSubmitSuccess}>
          <Text> {I18n.t(ext('goBackToAppButton'))}</Text>
        </Button>
      </View>
    </Screen>
  );
}

SubmissionCompletedScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

SubmissionCompletedScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('SubmissionCompletedScreen'))(
  SubmissionCompletedScreen,
);
