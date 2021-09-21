import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InteractionManager } from 'react-native';
import { bindActionCreators } from 'redux';
import {
  cloneStatus,
  find,
  isError,
  isBusy,
  isInitialized,
  isValid,
  next,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, GridRow, ListView, View } from '@shoutem/ui';
import { authenticate, isAuthenticated } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import {
  ext,
  TRANSLATIONS,
  DEAL_TRANSACTIONS_SCHEMA,
  MY_DEALS_TAG,
} from '../../const';
import { fetchMyDealTransactions, getMyDeals } from '../../redux';
import DealGridView from '../DealGridView';

export class MyDealsList extends PureComponent {
  static propTypes = {
    authenticate: PropTypes.func,
    catalogId: PropTypes.string,
    data: PropTypes.array,
    fetchMyDealTransactions: PropTypes.func,
    fetchDealListTransactions: PropTypes.func,
    find: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    next: PropTypes.func,
    onOpenDealDetails: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      schema: DEAL_TRANSACTIONS_SCHEMA,
      tag: MY_DEALS_TAG,
    };
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.fetchData();
    }
  }

  handleAuthenticateUser() {
    this.props.authenticate(() => this.fetchData());
  }

  isCollectionValid(collection) {
    if (!isValid(collection)) {
      return false;
    }

    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  fetchData() {
    const { catalogId } = this.props;

    if (!this.props.isAuthenticated) {
      return;
    }

    InteractionManager.runAfterInteractions(() =>
      this.props.fetchMyDealTransactions(catalogId),
    );
  }

  loadMore() {
    this.props.next(this.props.data);
  }

  renderAuthenticationRequiredView() {
    if (this.props.isAuthenticated) {
      return null;
    }

    return (
      <View styleName="vertical flexible h-center v-center">
        <EmptyStateView
          icon="deals"
          message={I18n.t(TRANSLATIONS.MY_DEALS_AUTHENTICATION_REQUIRED_TEXT)}
          onRetry={this.handleAuthenticateUser}
          retryButtonTitle={I18n.t('shoutem.auth.logInButton')}
        />
      </View>
    );
  }

  renderPlaceholderView() {
    const { data } = this.props;

    const message = isError(data)
      ? I18n.t('shoutem.application.unexpectedErrorMessage')
      : I18n.t('shoutem.application.preview.noContentErrorMessage');

    return <EmptyStateView icon="deals" message={message} />;
  }

  renderRow(deals) {
    const dealsViews = _.map(deals, deal => (
      <DealGridView
        deal={deal}
        dealId={deal.id}
        key={deal.id}
        onPress={this.props.onOpenDealDetails}
      />
    ));

    return (
      <View styleName="flexible sm-gutter-bottom sm-gutter-left">
        <GridRow columns={2}>{dealsViews}</GridRow>
      </View>
    );
  }

  renderData(deals) {
    const groupedDeals = GridRow.groupByRows(deals, 2);
    cloneStatus(deals, groupedDeals);

    const loading = isBusy(groupedDeals) || !isInitialized(groupedDeals);

    return (
      <ListView
        data={groupedDeals}
        loading={loading}
        onLoadMore={this.loadMore}
        onRefresh={this.fetchData}
        renderRow={this.renderRow}
        initialListSize={1}
      />
    );
  }

  render() {
    // Check if user is authenticated
    if (!this.props.isAuthenticated) {
      return this.renderAuthenticationRequiredView();
    }

    if (!this.isCollectionValid(this.props.data)) {
      return this.renderPlaceholderView();
    }

    return <View key="my-deals-list">{this.renderData(this.props.data)}</View>;
  }
}

export const mapStateToProps = state => ({
  data: getMyDeals(state),
  isAuthenticated: isAuthenticated(state),
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      authenticate,
      fetchMyDealTransactions,
      find,
      next,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MyDealsList'), {})(MyDealsList));
