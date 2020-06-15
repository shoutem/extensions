import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { FontIcon, IconLabel, EditableTable } from '@shoutem/react-web-ui';
import './style.scss';

function resolveAudiencDisplayValue(item) {
  const value = _.get(item, 'audience.type');

  if (value === 'group') {
    return 'Group';
  }

  return 'All';
}

function renderStatusValue(item) {
  const value = _.get(item, 'active');
  const iconName = value ? 'clock' : 'check';

  return <FontIcon name={iconName} size="24px" />;
}

function getHeaders() {
  return ['Status', 'Message', 'Audience', '', ''];
}

export default class NotificationsTable extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  getRowDescriptors() {
    const statusDescriptor = {
      getDisplayValue: renderStatusValue,
      isRequired: true,
    };

    const messageDescriptor = {
      property: 'content.summary',
      isRequired: true,
    };

    const audienceDescriptor = {
      getDisplayValue: resolveAudiencDisplayValue,
      isRequired: true,
    };

    const editDescriptor = {
      getDisplayValue: this.renderEditValue,
      isRequired: false,
    };

    const deleteDescriptor = {
      getDisplayValue: this.renderDeleteValue,
      isRequired: false,
    };

    return [
      statusDescriptor,
      messageDescriptor,
      audienceDescriptor,
      editDescriptor,
      deleteDescriptor,
    ];
  }

  renderEditValue(item) {
    const { onEditClick } = this.props;
    const value = _.get(item, 'active');

    if (value) {
      return (
        <Button
          className="btn-icon pull-right"
          onClick={() => onEditClick(item)}
        >
          <FontIcon name="edit" size="24px" />
        </Button>
      );
    }

    return null;
  }

  renderDeleteValue(item) {
    const { onDeleteClick } = this.props;

    return (
      <Button
        className="btn-icon pull-right"
        onClick={event => {
          event.stopPropagation();
          onDeleteClick(item);
        }}
      >
        <FontIcon name="delete" size="24px" />
      </Button>
    );
  }

  render() {
    const { notifications, onRowClick, onAddClick } = this.props;

    return (
      <div className="notifications-table">
        <div className="notifications-table__title">
          <h3>List of notifications</h3>
          <Button className="btn-icon pull-right" onClick={onAddClick}>
            <IconLabel iconName="add">Create new</IconLabel>
          </Button>
        </div>
        <EditableTable
          isStatic
          canUpdate={false}
          canDelete={false}
          className="notifications-table"
          emptyStateText="No notifications yet"
          headers={getHeaders()}
          rowDescriptors={this.getRowDescriptors()}
          rows={notifications}
          onRowClick={onRowClick}
        />
      </div>
    );
  }
}

NotificationsTable.propTypes = {
  notifications: PropTypes.array,
  onRowClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
};
