import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { invalidate } from '@shoutem/redux-io';
import { ConfirmModal } from '@shoutem/react-web-ui';
import { ImporterTable, ImporterModal, ToggleContent } from '../../components';
import { deleteImporter, loadCsvColumns, createImporter } from '../../actions';
import { IMPORTERS } from '../../types';
import LOCALIZATION from './localization';
import './style.scss';

export class ImporterDashboard extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.importerDeleteModal = createRef();
    this.importerModal = createRef();
  }

  handleAddImporterClick() {
    this.importerModal.current.show();
  }

  handleDeleteImporterClick(importerId) {
    this.importerDeleteModal.current.show({
      title: i18next.t(LOCALIZATION.DELETE_MODAL_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MODAL_MESSAGE),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_CONFIRM_TITLE),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_ABORT_TITLE),
      onConfirm: () => this.props.deleteImporter(importerId),
    });
  }

  render() {
    const {
      appId,
      legacyApiUrl,
      schema,
      canonicalName,
      shortcut,
      importers,
      assetManager,
      languages,
      createImporter,
      loadCsvColumns,
    } = this.props;

    return (
      <ToggleContent
        className="toggle-importer-dashboard"
        title={i18next.t(LOCALIZATION.TITLE)}
      >
        <div className="importer-dashboard">
          <ImporterTable
            importers={importers}
            onAddImporter={this.handleAddImporterClick}
            onDeleteImporter={this.handleDeleteImporterClick}
          />
          <ConfirmModal
            className="importer-dashboard__delete settings-page-modal-small"
            ref={this.importerDeleteModal}
          />
          <ImporterModal
            className="importer-dashboard__create settings-page-modal-small"
            assetManager={assetManager}
            schema={schema}
            shortcut={shortcut}
            appId={appId}
            apiUrl={legacyApiUrl}
            canonicalName={canonicalName}
            languages={languages}
            loadCsvColumns={loadCsvColumns}
            createImporter={createImporter}
            ref={this.importerModal}
          />
        </div>
      </ToggleContent>
    );
  }
}

ImporterDashboard.propTypes = {
  assetManager: PropTypes.object,
  languages: PropTypes.array,
  schema: PropTypes.object,
  shortcut: PropTypes.object,
  appId: PropTypes.number,
  legacyApiUrl: PropTypes.string,
  parentCategoryId: PropTypes.number,
  canonicalName: PropTypes.string,
  importers: PropTypes.object,
  deleteImporter: PropTypes.func,
  createImporter: PropTypes.func,
  loadCsvColumns: PropTypes.func,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, parentCategoryId, canonicalName } = ownProps;

  return {
    createImporter: (languageIds, schedule, source) =>
      dispatch(
        createImporter(
          appId,
          parentCategoryId,
          canonicalName,
          languageIds,
          schedule,
          source,
        ),
      ).then(() => dispatch(invalidate(IMPORTERS))),
    loadCsvColumns: fileUrl =>
      dispatch(loadCsvColumns(appId, parentCategoryId, fileUrl)),
    deleteImporter: importerId =>
      dispatch(deleteImporter(appId, importerId)).then(() =>
        dispatch(invalidate(canonicalName)),
      ),
  };
}

export default connect(null, mapDispatchToProps)(ImporterDashboard);
