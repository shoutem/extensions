import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

import _ from 'lodash';

import {
  getCollection,
  isBusy,
  isInitialized,
  isValid,
 } from '@shoutem/redux-io';

import {
  navigateTo,
  openInModal,
 } from '@shoutem/core/navigation';

import {
  Button,
  Icon,
  Caption,
  Screen,
  ScrollView,
  Spinner,
  Title,
  Text,
  View,
  TouchableOpacity,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  getUser,
  loginRequired,
} from 'shoutem.auth';

import {
  getExtensionSettings,
} from 'shoutem.application';

import { I18n } from 'shoutem.i18n';

import { QRCodeScanner, navigateToQRCodeScannerScreen } from 'shoutem.camera';

import { ext } from '../const';

import {
  fetchCashierInfo,
  getCardId,
  getSingleCardState,
} from '../redux';

import {
  authorizeTransactionByBarCode,
  authorizeTransactionByQRCode,
  refreshCardState,
  refreshTransactions,
} from '../services';

import NoProgramScreen from './NoProgramScreen';
import TransactionHistoryView from '../components/TransactionHistoryView';

import {
  cashierShape,
  transactionShape,
 } from '../components/shapes';

const { arrayOf, bool, func, number, shape, string, object } = PropTypes;

/**
 * Shows points card details for a single card loyalty program
 */
export class PointsCardScreen extends React.Component {
  static propTypes = {
    // Assigns points to card when the user scans a bar code
    authorizeTransactionByBarCode: func.isRequired,
    // Assigns points to card when cashier scans a QR code
    authorizeTransactionByQRCode: func.isRequired,
    // Card ID for user's loyalty card
    cardId: string,
    // Card state, with points
    cardState: shape({
      points: number,
    }),
    // Cashier info for this user, empty if he's not a cashier.
    // A cashier can scan a QR code and a user can see his points card info.
    cashierInfo: cashierShape,
    // True if the user can collect points by scanning a bar code, false otherwise
    enableBarcodeScan: bool,
    // Navigates to points history screen
    navigateTo: func,
    // Opens the assign points flow in a modal dialog
    openInModal: func,
    // ID of loyalty program for this extension
    programId: string,
    // Refreshes loyalty card points
    refreshCardState: func,
    // Refreshes loyalty card transactions
    refreshTransactions: func,
    // Recent transactions
    transactions: arrayOf(transactionShape),
    // logged in user
    user: object,
  };

