import React, {
  Component,
} from 'react';

import { connect } from 'react-redux';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';
import { navigateBack } from '@shoutem/core/navigation';
import { SearchField } from '@shoutem/ui-addons';

import {
  ListView,
  Screen,
  View,
  Divider,
  Button,
  Subtitle,
} from '@shoutem/ui';

import { openProfile } from 'shoutem.auth';

import { ext } from '../const';
import MemberView from '../components/MemberView';

export class SearchScreen extends Component {
  
  constructor(props) {
    super(props);
    this.renderRightComponent = this.renderRightComponent.bind(this);
    this.renderLeftComponent = this.renderLeftComponent.bind(this);
    this.userMeetsSearchCriteria = this.userMeetsSearchCriteria.bind(this);
    this.onHandleText = this.onHandleText.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      text: '',
      submitted: false,
    };
  }

  onCancel() {
    const { navigateBack } = this.props;
    navigateBack();
  }

  onHandleText(text) {
    this.setState({ text, submitted: false });
  }

  onSubmit() {
    this.setState({ submitted: true });
  }

  userMeetsSearchCriteria(user) {
    const { text } = this.state;
    const lowerCaseText = text.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerCaseText) ||
      user.first_name.toLowerCase().includes(lowerCaseText) ||
      user.last_name.toLowerCase().includes(lowerCaseText)
    );
  }

  renderRightComponent() {
    return (
      <Button styleName="clear" onPress={this.onCancel}>
        <Subtitle>Cancel</Subtitle>
      </Button>
    );
  }

  renderLeftComponent() {
    return (
      <View styleName="container full-width md-gutter-left sm-gutter-right">
        <SearchField
          placeholder="Search"
          onChangeText={this.onHandleText}
          onSubmitEditing={this.onSubmit}
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
    const { users } = this.props;
    
    const filteredUsers =
      this.state.text
      ? _.get(users, 'data').filter(user => this.userMeetsSearchCriteria(user))
      : _.get(users, 'data');
    
    return (
      <Screen styleName="paper">
        <NavigationBar
          renderLeftComponent={this.renderLeftComponent}
        />
        <Divider styleName="line" />
        <ListView
          data={filteredUsers}
          renderRow={this.renderRow}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state[ext()].users,
});

const mapDispatchToProps = {
  navigateBack,
  openProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('SearchScreen'))(SearchScreen),
);
