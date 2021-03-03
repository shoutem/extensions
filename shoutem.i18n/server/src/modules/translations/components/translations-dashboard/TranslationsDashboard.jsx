import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { IconLabel, ConfirmModal } from '@shoutem/react-web-ui';
import { resolveTranslationRows } from 'src/services';
import TranslationsModal from '../translations-modal';
import { TranslationsTable } from '../translations-table';
import LOCALIZATION from './localization';
import './style.scss';

export default class TranslationsDashboard extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleAddTranslationClick() {
    this.refs.translationModal.show();
  }

  handleTranslationTableUpdateClick(language) {
    this.refs.translationModal.show(language);
  }

  handleTranslationTableDeleteClick(language) {
    const { onDelete } = this.props;
    const { code, name } = language;

    this.refs.confirm.show({
      title: i18next.t(LOCALIZATION.DELETE_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MESSAGE, { name }),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_BTN_LABEL),
      abortLabel: i18next.t(LOCALIZATION.CANCEL_BTN_LABEL),
      confirmBsStyle: 'danger',
      onConfirm: () => onDelete(code),
    });
  }

  handleTranslationTableDownloadClick(language) {
    const translationUrl = _.get(language, 'url');
    const languageCode = _.get(language, 'code');

    return fetch(translationUrl)
      .then(response => response.blob())
      .then(jsonBlob => {
        const blobUrl = URL.createObjectURL(jsonBlob);
        const fileName = `translations-${languageCode}.json`;

        const link = document.createElement('a');
        link.setAttribute('href', blobUrl);
        link.setAttribute('download', fileName);

        document.body.appendChild(link);

        link.click();

        // Remove references
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      });
  }

  render() {
    const {
      translations,
      disabledTranslations,
      locale,
      assetManager,
      onCreate,
      onUpdate,
      onStatusChange,
    } = this.props;
    const rows = resolveTranslationRows(
      translations,
      locale,
      disabledTranslations,
    );

    const translationLanguageCodes = _.keys(translations);

    return (
      <div>
        <div className="translations-dashboard__title">
          <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
          <Button
            className="btn-icon translations-dashboard__btn-add pull-right"
            onClick={this.handleAddTranslationClick}
          >
            <IconLabel iconName="add">
              {i18next.t(LOCALIZATION.ADD_BTN_LABEL)}
            </IconLabel>
          </Button>
        </div>
        <TranslationsTable
          translations={rows}
          onDeleteClick={this.handleTranslationTableDeleteClick}
          onEditClick={this.handleTranslationTableUpdateClick}
          onDownloadClick={this.handleTranslationTableDownloadClick}
          onStatusChange={onStatusChange}
        />
        <ConfirmModal className="settings-page-modal-small" ref="confirm" />
        <TranslationsModal
          usedLanguageCodes={translationLanguageCodes}
          onCreate={onCreate}
          onUpdate={onUpdate}
          assetManager={assetManager}
          ref="translationModal"
        />
      </div>
    );
  }
}

TranslationsDashboard.propTypes = {
  translations: PropTypes.array,
  disabledTranslations: PropTypes.array,
  locale: PropTypes.func,
  assetManager: PropTypes.object,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
};
