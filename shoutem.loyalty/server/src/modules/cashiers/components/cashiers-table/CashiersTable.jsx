import React from 'react';
import { Button } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { EditableTable, IconLabel } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

function getHeaders(hasPlaces) {
  if (!hasPlaces) {
    return [
      i18next.t(LOCALIZATION.HEADER_FIRST_NAME_TITLE),
      i18next.t(LOCALIZATION.HEADER_LAST_NAME_TITLE),
      i18next.t(LOCALIZATION.HEADER_PIN_TITLE),
      '',
    ];
  }

  return [
    i18next.t(LOCALIZATION.HEADER_FIRST_NAME_TITLE),
    i18next.t(LOCALIZATION.HEADER_LAST_NAME_TITLE),
    i18next.t(LOCALIZATION.HEADER_STORE_TITLE),
    i18next.t(LOCALIZATION.HEADER_PIN_TITLE),
    '',
  ];
}

function getRowDescriptors(hasPlaces) {
  const firstNameDescriptor = {
    property: 'firstName',
    isRequired: true,
  };

  const lastNameDescriptor = {
    property: 'lastName',
    isRequired: true,
  };

  const pinDescriptor = {
    property: 'pin',
    isRequired: true,
  };

  const storeDescriptor = {
    property: 'placeName',
    isRequired: true,
  };

  if (!hasPlaces) {
    return [firstNameDescriptor, lastNameDescriptor, pinDescriptor];
  }

  return [
    firstNameDescriptor,
    lastNameDescriptor,
    storeDescriptor,
    pinDescriptor,
  ];
}

export default function CashiersTable({
  cashiers,
  onAddClick,
  onDeleteClick,
  onEditClick,
  hasPlaces,
}) {
  return (
    <div className="cashiers-table">
      <div className="cashiers-table__title">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <Button className="btn-icon pull-right" onClick={onAddClick}>
          <IconLabel iconName="add">
            {i18next.t(LOCALIZATION.BUTTON_ADD_CASHIER_TITLE)}
          </IconLabel>
        </Button>
      </div>
      <EditableTable
        className="cashiers-table"
        emptyStateText={i18next.t(
          LOCALIZATION.EMPTY_PLACEHOLDER_NO_CASHIERS_MESSAGE,
        )}
        headers={getHeaders(hasPlaces)}
        isStatic
        onRowDeleted={onDeleteClick}
        onRowUpdateClick={onEditClick}
        rowDescriptors={getRowDescriptors(hasPlaces)}
        rows={cashiers}
      />
    </div>
  );
}

CashiersTable.propTypes = {
  cashiers: PropTypes.array,
  onAddClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
  hasPlaces: PropTypes.bool,
};
