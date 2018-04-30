import React, { Component, PropTypes } from 'react';
import {
  Button,
} from 'react-bootstrap';
import { IconLabel, ConfirmModal, EditableTable } from '@shoutem/react-web-ui';
import { prepareTranslations } from '../../services';
import TranslationsModal from '../translations-modal';
import './style.scss';

const translationsTableHeaders = ['Code', 'Language', ''];
const translationsTableRowDescriptions = [{ property: 'code' }, { property: 'name' }];

export default class TranslationsDashboard extends Component {
  constructor(props) {
    super(props);

    this.handleAddTranslationClick = this.handleAddTranslationClick.bind(this);
    this.handleTranslationTableUpdateClick = this.handleTranslationTableUpdateClick.bind(this);
    this.handleTranslationTableDeleteClick = this.handleTranslationTableDeleteClick.bind(this);

    this.state = {
      translations: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { translations } = props;
    const { translations: nextTranslations } = nextProps;

    if (translations !== nextTranslations) {
      this.setState({
        translations: prepareTranslations(nextTranslations),
      });
    }
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
      title: 'Delete translation',
      message: `Are you sure you want to delete ${name} translation?`,
      confirmLabel: 'Delete',
      confirmBsStyle: 'danger',
      onConfirm: () => onDelete(code),
    });
  }

  render() {
    const {
      assetManager,
      onCreate,
      onUpdate,
    } = this.props;

    const { translations } = this.state;

    return (
      <div>
        <div className="translations-dashboard__title">
          <h3>Translations</h3>
          <Button
            className="btn-icon translations-dashboard__btn-add pull-right"
            onClick={this.handleAddTranslationClick}
          >
            <IconLabel iconName="add">
              Add translation
            </IconLabel>
          </Button>
        </div>
        <EditableTable
          className="translations-dashboard__table"
          emptyStateText="No translations yet."
          headers={translationsTableHeaders}
          isStatic
          onRowDeleteClick={this.handleTranslationTableDeleteClick}
          onRowUpdateClick={this.handleTranslationTableUpdateClick}
          rowDescriptors={translationsTableRowDescriptions}
          rows={translations}
        />
        <ConfirmModal
          className="settings-page-modal-small"
          ref="confirm"
        />
        <TranslationsModal
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
  assetManager: PropTypes.object,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};
