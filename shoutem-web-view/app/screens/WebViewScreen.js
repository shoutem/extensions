import React from 'react';
import {
  WebView,
  InteractionManager,
} from 'react-native';

import { View, Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import NavigationToolbar from '../components/NavigationToolbar';

export default class WebViewScreen extends React.Component {
  static propTypes = {
    url: React.PropTypes.string,
    title: React.PropTypes.string,
    showNavigationToolbar: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.reload = this.reload.bind(this);
    this.setWebViewRef = this.setWebViewRef.bind(this);
    this.renderNavigationBar = this.renderNavigationBar.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);

    this.state = {
      webNavigationState: {},
      isAnimationFinished: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isAnimationFinished: true });
    });
  }

  onNavigationStateChange(webState) {
    this.setState({
      webNavigationState: webState,
    });
  }

  setWebViewRef(ref) {
    this.webViewRef = ref;
  }

  goBack() {
    this.webViewRef.goBack();
  }

  goForward() {
    this.webViewRef.goForward();
  }

  reload() {
    this.webViewRef.reload();
  }

  isNavigationEnabled() {
    const { showNavigationToolbar } = this.props;
    const { webNavigationState } = this.state;

    const webNavigation = webNavigationState.canGoBack || webNavigationState.canGoForward;
    return showNavigationToolbar && webNavigation;
  }

  renderNavigationBar() {
    const { url, title } = this.props;

    return (
      <NavigationBar
        title={title}
        share={{
          title,
          link: url,
        }}
      />
    );
  }

  renderWebView() {
    const { url } = this.props;

    if (this.state.isAnimationFinished) {
      return (
        <WebView
          ref={this.setWebViewRef}
          source={{
            uri: url || 'http://www.google.com',
          }}
          scalesPageToFit
          onNavigationStateChange={this.onNavigationStateChange}
        />
      );
    }

    return (<View />);
  }

  renderWebNavigation() {
    if (!this.isNavigationEnabled()) {
      return null;
    }

    return (
      <NavigationToolbar
        webNavigationState={this.state.webNavigationState}
        goBack={this.goBack}
        goForward={this.goForward}
        reload={this.reload}
      />
    );
  }

  renderBrowser() {
    const webView = this.renderWebView();
    const webNavigationControls = this.renderWebNavigation();

    return (
      <View styleName="flexible">
        {webView}
        {webNavigationControls}
      </View>
    );
  }

  render() {
    return (
      <Screen>
        {this.renderNavigationBar()}
        {this.renderBrowser()}
      </Screen>
    );
  }
}
