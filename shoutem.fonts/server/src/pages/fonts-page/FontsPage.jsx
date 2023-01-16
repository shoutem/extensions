import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  createFont,
  CustomFontsTable,
  DefaultFontsTable,
  DeleteFontModal,
  downloadFont,
  FontModal,
  getAllFonts,
  loadAllFonts,
  removeFont,
  updateFont,
} from 'src/modules/fonts';
import { shoutemUrls } from 'src/services';
import { AssetManager } from '@shoutem/assets-sdk';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { isInitialized, isValid, shouldLoad } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

class FontsPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { appId } = props;
    this.uploader = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: shoutemUrls.appsApi(),
    });

    this.state = {
      showEditModal: false,
      showDeleteModal: false,
      font: null,
    };
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentDidUpdate(prevProps) {
    this.checkData(this.props, prevProps);
  }

  checkData(nextProps, props = null) {
    const { loadAllFonts } = this.props;

    if (shouldLoad(nextProps, props, 'fonts')) {
      const { appId } = this.props;
      loadAllFonts(appId);
    }
  }

  handleAddClick() {
    this.setState({ showEditModal: true });
  }

  handleDeletePress(fontToDelete) {
    this.setState({ showDeleteModal: true, fontToDelete });
  }

  handleDeleteCancel() {
    this.setState({ showDeleteModal: false, fontToDelete: null });
  }

  handleDeleteConfirm(fontToDelete) {
    const { appId, removeFont } = this.props;

    const fontId = _.get(fontToDelete, 'id');

    removeFont(appId, fontId)
      .then(this.handleDeleteCancel)
      .catch(e => {
        console.error(e);
        this.handleDeleteCancel();
      });
  }

  handleEditClick(font) {
    this.setState({
      font,
      showEditModal: true,
    });
  }

  handleHideEditModal() {
    this.setState({
      showEditModal: false,
      font: null,
    });
  }

  handleToggleClick(fontId, include) {
    const { extension, updateExtensionSettings } = this.props;
    let excludedFonts = _.cloneDeep(
      _.get(extension, 'settings.excludedFonts', []),
    );

    if (include) {
      excludedFonts.push(fontId);
    } else {
      excludedFonts = excludedFonts.filter(v => v !== fontId);
    }

    excludedFonts = _.uniq(excludedFonts);

    return updateExtensionSettings(extension, {
      excludedFonts,
    });
  }

  handleFontCreate(font) {
    const { appId, createFont } = this.props;
    return createFont(appId, font);
  }

  handeFontUpdate(fontId, data) {
    const { appId, updateFont } = this.props;
    return updateFont(appId, fontId, data);
  }

  render() {
    const { fonts, extension, defaultFonts, customFonts } = this.props;
    const { showEditModal, font, showDeleteModal, fontToDelete } = this.state;

    const excludedFonts = _.get(extension, 'settings.excludedFonts', []);
    const isLoading = !isInitialized(fonts) || !isValid(fonts);

    return (
      <div className="fonts-page">
        {!showEditModal && (
          <>
            <Alert className="fonts-alert">
              {i18next.t(LOCALIZATION.INFO_DESCRIPTION)}
            </Alert>
            <LoaderContainer
              isLoading={isLoading}
              isOverlay={isInitialized(fonts)}
            >
              <DefaultFontsTable
                fonts={defaultFonts}
                excludedFonts={excludedFonts}
                onToggleClick={this.handleToggleClick}
              />
              <CustomFontsTable
                fonts={customFonts}
                onAddClick={this.handleAddClick}
                onDeleteClick={this.handleDeletePress}
                onEditClick={this.handleEditClick}
                onDownloadClick={downloadFont}
              />
            </LoaderContainer>
          </>
        )}
        {showEditModal && (
          <FontModal
            assetManager={this.uploader}
            font={font}
            fonts={fonts}
            onHide={this.handleHideEditModal}
            onAddClick={this.handleFontCreate}
            onEditClick={this.handeFontUpdate}
          />
        )}
        {showDeleteModal && (
          <DeleteFontModal
            onSubmit={this.handleDeleteConfirm}
            onCancel={this.handleDeleteCancel}
            font={fontToDelete}
          />
        )}
      </div>
    );
  }
}

FontsPage.propTypes = {
  appId: PropTypes.string.isRequired,
  createFont: PropTypes.func.isRequired,
  customFonts: PropTypes.array.isRequired,
  defaultFonts: PropTypes.array.isRequired,
  extension: PropTypes.object.isRequired,
  fonts: PropTypes.array.isRequired,
  loadAllFonts: PropTypes.func.isRequired,
  removeFont: PropTypes.func.isRequired,
  updateExtensionSettings: PropTypes.func.isRequired,
  updateFont: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const fonts = getAllFonts(state);
  const defaultFonts = _.filter(fonts, { default: true });
  const customFonts = _.filter(fonts, { default: false });

  return {
    fonts,
    defaultFonts,
    customFonts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAllFonts: appId => dispatch(loadAllFonts(appId)),
    createFont: (appId, attributes) => dispatch(createFont(appId, attributes)),
    updateFont: (appId, fontId, attributes) =>
      dispatch(updateFont(appId, fontId, attributes)),
    removeFont: (appId, fontId) => dispatch(removeFont(appId, fontId)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FontsPage);
