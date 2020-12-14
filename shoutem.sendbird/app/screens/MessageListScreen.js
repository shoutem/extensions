import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, InteractionManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { NavigationBar, navigateTo } from 'shoutem.navigation';
import { loginRequired, getUser } from 'shoutem.auth';
import { isSendBirdConfigured, USER_SCHEMA } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import {
  selectors as socialSelectors,
  actions as socialActions,
} from 'shoutem.social';
import {
  Screen,
  ListView,
  EmptyStateView,
  EmptyListImage,
  Title,
  View
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { clear } from '@shoutem/redux-io';

import { ext } from '../const';
import {
  NewChannelListItem,
  ExistingChannelListItem,
  MemberListItem,
  SearchBar
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
    isConnected: PropTypes.bool,
    isConnecting: PropTypes.bool,
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
    this.handleSearchTextChange = _.debounce(this.handleSearchTextChange, 500);

    this.state = {
      channelsLoading: true,
      membersLoading: false,
      searchQuery: '',
      sectionData: [
        {
          title: I18n.t(ext('chatsTitle')),
          data: props.channels
        },
        {
          title: I18n.t(ext('otherContactsTitle')),
          data: [],
        }
      ]
    };
  }

  componentDidMount() {
    const { isSendBirdConfigured, isConnected, loadUsers } = this.props;

    if (!isSendBirdConfigured) {
      Alert.alert(
        I18n.t(ext('chatUnavailableErrorTitle')),
        I18n.t(ext('chatNotConfiguredMessage')));

      return;
    }

    if (isConnected) {
      this.loadInitialChannels();
    }

    InteractionManager.runAfterInteractions(() => {
      loadUsers();
    });
  }

  componentDidUpdate(prevProps) {
    const { isConnected, channels } = this.props;
    const { isConnected: prevIsConnected } = prevProps;

    if (!prevIsConnected && isConnected && _.isEmpty(channels)) {
      this.loadInitialChannels();
    }
  }

  loadInitialChannels() {
    const { currentUser, loadChannels } = this.props;

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
      .then(this.handleSearchLoaded)
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

    return searchChannels(searchTerm);
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
    const { searchUsers } = this.props;
    const wasEmpty = _.isEmpty(searchQuery);
    const isEmpty = _.isEmpty(newSearchQuery);

    if (wasEmpty !== isEmpty) {
      LayoutAnimation.easeInEaseOut();
    }

    if (!wasEmpty && isEmpty) {
      this.handleResetSearch();
    }

    this.setState({ searchQuery: newSearchQuery });

    if (!isEmpty) {
      this.setState({ membersLoading: true });

      return Promise.all([
        this.props.searchChannels(newSearchQuery),
        searchUsers(newSearchQuery),
      ])
        .then(this.handleSearchLoaded)
        .catch((error) => {
          console.warn("Error while trying to perform search", error)
          this.setState({ membersLoading: false })
        });
    }
  }

  filterSearchedUsers() {
    const { searchedChannels, searchedUsers, currentUser } = this.props;

    if (_.isEmpty(searchedUsers)) {
      return [];
    }

    const channelUserIds = _.map(searchedChannels, (channel) => {
      const member = SendBird.getChannelPartner(channel.channel, currentUser);

      return _.split(member.userId, '-', 2)[1];
    })

    return _.filter(searchedUsers, (user) => !_.includes(channelUserIds, user.id))
  }

  handleResetSearch() {
    const { clearSearch } = this.props;

    Promise.all([
      clearSearch(),
      clear(USER_SCHEMA, 'searchUsers')
    ])
      .then(this.handleSearchLoaded);
  }

  handleSearchLoaded() {
    const { channels, searchedChannels } = this.props;
    const { searchQuery } = this.state;


    const resolvedChannels = _.isEmpty(searchQuery) ? channels : searchedChannels;
    const resolvedMembers = !_.isEmpty(searchQuery) ? this.filterSearchedUsers() : [];

    this.setState({
      sectionData: [
        {
          title: I18n.t(ext('chatsTitle')),
          data: resolvedChannels
        },
        {
          title: I18n.t(ext('otherContactsTitle')),
          data: resolvedMembers,
        }
      ],
      membersLoading: false,
      channelsLoading: false,
    })
  }

  renderNewChannel(item) {
    return <NewChannelListItem onPress={this.handleItemPress} user={item} />;
  }

  renderEmptyListComponent() {
    const { searchQuery, channelsLoading, membersLoading } = this.state;

    if (channelsLoading || membersLoading) {
      return null;
    }

    if (_.isEmpty(searchQuery)) {
      return (
        <EmptyListImage
          title={I18n.t(ext('emptyChatListTitle'))}
          message={I18n.t(ext('emptyChatListMessage'))}
        />
      )
    }

    return <EmptyListImage />
  }

  renderRow(item) {
    const { currentUser } = this.props;
    const isExistingChannel = _.get(item, 'channel')

    if (isExistingChannel) {
      return (
        <ExistingChannelListItem
          channel={item}
          currentUser={currentUser}
          onPress={this.handleItemPress}
        />
      );
    }

    return <MemberListItem user={item}></MemberListItem>
  }

  renderSectionHeader(section) {
    const { style } = this.props;
    const title = _.get(section, 'title', '');
    const sectionData = _.get(section, 'data', '')

    if (_.isEmpty(sectionData)) {
      return null;
    }

    return (
      <View styleName="section-header" style={style.sectionContainer}>
        <Title style={style.sectionTitle}>{title}</Title>
      </View>
    );
  }

  render() {
    const { style, channels } = this.props;
    const { membersLoading, sectionData, channelsLoading } = this.state;

    const navigationBarProps = this.getNavigationBarProps();

    return (
      <Screen style={style.screen}>
        <NavigationBar {...navigationBarProps} />
        <SearchBar onChangeText={this.handleSearchTextChange} />
        <ListView
          sections={sectionData}
          keyboardShouldPersistTaps="handled"
          extraData={channels}
          ListEmptyComponent={this.renderEmptyListComponent}
          loading={membersLoading || channelsLoading}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => ({
  users: socialSelectors.getUsers(state),
  currentUser: getUser(state),
  channels: selectors.getChannels(state),
  searchedChannels: selectors.getSearchedChannels(state),
  searchedUsers: socialSelectors.getSearchUsers(state),
  isSendBirdConfigured: isSendBirdConfigured(state),
  isConnected: selectors.isConnected(state),
  isConnecting: selectors.isConnecting(state),

});

const mapDispatchToProps = {
  navigateTo,
  loadChannels: actions.loadChannels,
  searchChannels: actions.searchChannelsPerNickname,
  clearSearch: actions.clearChannelSearch,
  searchUsers: socialActions.searchUsers,
  loadUsers: socialActions.loadUsers,
  clear,
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MessageListScreen'))(MessageListScreen),
), true);
