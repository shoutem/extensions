import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { FormGroup, ControlLabel, FormControl, Pager } from 'react-bootstrap';
import { Checkbox, LoaderContainer } from '@shoutem/react-web-ui';
import { connect } from 'react-redux';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import {
  ShopPreview,
  getShopifyCollections,
  loadShopifyCollections,
} from 'src/modules/shopify';
import { navigateToSettings } from 'src/redux';
import ShopifySettingsPage from '../shopify-settings-page';

import './style.scss';

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

    this.page = 1;
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

    this.props.updateShortcutSettings({
      selectedCollections: newSelectedCollections,
    });
  }

  renderShopifyCollections() {
    const {
      apiKey,
      collections,
      selectedCollections,
      loadShopifyCollections,
      store,
    } = this.props;

    if (collections.length == 0) {
      return (
        <LoaderContainer size="50px" isLoading />
      );
    }

    return (
      <div>
        {_.map(collections, (collection) => {
          const { collection_id, title } = collection;

          return (
            <Checkbox
              id={collection_id}
              key={collection_id}
              checked={_.includes(selectedCollections, collection_id)}
              onChange={this.handleCollectionSelection}
            >
              {title}
            </Checkbox>
          );
        })}
        <Pager style={{marginTop: "30px"}}>
          <Pager.Item
            previous
            disabled={this.page == 1}
            onClick={() => {
              this.page--;
              loadShopifyCollections(store, apiKey, this.page);
            }}>
            &larr; Previous page
          </Pager.Item>
          <Pager.Item
            next
            disabled={collections.length < 250}
            onClick={() => {
              this.page++;
              loadShopifyCollections(store, apiKey, this.page);
            }}>
            Next page &rarr;
          </Pager.Item>
        </Pager>
      </div>
    );
  }

  render() {
    const {
      apiKey,
      store,
      navigateToShopifySettings,
      selectedCollections,
      updateShortcutSettings,
    } = this.props;

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
        <form>
          <h3>Store collections</h3>
          <h5>Showing pages up to 250 collections</h5>
          <FormGroup>
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
    loadShopifyCollections: (store, apiKey, page) => (
      dispatch(loadShopifyCollections(store, apiKey, scope, page ? page : 1))
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
