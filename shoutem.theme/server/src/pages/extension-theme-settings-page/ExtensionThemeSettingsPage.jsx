import React, { PureComponent } from 'react';
import { Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Uri from 'urijs';
import {
  mapModelToView,
  mapViewToModel,
  resetForm,
  resolveForm,
} from '@shoutem/react-form-builder';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchTheme,
  getExtension,
  getTheme,
  updateExtensionActiveTheme,
  fetchAllFonts,
  getAllFonts,
} from '@shoutem/redux-api-sdk';
import { isInitialized } from '@shoutem/redux-io';
import { loadExtension } from '../../redux';
import { pageParameters, prepareSchemaForCustomFonts } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

class ExtensionThemeSettingsPage extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      schema: null,
      resourceForm: null,
    };
  }

  componentDidMount() {
    const { activeThemeId, theme, extension, fonts, fetchAllFonts, fetchTheme } = this.props;

    if (!isInitialized(fonts)) {
      fetchAllFonts().catch(() => console.warn('Unable to fetch fonts. Feature is probably not enabled'));
    }

    if (!isInitialized(theme)) {
      fetchTheme(activeThemeId);
    }

    if (isInitialized(extension)) {
      this.handleExtensionScheme(extension);
    }
  }

  async handleExtensionScheme(extension) {
    const { loadExtension } = this.props;
    const extensionId = _.get(extension, 'extension');

    try {
      const extensionResponse = await loadExtension(extensionId);
      const data = _.get(extensionResponse, 'payload.data.attributes');
      const extensionThemes = _.get(data, 'extensionThemes');
      const extensionLocation = _.get(data, 'location.extension.package');
      const extensionTheme = _.find(extensionThemes, {
        name: pageParameters.getExtensionTheme(),
      });
      const extensionThemePath = _.get(extensionTheme, 'path');

      const url = new Uri(extensionLocation).segment(extensionThemePath);
      const extensionSchemaResponse = await fetch(url);
      const extensionSchema = await extensionSchemaResponse.json();

      this.prepareForm(extensionSchema);
    } catch (error) {
      // do nothing
    }
  }

  handleRevert() {
    const { schema, revertFormChanges } = this.props;
    const formKey = _.get(schema, 'name', 'resource');

    return revertFormChanges(formKey);
  }

  async handleSubmit(view) {
    const {
      activeThemeId,
      theme,
      extensionName,
      fetchTheme,
      updateExtensionActiveTheme,
    } = this.props;
    const { schema } = this.state;

    // fetching the latest theme as another tab could change theme
    const themeResponse = await fetchTheme(activeThemeId);
    const themeVariables = _.get(themeResponse, [
      'payload',
      'data',
      'attributes',
      'settings',
      'variables',
    ]);
    const latestTheme = _.set(
      _.cloneDeep(theme),
      'settings.variables',
      themeVariables,
    );

    const model = mapViewToModel(schema, view);

    await updateExtensionActiveTheme(latestTheme, extensionName, model);
  }

  prepareForm(schema) {
    const { resourceForm } = this.state;

    if (!schema) {
      return;
    }

    if (resourceForm) {
      return;
    }

    const formKey = _.get(schema, 'name', 'resource');
    this.setState({
      schema,
      resourceForm: resolveForm(schema, { formKey, reducerKey: 'form' }),
    });
  }

  renderButtonToolbar({ submitting, disabled, error }) {
    return (
      <div>
        <ButtonToolbar className="form-button-toolbar">
          <Button
            bsSize="large"
            bsStyle="primary"
            disabled={disabled}
            type="submit"
          >
            <LoaderContainer isLoading={submitting}>
              {i18next.t(LOCALIZATION.SAVE)}
            </LoaderContainer>
          </Button>
          <Button
            bsSize="large"
            disabled={disabled}
            onClick={this.handleRevert}
          >
            {i18next.t(LOCALIZATION.REVERT)}
          </Button>
        </ButtonToolbar>
        {error && (
          <div className="has-error">
            <HelpBlock>{error}</HelpBlock>
          </div>
        )}
      </div>
    );
  }

  renderForm() {
    const { theme, fonts, extensionName, ownExtensionName } = this.props;
    const { schema, resourceForm: ResourceForm } = this.state;

    if (!ResourceForm) {
      return null;
    }

    const customSchema = prepareSchemaForCustomFonts(schema, fonts);
    const values = _.get(theme, `settings.variables.${extensionName}`);
    const initialValues = mapModelToView(schema, values);
    const languageData = i18next.getDataByLanguage(i18next.language);

    // merging localization for parent and child extension
    const localizationExt = _.get(languageData, extensionName);
    const localizationOwnExt = _.get(languageData, ownExtensionName);
    const localization = _.merge({}, localizationOwnExt, localizationExt);

    return (
      <ResourceForm
        className="extension-theme-form"
        schema={customSchema}
        ownInitialValues={initialValues}
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        renderFooter={this.renderButtonToolbar}
        localization={localization}
      />
    );
  }

  render() {
    const { theme, fonts, extension } = this.props;
    const { schema } = this.state;

    const isLoading =
      !isInitialized(fonts) ||
      !isInitialized(theme) ||
      !isInitialized(extension) ||
      !schema;

    return (
      <LoaderContainer
        className="extension-theme-settings__loader-container"
        isLoading={isLoading}
      >
        {this.renderForm()}
      </LoaderContainer>
    );
  }
}

ExtensionThemeSettingsPage.propTypes = {
  extension: PropTypes.object.isRequired,
  extensionName: PropTypes.string.isRequired,
  fetchAllFonts: PropTypes.string.isRequired,
  fetchTheme: PropTypes.func.isRequired,
  loadExtension: PropTypes.func.isRequired,
  ownExtensionName: PropTypes.string.isRequired,
  revertFormChanges: PropTypes.func.isRequired,
  updateExtensionActiveTheme: PropTypes.func.isRequired,
  activeThemeId: PropTypes.string,
  schema: PropTypes.object,
  theme: PropTypes.object,
};

ExtensionThemeSettingsPage.defaultProps = {
  activeThemeId: undefined,
  schema: undefined,
  theme: undefined,
};

function mapStateToProps(state, ownProps) {
  const { activeThemeId, extensionName, ownExtensionName } = ownProps;

  const fonts = getAllFonts(state);
  const theme = getTheme(state, activeThemeId);
  const extension = getExtension(state, extensionName);

  return {
    activeThemeId,
    extensionName,
    ownExtensionName,
    theme,
    fonts,
    extension,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadExtension: extensionId => dispatch(loadExtension(extensionId)),
    fetchTheme: themeId => dispatch(fetchTheme(themeId)),
    fetchAllFonts: () => dispatch(fetchAllFonts()),
    revertFormChanges: formKey => dispatch(resetForm(formKey)),
    updateExtensionActiveTheme: (theme, canonicalName, variables) =>
      dispatch(updateExtensionActiveTheme(theme, canonicalName, variables)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExtensionThemeSettingsPage);
