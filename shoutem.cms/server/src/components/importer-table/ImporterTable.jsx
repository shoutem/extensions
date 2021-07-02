import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import i18next from 'i18next';
import { isBusy } from '@shoutem/redux-io';
import {
  EditableTable,
  LoaderContainer,
  IconLabel,
  FontIcon,
  FontIconPopover,
} from '@shoutem/react-web-ui';
import { Button } from 'react-bootstrap';
import {
  getImporterTitle,
  getTranslatedImporterStatus,
  getLastStartedOn,
  getImporterStatusMessage,
  showImporterMessage,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

function renderLastStartedOn(item) {
  const date = getLastStartedOn(item);
  if (!date) {
    return null;
  }

  return moment(date).format('M/D/YYYY h:mm A');
}

function renderStatus(item) {
  const status = getTranslatedImporterStatus(item);
  if (!status) {
    return null;
  }

  return status;
}

function renderTitle(item) {
  return getImporterTitle(item);
}

function renderInfo(item) {
  const showMessage = showImporterMessage(item);
  const message = getImporterStatusMessage(item);

  if (showMessage && message) {
    return (
      <FontIconPopover placement="top" message={message}>
        <FontIcon
          className="import-info-icon-popover"
          name="info"
          size="23px"
        />
      </FontIconPopover>
    );
  }

  return null;
}

function getHeaders() {
  return [
    i18next.t(LOCALIZATION.HEADER_TITLE_LABEL),
    i18next.t(LOCALIZATION.HEADER_STATUS_LABEL),
    i18next.t(LOCALIZATION.HEADER_LAST_IMPORT_ON_LABEL),
    '',
    '',
  ];
}

function getRowDescriptors() {
  const titleDescriptor = {
    getDisplayValue: renderTitle,
    required: true,
  };

  const statusDescriptor = {
    getDisplayValue: renderStatus,
  };

  const lastStartedOnDescriptor = {
    getDisplayValue: renderLastStartedOn,
  };

  const infoDescription = {
    getDisplayValue: renderInfo,
  };

  return [
    titleDescriptor,
    statusDescriptor,
    lastStartedOnDescriptor,
    infoDescription,
  ];
}

export default class ImporterTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeaders: getHeaders(),
      tableRowDescriptors: getRowDescriptors(),
    };
  }

  render() {
    const { importers, onAddImporter, onDeleteImporter } = this.props;
    const { tableHeaders, tableRowDescriptors } = this.state;

    return (
      <LoaderContainer
        className="importer-table"
        isLoading={isBusy(importers)}
        isOverlay
      >
        <div className="importer-table__title">
          <Button className="btn-icon pull-right" onClick={onAddImporter}>
            <IconLabel iconName="add">
              {i18next.t(LOCALIZATION.ADD_IMPORTER_BUTTON_LABEL)}
            </IconLabel>
          </Button>
        </div>
        <EditableTable
          canDelete
          canUpdate={false}
          emptyStateText={i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_LABEL)}
          headers={tableHeaders}
          isStatic
          onRowDeleted={onDeleteImporter}
          rowDescriptors={tableRowDescriptors}
          rows={importers}
        />
      </LoaderContainer>
    );
  }
}

ImporterTable.propTypes = {
  importers: PropTypes.array,
  onAddImporter: PropTypes.func,
  onDeleteImporter: PropTypes.func,
};
