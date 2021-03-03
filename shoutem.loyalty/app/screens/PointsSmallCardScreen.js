import React from 'react';
import { connect } from 'react-redux';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { Button, Subtitle, Text, View } from '@shoutem/ui';
import SmallPointCardView from '../components/SmallPointCardView';
import { ext } from '../const';
import {
  PointsCardScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PointsCardScreen';

/**
 * Shows points card details for a single card loyalty program
 */
export class PointsSmallCardScreen extends PointsCardScreen {
  constructor(props) {
    super(props);

    this.assignPoints = this.assignPoints.bind(this);
    this.handleScanCode = this.handleScanCode.bind(this);
    this.navigateToPointsHistoryScreen = this.navigateToPointsHistoryScreen.bind(
      this,
    );
    this.onBarCodeScanned = this.onBarCodeScanned.bind(this);
    this.refreshCardState = this.refreshCardState.bind(this);
    this.scanBarCode = this.scanBarCode.bind(this);
    this.renderRightComponent = this.renderRightComponent.bind(this);
  }

  renderRightComponent() {
    return (
      <View virtual styleName="container">
        <Button styleName="clear" onPress={this.navigateToPointsHistoryScreen}>
          <Subtitle>{I18n.t(ext('navigationHistoryButton'))}</Subtitle>
        </Button>
      </View>
    );
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
        <NavigationBar
          title={I18n.t(ext('myCardScreenNavBarTitle'))}
          renderRightComponent={this.renderRightComponent}
        />
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
