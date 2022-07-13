import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import { Button, Text, View } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderTextButton } from 'shoutem.navigation';
import SmallPointCardView from '../components/SmallPointCardView';
import { ext } from '../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  PointsCardScreen,
} from './PointsCardScreen';

/**
 * Shows points card details for a single card loyalty program
 */
export class PointsSmallCardScreen extends PointsCardScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  getNavBarProps() {
    const { cashierInfo } = this.props;
    const {
      shortcut: { title: shortcutTitle },
    } = getRouteParams(this.props);

    const isUserACashier = _.has(cashierInfo, 'data');
    const title = isUserACashier
      ? I18n.t(ext('scanQrTitle')).toUpperCase()
      : shortcutTitle;

    return {
      title,
      headerRight: props => (
        <HeaderTextButton
          {...props}
          onPress={this.navigateToPointsHistoryScreen}
          title={I18n.t(ext('navigationHistoryButton'))}
        />
      ),
    };
  }

  renderBarcodeScanButton() {
    return (
      <Button
        styleName="secondary sm-gutter-vertical no-border"
        style={{ width: 160 }}
        onPress={this.scanBarCode}
      >
        <Text>{I18n.t(ext('scanBarcodeButton'))}</Text>
      </Button>
    );
  }

  renderPointsCardInfo() {
    const { cardId, cardState = {}, enableBarcodeScan } = this.props;
    const { points = 0 } = cardState;

    return (
      <View styleName="flexible vertical space-around md-gutter">
        <SmallPointCardView
          points={points}
          cardId={cardId}
          onPress={this.assignPoints}
        />
        <View styleName="sm-gutter horizontal v-center space-around">
          {enableBarcodeScan && this.renderBarcodeScanButton()}
          <Button
            styleName="md-gutter-vertical"
            style={{ width: 160 }}
            onPress={this.assignPoints}
          >
            <Text>{I18n.t(ext('collectPointsButton'))}</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('PointsSmallCardScreen'))(PointsSmallCardScreen)),
);
