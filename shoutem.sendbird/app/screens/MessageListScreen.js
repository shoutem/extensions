import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, InteractionManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { NavigationBar, navigateTo } from 'shoutem.navigation';
import { loginRequired, getUser } from 'shoutem.auth';
import { isSendBirdConfigured } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import {
  selectors as socialSelectors,
  actions as socialActions,
} from 'shoutem.social';
import {
  Screen,
  ListView,
  EmptyStateView,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import {
  NewChannelListItem,
  ExistingChannelListItem,
  SearchBar,
  EmptyChannelListComponent,
} from '../components';
import { selectors, actions } from '../redux';
import { SendBird, composeSendBirdId } from '../services';

export class MessageListScreen extends PureComponent {
  static propTypes = {
    loadChannels: PropTypes.func,
    searchChannels: PropTypes.func,
    clearSearch: PropTypes.func,
    channels: PropTypes.array,
    searchedChannels: PropTypes.array,
    title: PropTypes.string.isRequired,
    currentUser: PropTypes.object,
    users: PropTypes.object,
    navigateTo: PropTypes.func,
    isSendBirdConfigured: PropTypes.bool,
    loadUsers: PropTypes.func,
    style: PropTypes.shape({
      screen: Screen.propTypes.style,
      list: ListView.propTypes.style,
      emptyState: EmptyStateView.propTypes.style,
    }),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.searchChannels = _.debounce(this.searchChannels, 250);

    this.state = {
      channelsLoading: true,
      searching: false,
      searchQuery: '',
    };
  }

  componentDidMount() {
    const { currentUser, isSendBirdConfigured, loadChannels, loadUsers } = this.props;

    if (!isSendBirdConfigured) {
      Alert.alert(
        I18n.t(ext('chatUnavailableErrorTitle')),
        I18n.t(ext('chatNotConfiguredMessage')));

      return;
    }

    InteractionManager.runAfterInteractions(() => {
      loadUsers();
    });

    const userId = composeSendBirdId(currentUser);
    if (!SendBird.getInstance()) {
      this.setState({ channelsLoading: false });
      return;
    }

    const groupChannelListQuery = SendBird.getInstance().GroupChannel.createMyGroupChannelListQuery();

    groupChannelListQuery.order = 'latest_last_message';
    groupChannelListQuery.limit = 100;
    groupChannelListQuery.userIdsIncludeFilter = [userId];

    this.setState({ groupChannelListQuery });

    loadChannels(groupChannelListQuery, false)
      .then(() => this.setState({ channelsLoading: false }))
      .catch(() => this.setState({ channelsLoading: false }));
  }

  getNavigationBarProps() {
    const { title } = this.props;

    return {
      title: title.toUpperCase(),
      styleName: 'no-border',
    };
  }

  searchChannels(searchTerm) {
    const { searchChannels } = this.props;

    if (!SendBird.getInstance()) {
      return;
    }

    searchChannels(searchTerm)
      .then(() => this.setState({ searching: false }))
      .catch(() => this.setState({ searching: false }));
  }

  handleLoadMore() {
    const { channelsLoading, groupChannelListQuery } = this.state;
    const { loadChannels } = this.props;

    if (channelsLoading || !groupChannelListQuery || !groupChannelListQuery.hasNext) {
      return;
    }

    this.setState({ channelsLoading: true });

    loadChannels(groupChannelListQuery, true)
      .then(() => this.setState({ channelsLoading: false }))
      .catch(() => this.setState({ channelsLoading: false }));
  }

  handleItemPress(channelId) {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('ChatWindowScreen'),
      props: { channelId },
    });
  }

  handleSearchTextChange(newSearchQuery) {
    const { searchQuery } = this.state;
    const { clearSearch } = this.props;
    const wasEmpty = _.isEmpty(searchQuery);
    const isEmpty = _.isEmpty(newSearchQuery);

    if (wasEmpty !== isEmpty) {
      LayoutAnimation.easeInEaseOut();
    }

    if (!wasEmpty && isEmpty) {
      clearSearch();
    }

    this.setState({ searchQuery: newSearchQuery });

    if (!isEmpty) {
      this.setState({ searching: true });
      this.searchChannels(newSearchQuery);
    }
  }

  renderNewChannel(item) {
    return <NewChannelListItem onPress={this.handleItemPress} user={item} />;
  }

  renderEmptyListComponent() {
    const { channelsLoading, searching } = this.state;

    if (channelsLoading || searching) {
      return null;
    }

    LayoutAnimation.easeInEaseOut();
    return <EmptyChannelListComponent />;
  }

  renderExistingChannel(item) {
    const { currentUser } = this.props;

    return (
      <ExistingChannelListItem
        channel={item}
        currentUser={currentUser}
        onPress={this.handleItemPress}
      />
    );
  }

  render() {
    const { style, channels, searchedChannels } = this.props;
    const { channelsLoading, searchQuery, searching } = this.state;

    const showSearchList = !_.isEmpty(searchQuery);
    const navigationBarProps = this.getNavigationBarProps();

    return (
      <Screen style={style.screen}>
        <NavigationBar {...navigationBarProps} />
        <SearchBar onChangeText={this.handleSearchTextChange} />
        {!showSearchList && (
          <ListView
            data={channels}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={this.renderEmptyListComponent}
            loading={channelsLoading}
            onLoadMore={this.handleLoadMore}
            renderRow={this.renderExistingChannel}
          />
        )}
        {showSearchList && (
          <ListView
            data={searchedChannels}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={this.renderEmptyListComponent}
            loading={searching}
            renderRow={this.renderExistingChannel}
          />
        )}
      </Screen>
    );
  }
}

const mapStateToProps = state => ({
  users: socialSelectors.getUsers(state),
  currentUser: getUser(state),
  channels: selectors.getChannels(state),
  searchedChannels: selectors.getSearchedChannels(state),
  isSendBirdConfigured: isSendBirdConfigured(state),
});

const mapDispatchToProps = {
  navigateTo,
  loadChannels: actions.loadChannels,
  searchChannels: actions.searchChannelsPerNickname,
  clearSearch: actions.clearChannelSearch,
  loadUsers: socialActions.loadUsers,
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MessageListScreen'))(MessageListScreen),
), true);
