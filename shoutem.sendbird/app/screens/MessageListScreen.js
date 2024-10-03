import React, { PureComponent } from 'react';
import { Alert, InteractionManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { clear } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { EmptyListImage, ListView, Screen, Title, View } from '@shoutem/ui';
import { getUser, loginRequired } from 'shoutem.auth';
import { isSendBirdConfigured, USER_SCHEMA } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, navigateTo } from 'shoutem.navigation';
import {
  actions as socialActions,
  selectors as socialSelectors,
} from 'shoutem.social';
import {
  ExistingChannelListItem,
  MemberListItem,
  NewChannelListItem,
  SearchBar,
} from '../components';
import { ext } from '../const';
import { actions, selectors } from '../redux';
import { composeSendBirdId, SendBird } from '../services';

export class MessageListScreen extends PureComponent {
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
          data: props.channels,
        },
        {
          title: I18n.t(ext('otherContactsTitle')),
          data: [],
        },
      ],
    };
  }

  componentDidMount() {
    const {
      isSendBirdConfigured,
      isConnected,
      loadUsers,
      navigation,
    } = this.props;

    navigation.setOptions({
      ...composeNavigationStyles(['noBorder']),
    });

    if (!isSendBirdConfigured) {
      Alert.alert(
        I18n.t(ext('chatUnavailableErrorTitle')),
        I18n.t(ext('chatNotConfiguredMessage')),
      );

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
    const { isConnected, isFocused, channels } = this.props;
    const {
      isConnected: prevIsConnected,
      isFocused: prevIsFocused,
      channels: prevChannels,
    } = prevProps;

    if (!prevIsConnected && isConnected && _.isEmpty(channels)) {
      this.loadInitialChannels();
    }

    if (prevChannels !== channels || (!prevIsFocused && isFocused)) {
      this.handleSearchLoaded();
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

    loadChannels(groupChannelListQuery, false)
      .then(this.handleSearchLoaded)
      .catch(() => this.setState({ channelsLoading: false }));
  }

  searchChannels(searchTerm) {
    const { searchChannels } = this.props;

    if (!SendBird.getInstance()) {
      return null;
    }

    return searchChannels(searchTerm);
  }

  handleItemPress(channelId) {
    navigateTo(ext('ChatWindowScreen'), { channelId });
  }

  handleSearchTextChange(newSearchQuery) {
    const { searchQuery } = this.state;
    const { searchUsers, searchChannels } = this.props;
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
        searchChannels(newSearchQuery),
        searchUsers(newSearchQuery),
      ])
        .then(this.handleSearchLoaded)
        .catch(error => {
          // eslint-disable-next-line no-console
          console.warn('Error while trying to perform search', error);
          this.setState({ membersLoading: false });
        });
    }

    return null;
  }

  filterSearchedUsers() {
    const { searchedChannels, searchedUsers, currentUser } = this.props;

    if (_.isEmpty(searchedUsers)) {
      return [];
    }

    const channelUserIds = _.map(searchedChannels, channel => {
      const member = SendBird.getChannelPartner(channel.channel, currentUser);

      return _.split(member.userId, '-', 2)[1];
    });

    return _.filter(
      searchedUsers,
      user => !_.includes(channelUserIds, user.id),
    );
  }

  handleResetSearch() {
    const { clearSearch } = this.props;

    Promise.all([clearSearch(), clear(USER_SCHEMA, 'searchUsers')]).then(
      this.handleSearchLoaded,
    );
  }

  handleSearchLoaded() {
    const { channels, searchedChannels } = this.props;
    const { searchQuery } = this.state;

    const resolvedChannels = _.isEmpty(searchQuery)
      ? channels
      : searchedChannels;
    const resolvedMembers = !_.isEmpty(searchQuery)
      ? this.filterSearchedUsers()
      : [];

    this.setState({
      sectionData: [
        {
          title: I18n.t(ext('chatsTitle')),
          data: resolvedChannels,
        },
        {
          title: I18n.t(ext('otherContactsTitle')),
          data: resolvedMembers,
        },
      ],
      membersLoading: false,
      channelsLoading: false,
    });
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
      );
    }

    return (
      <EmptyListImage
        title={I18n.t(ext('emptyChatSearchResultTitle'))}
        message={I18n.t(ext('emptyChatSearchResultMessage'), { searchQuery })}
      />
    );
  }

  renderRow(item) {
    const { currentUser } = this.props;
    const isExistingChannel = _.get(item, 'channel');

    if (isExistingChannel) {
      return (
        <ExistingChannelListItem
          channel={item}
          currentUser={currentUser}
          onPress={this.handleItemPress}
        />
      );
    }

    return <MemberListItem user={item} />;
  }

  renderSectionHeader(section) {
    const { style } = this.props;
    const title = _.get(section, 'title', '');
    const sectionData = _.get(section, 'data', '');

    if (_.isEmpty(sectionData)) {
      return null;
    }

    return (
      <View style={style.sectionContainer}>
        <Title style={style.sectionTitle}>{title}</Title>
      </View>
    );
  }

  render() {
    const { style, channels } = this.props;
    const { membersLoading, sectionData, channelsLoading } = this.state;

    return (
      <Screen style={style.container}>
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

MessageListScreen.propTypes = {
  channels: PropTypes.array.isRequired,
  clearSearch: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  isSendBirdConfigured: PropTypes.bool.isRequired,
  loadChannels: PropTypes.func.isRequired,
  loadUsers: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  searchChannels: PropTypes.func.isRequired,
  searchedChannels: PropTypes.array.isRequired,
  searchedUsers: PropTypes.array.isRequired,
  searchUsers: PropTypes.func.isRequired,
  style: PropTypes.object,
};

MessageListScreen.defaultProps = {
  style: {},
};

const mapStateToProps = state => ({
  currentUser: getUser(state),
  channels: selectors.getChannels(state),
  searchedChannels: selectors.getSearchedChannels(state),
  searchedUsers: socialSelectors.getSearchUsers(state),
  isSendBirdConfigured: isSendBirdConfigured(state),
  isConnected: selectors.isConnected(state),
});

const mapDispatchToProps = {
  loadChannels: actions.loadChannels,
  searchChannels: actions.searchChannelsPerNickname,
  clearSearch: actions.clearChannelSearch,
  searchUsers: socialActions.searchUsers,
  loadUsers: socialActions.loadUsers,
  clear,
};

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('MessageListScreen'))(MessageListScreen)),
  true,
);
