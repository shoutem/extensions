import React, { PureComponent } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  getCollection,
  isBusy,
  isInitialized,
  isValid,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Screen,
  ScrollView,
  Spinner,
  Text,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { getUser, loginRequired } from 'shoutem.auth';
import { navigateToQRCodeScannerScreen, QRCodeScanner } from 'shoutem.camera';
import { I18n } from 'shoutem.i18n';
import {
  getRouteParams,
  HeaderBackButton,
  HeaderIconButton,
  navigateTo,
  openInModal,
} from 'shoutem.navigation';
import { cashierShape, transactionShape } from '../components/shapes';
import TransactionHistoryView from '../components/TransactionHistoryView';
import { ext } from '../const';
import { fetchCashierInfo, getCardId, getSingleCardState } from '../redux';
import {
  authorizeTransactionByBarCode,
  authorizeTransactionByQRCode,
  refreshCardState,
  refreshTransactions,
} from '../services';
import NoProgramScreen from './NoProgramScreen';

/**
 * Shows points card details for a single card loyalty program
 */
export class PointsCardScreen extends PureComponent {
  static propTypes = {
    // Assigns points to card when the user scans a bar code
    authorizeTransactionByBarCode: PropTypes.func.isRequired,
    // Assigns points to card when cashier scans a QR code
    authorizeTransactionByQRCode: PropTypes.func.isRequired,
    // Card ID for user's loyalty card
    cardId: PropTypes.string,
    // Card state, with points
    cardState: PropTypes.shape({
      points: PropTypes.number,
    }),
    // Cashier info for this user, empty if he's not a cashier.
    // A cashier can scan a QR code and a user can see his points card info.
    cashierInfo: cashierShape,
    // True if the user can collect points by scanning a bar code, false otherwise
    enableBarcodeScan: PropTypes.bool,
    // ID of loyalty program for this extension
    programId: PropTypes.string,
    // Refreshes loyalty card points
    refreshCardState: PropTypes.func,
    // Refreshes loyalty card transactions
    refreshTransactions: PropTypes.func,
    // Recent transactions
    transactions: PropTypes.arrayOf(transactionShape),
    // logged in user
    user: PropTypes.object,
    cardStates: PropTypes.array,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      isScannerActive: true,
      isProcessingQRCodeData: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.checkData(this.props);

    navigation.setOptions({ ...this.getNavBarProps() });
  }

  componentDidUpdate(prevProps) {
    const { navigation, programId } = this.props;

    if (programId) {
      this.checkData(this.props, prevProps);
    }

    navigation.setOptions({ ...this.getNavBarProps() });
  }

  checkData(props = this.props, prevProps) {
    const { programId } = props;

    if (!programId) {
      return;
    }

    const { user } = props;
    const prevUser = _.get(prevProps, 'user');

    if (prevUser !== user && isValid(user)) {
      this.refreshCardState();
    }
  }

  renderCloseScannerButton(props) {
    return (
      <HeaderIconButton
        {...props}
        onPress={this.toggleScanner}
        iconName="close"
      />
    );
  }

  getNavBarProps() {
    const { isScannerActive, isProcessingQRCodeData } = this.state;
    const { cashierInfo } = this.props;
    const {
      shortcut: { title: shortcutTitle },
    } = getRouteParams(this.props);

    const isUserACashier = _.has(cashierInfo, 'data');
    const title = isUserACashier
      ? I18n.t(ext('scanQrTitle')).toUpperCase()
      : shortcutTitle;

    const hideLeftButton =
      isUserACashier && (isScannerActive || isProcessingQRCodeData);
    const showCloseScannerButton = isUserACashier && isScannerActive;
    const headerLeft = hideLeftButton
      ? () => null
      : props => <HeaderBackButton {...props} />;
    const headerRight = showCloseScannerButton
      ? this.renderCloseScannerButton
      : () => null;

    return {
      title,
      headerLeft,
      headerRight,
    };
  }

  assignPoints() {
    openInModal(ext('PinVerificationScreen'));
  }

  async handleScanCode(code) {
    const { isProcessingQRCodeData } = this.state;

    if (isProcessingQRCodeData) {
      return;
    }

    this.setState({
      isProcessingQRCodeData: true,
      isScannerActive: false,
    });

    const { authorizeTransactionByQRCode } = this.props;

    await authorizeTransactionByQRCode(code.data);

    // Delay the state change so that the screen change animations have enough
    // time to finish.
    setTimeout(() => {
      this.setState({ isProcessingQRCodeData: false });
    }, 2000);
  }

  navigateToPointsHistoryScreen() {
    navigateTo(ext('PointsHistoryScreen'));
  }

  scanBarCode() {
    navigateToQRCodeScannerScreen(
      this.onBarCodeScanned,
      I18n.t(ext('scanBarcodeNavBarTitle')),
    );
  }

  onBarCodeScanned(code) {
    if (!code.data) {
      return;
    }

    const { authorizeTransactionByBarCode } = this.props;

    authorizeTransactionByBarCode(code.data);
  }

  refreshCardState() {
    const { refreshCardState, refreshTransactions, programId } = this.props;

    if (programId) {
      refreshCardState();
      refreshTransactions();
    }
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
    const {
      cardId,
      cardState = {},
      cardStates,
      enableBarcodeScan,
      transactions,
      style,
    } = this.props;
    const { points = 0 } = cardState;

    const isRefreshingPoints = isBusy(cardStates);
    const pointsButtonStyleName = `secondary md-gutter-vertical ${isRefreshingPoints &&
      'muted'}`;

    return (
      <Screen>
        <ScrollView>
          <View
            styleName="content sm-gutter solid vertical h-center"
            style={style.qrBackground}
          >
            <TouchableOpacity onPress={this.assignPoints}>
              <QRCode size={160} value={JSON.stringify([cardId])} />
            </TouchableOpacity>
            <Caption styleName="h-center sm-gutter">
              {I18n.t(ext('myCardScreenPointsTitle'))}
            </Caption>
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
    const { isScannerActive, isProcessingQRCodeData } = this.state;

    if (isProcessingQRCodeData) {
      return (
        <View>
          <Caption styleName="xl-gutter-top h-center">
            {I18n.t(ext('processing'))}
          </Caption>
          <Spinner styleName="" />
        </View>
      );
    }

    if (!isScannerActive) {
      return this.renderScanButton();
    }

    return <QRCodeScanner onQRCodeScanned={this.handleScanCode} />;
  }

  renderContent() {
    const { cashierInfo } = this.props;

    if (!isInitialized(cashierInfo)) {
      return <Spinner styleName="xl-gutter-top" />;
    }

    const isUserACashier = _.has(cashierInfo, 'data');

    return isUserACashier
      ? this.renderQRCodeScanner()
      : this.renderPointsCardInfo();
  }

  renderScreen() {
    return <Screen>{this.renderContent()}</Screen>;
  }

  render() {
    const { programId, navigation } = this.props;

    if (!programId) {
      return <NoProgramScreen navigation={navigation} />;
    }

    return this.renderScreen();
  }
}

export const mapStateToProps = state => {
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
  fetchCashierInfo,
  refreshCardState,
  refreshTransactions,
};

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('PointsCardScreen'))(PointsCardScreen)),
);
