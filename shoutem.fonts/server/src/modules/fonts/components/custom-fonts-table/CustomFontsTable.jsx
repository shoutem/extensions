import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  EditableTable,
  FontIcon,
  IconLabel,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class CustomFontsTable extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
      downloading: false,
    };
  }

  getTableHeader() {
    return [i18next.t(LOCALIZATION.NAME), '', '', ''];
  }

  getRowDescriptors() {
    const nameDescriptor = {
      property: 'name',
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
      nameDescriptor,
      editDescriptor,
      deleteDescriptor,
      downloadDescriptor,
    ];
  }

  handleDownload(event, font) {
    const { onDownloadClick } = this.props;
    event.stopPropagation();

    this.setState({ downloading: true });
    onDownloadClick(font).then(() => {
      this.setState({ downloading: false });
    });
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

    return (
      <Button
        className="btn-icon"
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
    const { downloading } = this.state;

    return (
      <LoaderContainer size="22px" isLoading={downloading}>
        <Button
          className="btn-icon"
          onClick={event => this.handleDownload(event, item)}
        >
          <FontIcon name="download" size="24px" />
        </Button>
      </LoaderContainer>
    );
  }

  render() {
    const { fonts, onAddClick } = this.props;
    const { inProgress } = this.state;

    return (
      <div className="custom-fonts-table">
        <div className="fonts-table__title">
          <h3>{i18next.t(LOCALIZATION.CUSTOM_FONTS)}</h3>
          <Button className="btn-icon pull-right" onClick={onAddClick}>
            <IconLabel iconName="add">
              {i18next.t(LOCALIZATION.ADD_FONT)}
            </IconLabel>
          </Button>
        </div>
        <LoaderContainer isLoading={inProgress} isOverlay>
          <EditableTable
            isStatic
            className="fonts-table"
            rows={fonts}
            canUpdate={false}
            canDelete={false}
            headers={this.getTableHeader()}
            rowDescriptors={this.getRowDescriptors()}
          />
        </LoaderContainer>
      </div>
    );
  }
}

CustomFontsTable.propTypes = {
  fonts: PropTypes.array.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onDownloadClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
