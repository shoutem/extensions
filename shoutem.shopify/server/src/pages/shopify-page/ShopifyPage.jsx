import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { FormGroup } from 'react-bootstrap';
import { Checkbox } from '@shoutem/react-web-ui';
import { connect } from 'react-redux';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import {
  ShopPreview,
  getShopifyCollections,
  loadShopifyCollections,
} from 'src/modules/shopify';
import { navigateToSettings } from 'src/redux';
import ShopifySettingsPage from '../shopify-settings-page';

class ShopifyPage extends Component {
  static propTypes = {
    store: PropTypes.string,
    apiKey: PropTypes.string,
    collections: PropTypes.array,
    selectedCollections: PropTypes.array,
    loadShopifyCollections: PropTypes.func,
    updateShortcutSettings: PropTypes.func,
    navigateToShopifySettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleCollectionSelection = this.handleCollectionSelection.bind(this);
    this.renderShopifyCollections = this.renderShopifyCollections.bind(this);
    this.checkData = this.checkData.bind(this);
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      store,
      apiKey,
    } = props;
    const {
      store: nextStore,
      apiKey: nextApiKey,
    } = nextProps;

    if (!nextStore || !nextApiKey) {
      return;
    }

    if (nextStore !== store || nextApiKey !== apiKey) {
      this.props.loadShopifyCollections(nextStore, nextApiKey);
    }
  }

  handleCollectionSelection(event) {
    if (!event.target) {
      return;
    }

    const { checked, id } = event.target;
    const selectedCollectionId = parseInt(id, 10);

    const { selectedCollections } = this.props;

    const newSelectedCollections = checked ?
      _.union(selectedCollections, [selectedCollectionId]) :
      _.without(selectedCollections, selectedCollectionId);

    this.props.updateShortcutSettings({ selectedCollections: newSelectedCollections });
  }

  renderShopifyCollections() {
    const { collections, selectedCollections } = this.props;

    return (
      <div>
        {_.map(collections, (collection) => {
          const { collection_id: collectionId, title } = collection;
          return (
            <Checkbox
              id={collectionId}
              key={collectionId}
              checked={_.includes(selectedCollections, collectionId)}
              onChange={this.handleCollectionSelection}
            >
              {title}
            </Checkbox>
          );
        })}
      </div>
    );
  }

  render() {
    const { apiKey, store, navigateToShopifySettings } = this.props;

    const isConfigured = apiKey && store;
    if (!isConfigured) {
      return <ShopifySettingsPage {...this.props} />;
    }

    return (
      <div className="shopify-page settings-page">
        <ShopPreview
          store={store}
          onNavigateToShopifySettingsClick={navigateToShopifySettings}
        />
        <form className="voffset4">
          <FormGroup>
            <h4>Store collections</h4>
            {this.renderShopifyCollections()}
          </FormGroup>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    ownExtension: { settings: extensionSettings },
    shortcut: { settings: shortcutSettings },
  } = ownProps;

  const store = _.get(extensionSettings, 'store');
  const apiKey = _.get(extensionSettings, 'apiKey');
  const selectedCollections = _.get(shortcutSettings, 'selectedCollections', []);

  return {
    store,
    apiKey,
    selectedCollections,
    collections: getShopifyCollections(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { ownExtensionName, shortcut, appId } = ownProps;
  const scope = { extensionName: ownExtensionName };

  return {
    loadShopifyCollections: (store, apiKey) => (
      dispatch(loadShopifyCollections(store, apiKey, scope))
    ),
    updateShortcutSettings: (settings) => (
      dispatch(updateShortcutSettings(shortcut, settings))
    ),
    navigateToShopifySettings: () => (
      dispatch(navigateToSettings(appId, ownExtensionName))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyPage);

