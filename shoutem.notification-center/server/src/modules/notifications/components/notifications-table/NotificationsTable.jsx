import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { EditableTable, FontIcon, IconLabel } from '@shoutem/react-web-ui';
import { RECURRING_PERIOD_TYPES } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

function resolveAudiencDisplayValue(item) {
  const value = _.get(item, 'audience.type');

  if (value === 'group') {
    return i18next.t(LOCALIZATION.AUDIENCE_GROUP_VALUE);
  }

  return i18next.t(LOCALIZATION.AUDIENCE_ALL_VALUE);
}

function renderStatusValue(item) {
  const active = _.get(item, 'active');
  const recurringPeriod = _.get(item, 'recurringPeriod');

  let iconName = active ? 'clock' : 'check';
  if (active && recurringPeriod !== RECURRING_PERIOD_TYPES.NONE) {
    iconName = 'refresh';
  }

  return <FontIcon name={iconName} size="24px" />;
}

function getHeaders() {
  return [
    i18next.t(LOCALIZATION.HEADER_STATUS_LABEL),
    i18next.t(LOCALIZATION.HEADER_MESSAGE_LABEL),
    i18next.t(LOCALIZATION.HEADER_AUDIENCE_LABEL),
    '',
    '',
  ];
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

    // Message row descriptor doesn't have access to each notification object,
    // so we can't dynamically render it's content
    // Joining summaries into summary value to handle that, just for table preview
    _.forEach(notifications, notification => {
      if (notification.type === 'Silent') {
        try {
          const body = JSON.parse(notification.content?.body);

          if (body) {
            const summaries = _.map(body.actions, summary => summary.message);

            if (!_.isEmpty(summaries)) {
              _.set(notification, 'content.summary', summaries.join(', '));
            }
          }
        } catch (ex) {
          // Catch can occur if someone sent faulty content.body JSON from Postman
          // Using catch to avoid crashes & spare us a debugging time
        }
      }
    });

    return (
      <div className="notifications-table">
        <div className="notifications-table__title">
          <h3>{i18next.t(LOCALIZATION.TABLE_TITLE)}</h3>
          <Button className="btn-icon pull-right" onClick={onAddClick}>
            <IconLabel iconName="add">
              {i18next.t(LOCALIZATION.BUTTON_CREATE_NEW)}
            </IconLabel>
          </Button>
        </div>
        <EditableTable
          isStatic
          canUpdate={false}
          canDelete={false}
          className="notifications-table"
          emptyStateText={i18next.t(LOCALIZATION.NO_NOTIFICATIONS_TEXT)}
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
