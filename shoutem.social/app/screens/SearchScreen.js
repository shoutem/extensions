import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';

import { clear, isBusy, isValid, isInitialized, isEmpty } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Divider,
  EmptyListImage,
  ListView,
  SearchField,
  Screen,
  Subtitle,
  View,
} from '@shoutem/ui';

import { USER_SCHEMA } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { NavigationBar, navigateBack } from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { openProfileForLegacyUser } from '../services';
import { ext } from '../const';
import { searchUsers, searchUsersNextPage } from '../redux';
import { getSearchUsers } from '../redux/selectors';

export class SearchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.handleTextChange = _.debounce(this.handleTextChange, 500)

    autoBindReact(this);

    this.state = {
      text: '',
    };
  }

  resolveEmptyListTitle(text) {
    if (_.isEmpty(text)) {
      return I18n.t(ext('emptyStartSearchListTitle'));
    }

    return I18n.t(ext('emptySearchListTitle'));
  }

  resolveEmptyListMessage(text) {
    if (_.isEmpty(text)) {
      return I18n.t(ext('emptyStartSearchListMessage'));
    }

    return I18n.t(ext('emptySearchListMessage'), { text })
  }

  onCancel() {
    const { navigateBack, clear } = this.props;

    clear(USER_SCHEMA, 'searchUsers');
    navigateBack();
  }

  handleTextChange(text) {
    const { searchUsers } = this.props;
    const lowerCaseText = text.toLowerCase();

    this.setState({ text });
    searchUsers(lowerCaseText);
  }

  loadMore() {
    const { searchUsersNextPage, searchData } = this.props;
    const { text } = this.state;

    const lowerCaseText = text.toLowerCase();

    searchUsersNextPage(lowerCaseText, searchData);
  }

  renderRightComponent() {
    return (
      <Button styleName="clear" onPress={this.onCancel}>
        <Subtitle>{I18n.t(ext('searchCancelButton'))}</Subtitle>
      </Button>
    );
  }

  renderLeftComponent() {
    return (
      <View styleName="container full-width md-gutter-left sm-gutter-right">
        <SearchField
          placeholder={I18n.t(ext('navBarSearchPlaceholder'))}
          onChangeText={this.handleTextChange}
        />
        {this.renderRightComponent()}
      </View>
    );
  }

  renderRow(user) {
    const { openProfile } = this.props;

    return (
      <MemberView
        openProfile={openProfile}
        user={user}
      />
    );
  }

  render() {
    const { searchData, style } = this.props;
    const { text } = this.state;

    return (
      <Screen styleName="paper">
        <NavigationBar
          renderLeftComponent={this.renderLeftComponent}
        />
        <Divider styleName="line" />
        <ListView
          data={searchData}
          loading={isBusy(searchData)}
          contentContainerStyle={style.contentContainerStyle}
          onLoadMore={this.loadMore}
          renderRow={this.renderRow}
          ListEmptyComponent={
            <EmptyListImage
              title={this.resolveEmptyListTitle(text)}
              message={this.resolveEmptyListMessage(text)}
            />
          }
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state[ext()].users,
  searchData: getSearchUsers(state)
});

const mapDispatchToProps = (dispatch) => ({
  navigateBack: () => dispatch(navigateBack()),
  openProfile: openProfileForLegacyUser(dispatch),
  searchUsers: (term) => dispatch(searchUsers(term)),
  searchUsersNextPage: (term, currentData) => dispatch(searchUsersNextPage(term, currentData)),
  clear: (schema, tag) => dispatch(clear(schema, tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('SearchScreen'))(SearchScreen),
);
