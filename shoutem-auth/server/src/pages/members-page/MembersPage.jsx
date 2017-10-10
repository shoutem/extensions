import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Paging, SearchInput } from '@shoutem/react-web-ui';
import { shouldLoad, isBusy } from '@shoutem/redux-io';
import { getErrorCode } from '@shoutem/redux-api-sdk';
import {
  MembersDashboard,
  getErrorMessage,
  loadMembers,
  loadNextMembersPage,
  loadPreviousMembersPage,
  createMember,
  updateMember,
  deleteMember,
  getMembers,
  getMemberCount,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from 'src/modules/members';
import './style.scss';

export class MembersPage extends Component {
  constructor(props, context) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.loadMembers = this.loadMembers.bind(this);
    this.handleMemberCreate = this.handleMemberCreate.bind(this);
    this.handleMemberUpdate = this.handleMemberUpdate.bind(this);
    this.handleMemberDelete = this.handleMemberDelete.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);

    const { page } = context;
    const userId = _.get(page, 'pageContext.userId');

    this.state = {
      userId,
      filter: null,
      limit: DEFAULT_LIMIT,
      offset: DEFAULT_OFFSET,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  componentDidUpdate() {
    this.refs.membersPageSearch.focus();
  }

  checkData(nextProps, props = {}) {
    if (shouldLoad(nextProps, props, 'members')) {
      this.loadMembers();
    }
  }

  loadMembers() {
    const { appId } = this.props;
    const { filter, limit, offset } = this.state;

    this.props.loadMembers(appId, filter, limit, offset);
  }

  handleMemberCreate(member) {
    const { appId } = this.props;

    return new Promise((resolve, reject) => (
      this.props.createMember(appId, member)
        .then(resolve, (action) => {
          const errorCode = getErrorCode(action);
          reject(getErrorMessage(errorCode));
        })
    ));
  }

  handleMemberUpdate(member) {
    const { appId } = this.props;
    return this.props.updateMember(appId, member)
  }

  handleMemberDelete(memberId) {
    const { appId } = this.props;
    return this.props.deleteMember(appId, memberId);
  }

  handleNextPageClick() {
    const { members } = this.props;
    this.props.loadNextPage(members);
  }

  handlePreviousPageClick() {
    const { members } = this.props;
    this.props.loadPreviousPage(members);
  }

  handleFilterChange(filterValue) {
    const filter = _.isEmpty(filterValue) ? null : filterValue;

    this.setState({
      filter,
      limit: DEFAULT_LIMIT,
      offset: DEFAULT_OFFSET,
    }, this.loadMembers)
  }

  render() {
    const { limit, offset, userId } = this.state;
    const { members } = this.props;
    const memberCount = getMemberCount(members);

    return (
      <div className="auth-settings-page members-page">
        <SearchInput
          className="members-page__search"
          disabled={isBusy(members)}
          onChange={this.handleFilterChange}
          placeholder="Search app users"
          ref="membersPageSearch"
          type="text"
        />
        <MembersDashboard
          members={members}
          onMemberCreate={this.handleMemberCreate}
          onMemberUpdate={this.handleMemberUpdate}
          onMemberDelete={this.handleMemberDelete}
          userId={userId}
        />
        <Paging
          limit={limit}
          offset={offset}
          itemCount={memberCount}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
        />
      </div>
    );
  }
}

MembersPage.propTypes = {
  appId: PropTypes.string,
  members: PropTypes.array,
  loadMembers: PropTypes.func,
  loadNextPage: PropTypes.func,
  loadPreviousPage: PropTypes.func,
  createMember: PropTypes.func,
  updateMember: PropTypes.func,
  deleteMember: PropTypes.func,
};

MembersPage.contextTypes = {
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    members: getMembers(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadMembers: (appId, filter, limit, offset) => (
      dispatch(loadMembers(appId, filter, limit, offset, scope))
    ),
    loadNextPage: (members) => (
      dispatch(loadNextMembersPage(members))
    ),
    loadPreviousPage: (members) => (
      dispatch(loadPreviousMembersPage(members))
    ),
    createMember: (appId, member) => (
      dispatch(createMember(appId, member, scope))
    ),
    updateMember: (appId, member) => (
      dispatch(updateMember(appId, member, scope))
    ),
    deleteMember: (appId, memberId) => (
      dispatch(deleteMember(appId, memberId))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MembersPage);
