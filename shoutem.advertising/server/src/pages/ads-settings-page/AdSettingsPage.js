import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import Select from 'react-select';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
} from 'react-bootstrap';
import { LoaderContainer, RadioSelector } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  updateExtensionSettings,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import { BANNER_PLACEMENT_OPTIONS, AD_CONTENT_RATINGS } from '../../const';
import './style.scss';

class AdSettingsPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    settings: PropTypes.object,
    fetchExtensionAction: PropTypes.func,
    updateExtensionSettingsAction: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.fetchExtensionAction();

    this.state = {
      loading: false,
      ...props.settings,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  handleTextSettingChange(fieldName) {
    return (event) => {
      const newText = event.target.value;

      this.setState({ [fieldName]: newText });
    };
  }

  handleBannerPlacementChange(bannerPlacement) {
    this.setState({ bannerPlacement });
  }

  handleToggleCheckbox(fieldName) {
    return () => this.setState({ [fieldName]: !this.state[fieldName] });
  }

  handleAdContentRatingChange(rating) {
    this.setState({ maxAdContentRating: rating.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  saveEnabled() {
    const { iOSAdAppId, iOSBannerAdId, AndroidAdAppId, AndroidBannerAdId } = this.state;
    const { settings: previousSettings } = this.props;

    const newSettings = _.omit(this.state, 'loading');
    const iOSConfigured = !_.isEmpty(iOSAdAppId) && !_.isEmpty(iOSBannerAdId);
    const androidConfigured = !_.isEmpty(AndroidAdAppId) && !_.isEmpty(AndroidBannerAdId);

    return !_.isEqual(newSettings, previousSettings) && (iOSConfigured || androidConfigured);
  }

  handleSave() {
    const {
      extension,
      updateExtensionSettingsAction,
    } = this.props;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, { ..._.omit(this.state, 'loading') })
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const {
      loading,
      iOSBannerAdId,
      iOSAdAppId,
      AndroidAdAppId,
      AndroidBannerAdId,
      maxAdContentRating,
      tagForChildDirectedTreatment,
      tagForUnderAgeOfConsent,
      bannerPlacement,
    } = this.state;

    const disabled = !this.saveEnabled();

    return (
      <div className="ads-settings-page">
        <form onSubmit={this.handleSubmit}>
          <h3>Configuration</h3>
          <FormGroup>
            <ControlLabel>iOS AdMob App ID</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iOSAdAppId')}
              type="text"
              value={iOSAdAppId}
            />
            <ControlLabel>Android AdMob App ID</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('AndroidAdAppId')}
              type="text"
              value={AndroidAdAppId}
            />
            <ControlLabel>iOS Banner Ad Unit ID</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iOSBannerAdId')}
              type="text"
              value={iOSBannerAdId}
            />
            <ControlLabel>Android Banner Ad Unit ID</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('AndroidBannerAdId')}
              type="text"
              value={AndroidBannerAdId}
            />
            <h3>Settings</h3>
            <ControlLabel>Banner placement</ControlLabel>
            <RadioSelector
              activeValue={bannerPlacement}
              className="ads-settings-selector"
              groupName="bannerPlacement"
              onSelect={this.handleBannerPlacementChange}
              options={BANNER_PLACEMENT_OPTIONS}
            />
            <ControlLabel>Max Ad content rating</ControlLabel>
            <Select
              clearable={false}
              name="ad-rating"
              onChange={this.handleAdContentRatingChange}
              options={AD_CONTENT_RATINGS}
              styleName="ad-rating-select"
              value={maxAdContentRating}
            />
            <Checkbox
              checked={tagForChildDirectedTreatment}
              name="tagForChildDirectedTreatment"
              onChange={this.handleToggleCheckbox('tagForChildDirectedTreatment')}
            >
              Child directed treatment
            </Checkbox>
            <Checkbox
              checked={tagForUnderAgeOfConsent}
              name="tagForUnderAgeOfConsent"
              onChange={this.handleToggleCheckbox('tagForUnderAgeOfConsent')}
            >
              Under age of consent content
            </Checkbox>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={disabled}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={loading}>
              Save
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const settings = _.get(extension, 'settings', {});

  return {
    extension,
    settings,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtensionAction: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettingsAction: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdSettingsPage);
