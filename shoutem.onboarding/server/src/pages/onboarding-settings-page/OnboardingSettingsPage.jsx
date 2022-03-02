import React, { Component } from 'react';
import { Button, FormGroup, HelpBlock } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { AssetManager } from '@shoutem/assets-sdk';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  getExtension,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { isBusy } from '@shoutem/redux-io';
import { EmptyPageSettings } from './components/empty-state-settings-page';
import { Page } from './components/page';
import LOCALIZATION from './localization';
import './style.scss';

const PAGE_LIMIT = 10;

function textPositionOptions() {
  return [
    {
      value: 'top',
      label: i18next.t(LOCALIZATION.TEXT_POSITION_LABEL_TOP),
    },
    {
      value: 'center',
      label: i18next.t(LOCALIZATION.TEXT_POSITION_LABEL_MIDDLE),
    },
    {
      value: 'bottom',
      label: i18next.t(LOCALIZATION.TEXT_POSITION_LABEL_BOTTOM),
    },
  ];
}

class OnboardingSettingsPage extends Component {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    props.fetchExtension();

    const { appId } = props;
    const { page } = context;
    const appsUrl = _.get(page, 'pageContext.url.apps', {});

    this.textPositionOptions = textPositionOptions();
    this.EMPTY_PAGE = {
      title: undefined,
      description: undefined,
      imageUrl: undefined,
      textPosition: this.textPositionOptions[1],
    };

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    this.state = {
      pageSettings: _.get(props, 'extension.settings.pageSettings', []),
      error: null,
    };
  }

  onDeletePage(index) {
    const { pageSettings } = this.state;
    const { extension, updateExtensionSettings } = this.props;
    const newPageSettings = [...pageSettings];

    _.remove(newPageSettings, (_page, key) => key === index);

    this.setState({ pageSettings: newPageSettings });

    updateExtensionSettings(extension, { pageSettings: newPageSettings });
  }

  onPageSettingsChanged(settings, index) {
    const { pageSettings } = this.state;
    const newSettings = [...pageSettings];

    newSettings[index] = settings;

    this.setState({ pageSettings: newSettings });
  }

  addPage() {
    const { pageSettings } = this.state;

    if (_.size(pageSettings) < PAGE_LIMIT) {
      const newPages = [...pageSettings];
      newPages.push(this.EMPTY_PAGE);
      this.setState({ pageSettings: newPages });
    }
  }

  hasChanges() {
    const { pageSettings: newPageSettings } = this.state;
    const { extensionSettings } = this.props;

    const pageSettings = _.get(extensionSettings, 'pageSettings');

    return !_.isEqual(newPageSettings, pageSettings);
  }

  handleSave() {
    const { extension, updateExtensionSettings } = this.props;
    const { pageSettings } = this.state;

    if (!this.isFormValid()) {
      this.setState({ error: i18next.t(LOCALIZATION.EMPTY_FIELDS_ERROR) });
      return;
    }

    this.setState({ error: null });
    updateExtensionSettings(extension, { pageSettings });
  }

  isFormValid() {
    const { pageSettings } = this.state;

    const findEmptyFields = _.filter(
      pageSettings,
      page =>
        _.isEmpty(page.imageUrl) ||
        _.isEmpty(page.description) ||
        _.isEmpty(page.title),
    );

    return _.isEmpty(findEmptyFields);
  }

  render() {
    const { extension } = this.props;
    const { pageSettings, error } = this.state;

    const canAddMore = _.size(pageSettings) < PAGE_LIMIT;

    if (_.isEmpty(pageSettings)) {
      return <EmptyPageSettings onEnable={this.addPage} />;
    }

    return (
      <div className="main-container">
        <h3>{i18next.t(LOCALIZATION.ONBOARDING_SETTINGS_TITLE)}</h3>
        <FormGroup>
          {_.map(pageSettings, (page, key) => (
            <Page
              key={key}
              assetManager={this.assetManager}
              index={_.indexOf(pageSettings, page)}
              onDelete={this.onDeletePage}
              onSettingsChange={this.onPageSettingsChanged}
              page={page}
              textPositionOptions={this.textPositionOptions}
            />
          ))}
        </FormGroup>
        <div className="button-group">
          <Button
            bsStyle="primary"
            disabled={!canAddMore}
            onClick={this.addPage}
          >
            {i18next.t(LOCALIZATION.ADD_PAGE_BUTTON)}
          </Button>
          <Button
            bsStyle="primary"
            disabled={!this.hasChanges()}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={isBusy(extension)}>
              {i18next.t(LOCALIZATION.SAVE_PAGE_BUTTON)}
            </LoaderContainer>
          </Button>
        </div>
        <HelpBlock className="text-error">{error}</HelpBlock>
      </div>
    );
  }
}

OnboardingSettingsPage.propTypes = {
  appId: PropTypes.string.isRequired,
  extension: PropTypes.object.isRequired,
  extensionSettings: PropTypes.object.isRequired,
  fetchExtension: PropTypes.func.isRequired,
  updateExtensionSettings: PropTypes.func.isRequired,
};

OnboardingSettingsPage.contextTypes = {
  page: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const extensionSettings = _.get(extension, 'settings');

  return {
    extension,
    extensionSettings,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnboardingSettingsPage);
