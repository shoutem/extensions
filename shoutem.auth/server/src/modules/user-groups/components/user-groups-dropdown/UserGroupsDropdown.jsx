import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { createOptions } from 'src/services';
import { LoaderContainer, MultiselectDropdown } from '@shoutem/react-web-ui';
import './style.scss';

export default class UserGroupsDropdown extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
    };
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { userGroups } = props;
    const { userGroups: nextUserGroups } = nextProps;

    if (userGroups !== nextUserGroups) {
      const userGroupOptions = createOptions(nextUserGroups);
      this.setState({ userGroupOptions });
    }
  }

  handleSelectionChanged(selectedUserGroupIds) {
    const { onSelectionChanged } = this.props;
    this.setState({ inProgress: true });

    Promise.resolve(onSelectionChanged(selectedUserGroupIds))
      .then(() => this.setState({ inProgress: false }))
      .catch(() => this.setState({ inProgress: false }));
  }

  render() {
    const { userGroupOptions, inProgress } = this.state;
    const {
      emptyText,
      selectedUserGroupIds,
      disabled,
      showSelectNoneOption,
    } = this.props;

    return (
      <LoaderContainer
        className="user-groups-dropdown"
        isLoading={inProgress}
        isOverlay
        size="24px"
      >
        <MultiselectDropdown
          disabled={disabled}
          displayLabelMaxSelectedOptions={1}
          emptyText={emptyText}
          onSelectionChanged={this.handleSelectionChanged}
          options={userGroupOptions}
          ref="userGroupsDropdown"
          selectNoneText={emptyText}
          showSelectNoneOption={showSelectNoneOption}
          selectedValues={selectedUserGroupIds}
        />
      </LoaderContainer>
    );
  }
}

UserGroupsDropdown.propTypes = {
  userId: PropTypes.string,
  selectedUserGroupIds: PropTypes.array,
  emptyText: PropTypes.string,
  userGroups: PropTypes.array,
  onSelectionChanged: PropTypes.func,
  disabled: PropTypes.bool,
  showSelectNoneOption: PropTypes.bool,
};
