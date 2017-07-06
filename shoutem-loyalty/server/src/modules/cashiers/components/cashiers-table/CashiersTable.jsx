import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { IconLabel, EditableTable } from '@shoutem/react-web-ui';
import './style.scss';

const TABLE_HEADERS = ['First Name', 'Last Name', 'PIN', ''];
const TABLE_ROW_DESCRIPTORS = [
  { property: 'firstName', isRequired: true },
  { property: 'lastName', isRequired: true },
  { property: 'pin', isRequired: true },
];

export default function CashiersTable({
  cashiers,
  onAddCashierClick,
  onEditCashierClick,
  onDeleteCashierClick,
}) {
  return (
    <div className="cashiers-table">
      <div className="cashiers-table__title">
        <h3>Cashier settings</h3>
        <Button
          className="btn-icon pull-right"
          onClick={onAddCashierClick}
        >
          <IconLabel iconName="add">
            Add cashier
          </IconLabel>
        </Button>
      </div>
      <EditableTable
        className="cashiers-table"
        rows={cashiers}
        headers={TABLE_HEADERS}
        rowDescriptors={TABLE_ROW_DESCRIPTORS}
        onRowUpdated={onEditCashierClick}
        onRowDeleted={onDeleteCashierClick}
        emptyStateText="No cashiers yet"
        isStatic
      />
    </div>
  );
}

CashiersTable.propTypes = {
  cashiers: PropTypes.array,
  onAddCashierClick: PropTypes.func,
  onEditCashierClick: PropTypes.func,
  onDeleteCashierClick: PropTypes.func,
};

