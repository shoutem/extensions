import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { invalidateCurrentBuild } from 'src/redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchShortcuts,
  getExtension,
  getShortcuts,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { isBusy, isInitialized, shouldLoad } from '@shoutem/redux-io/status';
import { ARROW_UNICODE, DEFAULT_LOCALE } from '../../const';
import { getAppCategories, loadAppCategories } from '../../modules/categories';
import {
  buildShortcutCategoryTree,
  createLanguageOptions,
} from '../../services';
import { ScreenTable } from './components';
import LOCALIZATION from './localization';
import './style.scss';

function resolveTranslationOptions(translationOptions) {
  return _.filter(translationOptions, option => {
    return option.value !== DEFAULT_LOCALE.value;
  });
}

class CategoriesPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const categoryTranslations = _.get(
      props,
      'extension.settings.categories',
      {},
    );

    this.state = {
      initialCategoryTranslations: categoryTranslations,
      categoryTranslations,
      translationOptions: [],
      shortcutCategoryTree: null,
      translateTo: null,
      error: null,
    };
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { shortcutCategoryTree } = this.state;
    const { languageCodes, extension } = props;
    const {
      languageCodes: nextLanguageCodes,
      shortcuts: nextShortcuts,
      categories: nextCategories,
    } = nextProps;

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      this.props.fetchShortcuts();
    }

    if (shouldLoad(nextProps, props, 'categories')) {
      this.props.loadAppCategories();
    }

    if (isInitialized(extension)) {
      const { settings: extSettings } = extension;
      const { settings: nextExtSettings } = extension;

      if (nextExtSettings !== extSettings) {
        this.setState({
          categoryTranslations: nextExtSettings.categories,
        });
      }
    }

    if (
      isInitialized(nextShortcuts) &&
      isInitialized(nextCategories) &&
      shortcutCategoryTree === null
    ) {
      this.handleBuildShortcutCategoryTree(nextShortcuts, nextCategories);
    }

    if (languageCodes !== nextLanguageCodes) {
      const languageOptions = createLanguageOptions(nextLanguageCodes);

      const translationOptions = _.reduce(
        languageOptions,
        (availableTranslations, languageOption) => {
          const { value } = languageOption;
          const label = `${DEFAULT_LOCALE.label} ${ARROW_UNICODE} ${languageOption.label}`;
          const title = languageOption.label;

          if (languageOption.value === DEFAULT_LOCALE.value) {
            return availableTranslations;
          }

          return [
            ...availableTranslations,
            {
              value,
              label,
              title,
            },
          ];
        },
        [],
      );

      this.setState({ translationOptions });
    }
  }

  handleBuildShortcutCategoryTree(shortcuts, categories) {
    const shortcutCategoryTree = buildShortcutCategoryTree(
      shortcuts,
      categories,
    );

    this.setState({ shortcutCategoryTree });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { updateExtensionSettings, invalidateCurrentBuild } = this.props;
    const { categoryTranslations: categories } = this.state;

    this.setState({ error: null });

    const settingsPatch = {
      categories,
    };

    updateExtensionSettings(settingsPatch)
      .then(this.setState({ initialCategoryTranslations: categories }))
      .then(invalidateCurrentBuild)
      .catch(({ payload: { message: error } }) => this.setState({ error }));
  }

  handleTranslationChange(translateTo) {
    this.setState({ translateTo });
  }

  handleTranslateInputChange(translation) {
    const { categoryTranslations } = this.state;

    this.setState({
      categoryTranslations: _.merge({}, categoryTranslations, {
        [translation.id]: {
          [translation.languageCode]: translation.value,
        },
      }),
    });
  }

  render() {
    const { extension, shortcuts, categories } = this.props;
    const {
      initialCategoryTranslations,
      translationOptions,
      translateTo,
      categoryTranslations,
      shortcutCategoryTree,
      error,
    } = this.state;

    const resolvedTranslationOptions = resolveTranslationOptions(
      translationOptions,
    );

    const resolvedTranslateTo =
      translateTo || _.head(resolvedTranslationOptions);

    const isLoading = !isInitialized(extension) || isBusy(extension);
    const hasChanges =
      JSON.stringify(initialCategoryTranslations) !==
      JSON.stringify(categoryTranslations);

    if (!resolvedTranslateTo) {
      return <p>{i18next.t(LOCALIZATION.NO_LANGUAGES_ADDED_LABEL)}</p>;
    }

    const isTreeLoading =
      !isInitialized(shortcuts) ||
      isBusy(shortcuts) ||
      !isInitialized(categories) ||
      isBusy(categories) ||
      !shortcutCategoryTree;

    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.SELECT_LANGUAGE_LABEL)}
            </ControlLabel>
            <LoaderContainer isLoading={isLoading}>
              <Select
                onChange={this.handleTranslationChange}
                value={resolvedTranslateTo}
                autoBlur
                clearable={false}
                options={resolvedTranslationOptions}
              />
            </LoaderContainer>
          </FormGroup>
          <FormGroup>
            <ScreenTable
              isLoading={isTreeLoading}
              screens={shortcutCategoryTree}
              translations={categoryTranslations}
              translateTo={resolvedTranslateTo}
              onChange={this.handleTranslateInputChange}
            />
          </FormGroup>
        </form>
        <div className="categories-page__button">
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              disabled={!hasChanges}
              onClick={this.handleSave}
            >
              <LoaderContainer isLoading={isLoading}>
                {i18next.t(LOCALIZATION.BUTTON_TEXT)}
              </LoaderContainer>
            </Button>
          </ButtonToolbar>
        </div>
      </>
    );
  }
}

CategoriesPage.propTypes = {
  categories: PropTypes.array.isRequired,
  extension: PropTypes.object.isRequired,
  fetchShortcuts: PropTypes.func.isRequired,
  invalidateCurrentBuild: PropTypes.func.isRequired,
  loadAppCategories: PropTypes.func.isRequired,
  shortcuts: PropTypes.array.isRequired,
  updateExtensionSettings: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  const extension = getExtension(state, extensionName);
  const translations = _.get(extension, 'settings.translations');
  const languageCodes = _.keys(translations).sort();
  const shortcuts = getShortcuts(state);
  const categories = getAppCategories(state);

  return {
    extension,
    translations,
    languageCodes,
    shortcuts,
    categories,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extension, appId } = ownProps;

  return {
    updateExtensionSettings: settingsPatch =>
      dispatch(updateExtensionSettings(extension, settingsPatch)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    loadAppCategories: () => dispatch(loadAppCategories(appId)),
    invalidateCurrentBuild: () => dispatch(invalidateCurrentBuild(appId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage);
