import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { Button } from 'react-bootstrap';
import { FontIcon, EditableTable, Switch } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

function getHeaders() {
  return [
    i18next.t(LOCALIZATION.HEADER_CODE),
    i18next.t(LOCALIZATION.HEADER_LANGUAGE),
    i18next.t(LOCALIZATION.HEADER_STATUS),
    '',
    '',
    '',
    '',
  ];
}

export default class TranslationsTable extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  getRowDescriptors() {
    const codeDescriptor = {
      property: 'code',
      isRequired: true,
    };

    const languageDescriptor = {
      property: 'name',
      isRequired: true,
    };

    const statusDescriptor = {
      getDisplayValue: this.renderStatusValue,
      isRequired: true,
    };

    const switchDescriptor = {
      getDisplayValue: this.renderSwitchValue,
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

    const downloadDescriptor = {
      getDisplayValue: this.renderDownloadValue,
      isRequired: false,
    };

    return [
      codeDescriptor,
      languageDescriptor,
      statusDescriptor,
      switchDescriptor,
      editDescriptor,
      deleteDescriptor,
      downloadDescriptor,
    ];
  }

  renderStatusValue(item) {
    const status = _.get(item, 'status');

    if (status) {
      return i18next.t(LOCALIZATION.STATUS_ACTIVE);
    }

    return (
      <span className="inactive">
        {i18next.t(LOCALIZATION.STATUS_INACTIVE)}
      </span>
    );
  }

  renderSwitchValue(item) {
    const { onStatusChange } = this.props;
    const code = _.get(item, 'code');
    const status = _.get(item, 'status');
    const statusDisabled = _.get(item, 'statusDisabled');

    if (statusDisabled) {
      return <Switch className="switch-disabled" value disabled />;
    }

    return (
      <Switch value={status} onChange={() => onStatusChange(code, status)} />
    );
  }

  renderEditValue(item) {
    const { onEditClick } = this.props;

    return (
      <Button className="btn-icon" onClick={() => onEditClick(item)}>
        <FontIcon name="edit" size="24px" />
      </Button>
    );
  }

  renderDeleteValue(item) {
    const { onDeleteClick } = this.props;
    const disabled = _.get(item, 'deleteDisabled');

    return (
      <Button
        className="btn-icon"
        disabled={disabled}
        onClick={event => {
          event.stopPropagation();
          onDeleteClick(item);
        }}
      >
        <FontIcon name="delete" size="24px" />
      </Button>
    );
  }

  renderDownloadValue(item) {
    const { onDownloadClick } = this.props;

    return (
      <Button
        className="btn-icon"
        onClick={event => {
          event.stopPropagation();
          onDownloadClick(item);
        }}
      >
        <FontIcon name="download" size="24px" />
      </Button>
    );
  }

  render() {
    const { translations } = this.props;

    return (
      <EditableTable
        isStatic
        canUpdate={false}
        canDelete={false}
        className="translations-table"
        emptyStateText={i18next.t(LOCALIZATION.TABLE_PLACEHOLDER)}
        headers={getHeaders()}
        rowDescriptors={this.getRowDescriptors()}
        rows={translations}
      />
    );
  }
}

TranslationsTable.propTypes = {
  translations: PropTypes.array,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
  onStatusChange: PropTypes.func,
};
