import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';
import i18next from 'i18next';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getMappedCmsToCsvProperties, Table } from '@shoutem/cms-dashboard';
import ImporterCsvMappingItem from '../importer-csv-mapping-item';
import LOCALIZATION from './localization';

const CVS_MAPPING_FORM_STYLE = {
  paddingBottom: 30,
};

function resolveHeaders() {
  return [
    {
      id: 'cms-field',
      value: i18next.t(LOCALIZATION.HEADER_CMS_FIELD_LABEL),
    },
    {
      id: 'csv-column',
      value: i18next.t(LOCALIZATION.HEADER_CSV_COLUMN_LABEL),
    },
  ];
}

function resolveOptions(csvColumns) {
  return _.map(csvColumns, item => ({
    value: item,
    label: item,
  }));
}

export default class ImporterCsvMappingForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { schema, values } = props;

    const csvColumns = _.get(values, 'csvColumns');
    const cmsOptions = getMappedCmsToCsvProperties(schema);
    const csvOptions = resolveOptions(csvColumns);
    const headers = resolveHeaders();

    this.state = {
      headers,
      cmsOptions,
      csvOptions,
      mapping: {},
      inProgress: false,
    };
  }

  async handleSaveClick() {
    const { values, canonicalName } = this.props;
    const { mapping } = this.state;

    this.setState({ inProgress: true });

    const languageIds = _.get(values, 'languageIds');
    const schedule = _.get(values, 'schedule');

    const source = {
      type: 'csv',
      parameters: {
        file_url: _.get(values, 'fileUrl'),
        presentable_file_url: _.get(values, 'fileName'),
        schema_canonical_name: canonicalName,
        mapping,
      },
    };

    try {
      await this.props.onSubmit(languageIds, schedule, source);
    } catch (error) {
      // do nothing
      this.setState({ inProgress: false });

      return;
    }

    this.setState({ inProgress: false });
    this.props.onClose();
  }

  handleMappingChange(key, value) {
    const { mapping } = this.state;

    const newMapping = {
      ...mapping,
      [key]: {
        kind: 'column',
        value,
      },
    };

    this.setState({ mapping: newMapping });
  }

  renderItem(cmsOption) {
    const { csvOptions } = this.state;

    return (
      <ImporterCsvMappingItem
        cmsOption={cmsOption}
        csvOptions={csvOptions}
        onChange={this.handleMappingChange}
      />
    );
  }

  render() {
    const { abortTitle, confirmTitle } = this.props;
    const { headers, cmsOptions, inProgress } = this.state;

    return (
      <React.Fragment>
        <Modal.Body>
          <FormGroup style={CVS_MAPPING_FORM_STYLE}>
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_TITLE)}</ControlLabel>
            <Table
              columnHeaders={headers}
              items={cmsOptions}
              renderItem={this.renderItem}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>{abortTitle}</Button>
          <Button
            bsStyle="primary"
            onClick={this.handleSaveClick}
            disabled={inProgress}
          >
            <LoaderContainer isLoading={inProgress}>
              {confirmTitle}
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

ImporterCsvMappingForm.propTypes = {
  values: PropTypes.object,
  schema: PropTypes.object,
  canonicalName: PropTypes.string,
  abortTitle: PropTypes.string,
  confirmTitle: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};