  constructor(props) {
    super(props);

    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.assignPoints = this.assignPoints.bind(this);
    this.handleScanCode = this.handleScanCode.bind(this);
    this.navigateToPointsHistoryScreen = this.navigateToPointsHistoryScreen.bind(this);
    this.onBarCodeScanned = this.onBarCodeScanned.bind(this);
    this.refreshCardState = this.refreshCardState.bind(this);
    this.scanBarCode = this.scanBarCode.bind(this);
    this.checkData = this.checkData.bind(this);
    this.toggleScanner = this.toggleScanner.bind(this);
    this.renderQRCodeScanner = this.renderQRCodeScanner.bind(this);

    this.state = {
      isScannerActive: true,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { user } = props;
    const { user: nextUser } = nextProps;

    if (nextUser !== user && isValid(nextUser)) {
      return this.refreshCardState();
    }
  }

  renderCloseScannerButton() {
    return(
      <View styleName="container" virtual>
        <Button onPress={this.toggleScanner}>
          <Icon name="close" />
        </Button>
      </View>
    );
  }

  getNavBarProps() {
    const { isScannerActive } = this.state;
    const { cashierInfo } = this.props;
    const isUserACashier = _.has(cashierInfo, 'data');

    if (!isUserACashier) {
      return {
        title: I18n.t(ext('myCardScreenNavBarTitle')).toUpperCase(),
      };
    }
    else if (!isScannerActive) {
      return {
        title: I18n.t(ext('scanQrTitle')).toUpperCase(),
        renderRightComponent: () => null,
      };
    }

    return {
      title: I18n.t(ext('scanQrTitle')).toUpperCase(),
      renderRightComponent: () => this.renderCloseScannerButton(),
    };
  }

  assignPoints() {
    const { openInModal } = this.props;

    openInModal({
      screen: ext('PinVerificationScreen'),
    });
  }

  handleScanCode(code) {
    const { authorizeTransactionByQRCode } = this.props;

    this.toggleScanner();
    authorizeTransactionByQRCode(code.data);
  }

  navigateToPointsHistoryScreen() {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('PointsHistoryScreen'),
    });
  }

  scanBarCode() {
    const { navigateToQRCodeScannerScreen } = this.props;

    navigateToQRCodeScannerScreen(this.onBarCodeScanned, I18n.t(ext('scanBarcodeNavBarTitle')));
  }

  onBarCodeScanned(code) {
    if (!code.data) {
      return;
    }

    const { authorizeTransactionByBarCode } = this.props;

    authorizeTransactionByBarCode(code.data);
  }

  refreshCardState() {
    const { refreshCardState, refreshTransactions } = this.props;

    refreshCardState();
    refreshTransactions();
  }

  renderBarcodeScanButton() {
    return (
      <Button
        styleName="sm-gutter-vertical"
        style={{ width: 160 }}
        onPress={this.scanBarCode}
      >
        <Text>{I18n.t(ext('scanBarcodeButton'))}</Text>
      </Button>
    );
  }

  renderPointsCardInfo() {
    const { cardId, cardState = {}, cardStates, enableBarcodeScan, transactions, style } = this.props;
    const { points = 0 } = cardState;

    const isRefreshingPoints = isBusy(cardStates);
    const pointsButtonStyleName = `secondary md-gutter-vertical ${isRefreshingPoints && 'muted'}`;

    return (
      <Screen>
        <ScrollView>
          <View
            styleName="content sm-gutter solid vertical h-center"
            style={style.qrBackground}
          >
            <TouchableOpacity onPress={this.assignPoints}>
              <QRCode
                size={160}
                value={JSON.stringify([cardId])}
              />
            </TouchableOpacity>
            <Caption styleName="h-center sm-gutter">{I18n.t(ext('myCardScreenPointsTitle'))}</Caption>
            <Title styleName="h-center">{points}</Title>
            <Button
              styleName={pointsButtonStyleName}
              style={{ width: 160 }}
              onPress={this.refreshCardState}
            >
              <Text>{I18n.t(ext('refreshButton'))}</Text>
            </Button>
            {enableBarcodeScan && this.renderBarcodeScanButton()}
          </View>
          <TransactionHistoryView
            onShowHistory={this.navigateToPointsHistoryScreen}
            transactions={transactions}
          />
        </ScrollView>
      </Screen>
    );
  }

  toggleScanner() {
    const { isScannerActive } = this.state;

    this.setState({ isScannerActive: !isScannerActive });
  }

  renderScanButton() {
    return (
      <View styleName="fill-parent vertical v-center h-center">
        <Button
          onPress={this.toggleScanner}
          styleName="secondary"
          style={{ width: 160 }}
        >
          <Text>{I18n.t(ext('scanQrButton'))}</Text>
        </Button>
      </View>
    );
  }

  renderQRCodeScanner() {
    const { isScannerActive } = this.state;

    if (!isScannerActive) {
      return this.renderScanButton();
    }

    return (
      <QRCodeScanner
        onQRCodeScanned={this.handleScanCode}
      />
    );
  }

  renderContent() {
    const { cashierInfo } = this.props;

    if (!isInitialized(cashierInfo)) {
      return <Spinner styleName="xl-gutter-top" />;
    }

    const isUserACashier = _.has(cashierInfo, 'data');

    return isUserACashier ? this.renderQRCodeScanner() : this.renderPointsCardInfo();
  }

  renderScreen() {
    return (
      <Screen>
      <NavigationBar {...this.getNavBarProps()} />
        {this.renderContent()}
      </Screen>
    );
  }

  render() {
    const { programId } = this.props;

    return programId ? this.renderScreen() : (<NoProgramScreen />);
  }
}

export const mapStateToProps = (state) => {
  const { allCardStates, allTransactions, cashierInfo } = state[ext()];

  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');
  const enableBarcodeScan = _.get(extensionSettings, 'enableBarcodeScan');

  const user = getUser(state);

  return {
    cardId: getCardId(state),
    cardStates: getCollection(allCardStates, state),
    cardState: getSingleCardState(state),
    cashierInfo,
    enableBarcodeScan,
    programId,
    transactions: getCollection(allTransactions, state),
    user,
  };
};

export const mapDispatchToProps = {
  authorizeTransactionByBarCode,
  authorizeTransactionByQRCode,
  navigateToQRCodeScannerScreen,
  fetchCashierInfo,
  refreshCardState,
  refreshTransactions,
  navigateTo,
  openInModal,
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PointsCardScreen'))(PointsCardScreen),
));
