import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';
import classNames from 'classnames';
import i18next from 'i18next';
import Select from 'react-select';
import { IMPORT_CAPABILITIES } from '../../const';
import { getImporterCapabilities } from '../../services';
import ImporterRssForm from '../importer-rss-form';
import ImporterCsvForm from '../importer-csv-form';
import ImporterCsvMappingForm from '../importer-csv-mapping-form';
import LOCALIZATION from './localization';

const IMPORTER_STEPS = {
  SELECT_SOURCE: 'select-source',
  CSV: 'csv',
  CSV_MAPPING: 'csv-mapping',
  RSS: 'rss',
};

function resolveSourceOptions(shortcut) {
  const capabilities = getImporterCapabilities(shortcut);
  const options = [];

  if (_.isEmpty(capabilities)) {
    return options;
  }

  if (_.includes(capabilities, IMPORT_CAPABILITIES.CSV)) {
    options.push({
      value: IMPORTER_STEPS.CSV,
      label: i18next.t(LOCALIZATION.CSV_SOURCE_LABEL),
    });
  }

  if (_.includes(capabilities, IMPORT_CAPABILITIES.RSS)) {
    options.push({
      value: IMPORTER_STEPS.RSS,
      label: i18next.t(LOCALIZATION.RSS_SOURCE_LABEL),
    });
  }

  return options;
}

export default class ImporterModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      show: false,
      inProgress: false,
      error: null,
      step: IMPORTER_STEPS.SELECT_SOURCE,
      values: {},
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  show(options) {
    if (this.state.show) {
      return;
    }

    // merge options and props
    const finalOptions = {
      ...this.props,
      ...options,
    };

    this.setState({
      show: true,
      step: IMPORTER_STEPS.SELECT_SOURCE,
      values: {},
      ...finalOptions,
    });
  }

  hide() {
    if (this.mounted) {
      this.setState({
        inProgress: false,
        show: false,
      });
    }
  }

  handleAbort() {
    const { onAbort } = this.state;

    if (!onAbort) {
      this.hide();
      return;
    }

    onAbort();
    this.hide();
  }

  handleSourceChanged(item) {
    const { values } = this.state;
    const value = _.get(item, 'value');

    const newValues = { ...values, source: value };
    this.setState({ values: newValues });
  }

  handleSourceNext() {
    const { values } = this.state;
    const value = _.get(values, 'source');

    this.setState({ step: value });
  }

  handleCsvFormNext(formValues) {
    const { values } = this.state;

    const newValues = { ...values, ...formValues };
    this.setState({ values: newValues, step: IMPORTER_STEPS.CSV_MAPPING });
  }

  renderCsvForm() {
    const { assetManager, languages } = this.props;

    return (
      <ImporterCsvForm
        assetManager={assetManager}
        languages={languages}
        onSubmit={this.handleCsvFormNext}
        onClose={this.handleAbort}
        loadCsvColumns={this.props.loadCsvColumns}
        abortTitle={i18next.t(LOCALIZATION.BUTTON_CANCEL_LABEL)}
        confirmTitle={i18next.t(LOCALIZATION.BUTTON_NEXT_LABEL)}
      />
    );
  }

  renderRssForm() {
    const { appId, apiUrl, canonicalName, languages } = this.props;

    return (
      <ImporterRssForm
        appId={appId}
        apiUrl={apiUrl}
        canonicalName={canonicalName}
        languages={languages}
        onSubmit={this.props.createImporter}
        onClose={this.handleAbort}
        abortTitle={i18next.t(LOCALIZATION.BUTTON_CANCEL_LABEL)}
        confirmTitle={i18next.t(LOCALIZATION.BUTTON_CREATE_LABEL)}
      />
    );
  }

  renderCsvMappingForm() {
    const { schema, canonicalName } = this.props;
    const { values } = this.state;

    return (
      <ImporterCsvMappingForm
        values={values}
        schema={schema}
        canonicalName={canonicalName}
        onSubmit={this.props.createImporter}
        onClose={this.handleAbort}
        abortTitle={i18next.t(LOCALIZATION.BUTTON_CANCEL_LABEL)}
        confirmTitle={i18next.t(LOCALIZATION.BUTTON_CREATE_LABEL)}
      />
    );
  }

  renderSource() {
    const { shortcut } = this.props;
    const { values } = this.state;

    const value = _.get(values, 'source');
    const options = resolveSourceOptions(shortcut);

    return (
      <React.Fragment>
        <Modal.Body>
          <FormGroup controlId="select-source">
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_SOURCE_TITLE)}
            </ControlLabel>
            <Select
              placeholder={i18next.t(
                LOCALIZATION.FORM_SOURCE_EMPTY_PLACEHOLDER_LABEL,
              )}
              onChange={this.handleSourceChanged}
              options={options}
              value={value}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleAbort}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL_LABEL)}
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.handleSourceNext}
            disabled={!value}
          >
            {i18next.t(LOCALIZATION.BUTTON_NEXT_LABEL)}
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  }

  render() {
    const { className } = this.props;
    const { show, step } = this.state;

    const classes = classNames('confirm-modal', className);

    return (
      <Modal dialogClassName={classes} onHide={this.handleAbort} show={show}>
        <Modal.Header>
          <Modal.Title>{i18next.t(LOCALIZATION.MODAL_TITLE)}</Modal.Title>
        </Modal.Header>
        {step === IMPORTER_STEPS.SELECT_SOURCE && this.renderSource()}
        {step === IMPORTER_STEPS.CSV && this.renderCsvForm()}
        {step === IMPORTER_STEPS.CSV_MAPPING && this.renderCsvMappingForm()}
        {step === IMPORTER_STEPS.RSS && this.renderRssForm()}
      </Modal>
    );
  }
}

ImporterModal.propTypes = {
  appId: PropTypes.number,
  apiUrl: PropTypes.string,
  assetManager: PropTypes.object,
  schema: PropTypes.object,
  shortcut: PropTypes.object,
  canonicalName: PropTypes.string,
  languages: PropTypes.array,
  loadCsvColumns: PropTypes.func,
  createImporter: PropTypes.func,
  className: PropTypes.string,
};
