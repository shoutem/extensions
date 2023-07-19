import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import Select from 'react-select';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
} from 'react-bootstrap';
import {
  FontIcon,
  FontIconPopover,
  LoaderContainer,
  RadioSelector,
} from '@shoutem/react-web-ui';
import {
  fetchExtension,
  updateExtensionSettings,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import { DEFAULT_EXTENSION_SETTINGS } from '../../const';
import { getBannerPlacementOptions, getAdContentRatings } from '../../services';
import LOCALIZATION from './localization';
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
      ..._.merge({ ...DEFAULT_EXTENSION_SETTINGS }, props.settings),
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
    return event => {
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
    const {
      iOSAdAppId,
      iOSBannerAdId,
      iOSInterstitialAdId,
      AndroidAdAppId,
      AndroidBannerAdId,
      AndroidInterstitialAdId,
    } = this.state;
    const { settings: oldSettings } = this.props;

    const newSettings = _.omit(this.state, 'loading');
    const iOSConfigured =
      !_.isEmpty(iOSAdAppId) &&
      (!_.isEmpty(iOSBannerAdId) || !_.isEmpty(iOSInterstitialAdId));
    const androidConfigured =
      !_.isEmpty(AndroidAdAppId) &&
      (!_.isEmpty(AndroidBannerAdId) || !_.isEmpty(AndroidInterstitialAdId));
    const previousSettings = _.merge(
      { ...DEFAULT_EXTENSION_SETTINGS },
      oldSettings,
    );

    return (
      !_.isEqual(newSettings, previousSettings) &&
      (iOSConfigured || androidConfigured)
    );
  }

  handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, {
      ..._.omit(this.state, 'loading'),
    })
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const {
      loading,
      iOSBannerAdId,
      iOSInterstitialAdId,
      iOSAdAppId,
      AndroidAdAppId,
      AndroidInterstitialAdId,
      AndroidBannerAdId,
      maxAdContentRating,
      tagForChildDirectedTreatment,
      tagForUnderAgeOfConsent,
      bannerPlacement,
      keywords,
    } = this.state;

    const bannerPlacementOptions = getBannerPlacementOptions();
    const adContentRatings = getAdContentRatings();

    const disabled = !this.saveEnabled();

    return (
      <div className="ads-settings-page">
        <form onSubmit={this.handleSubmit}>
          <h3>{i18next.t(LOCALIZATION.CONFIGURATION_TITLE)}</h3>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_IOS_ADMOB_APP_ID_TITLE)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iOSAdAppId')}
              type="text"
              value={iOSAdAppId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_ANDROID_ADMOB_APP_ID_TITLE)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('AndroidAdAppId')}
              type="text"
              value={AndroidAdAppId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_MAX_AD_CONTENT_RATING_TITLE)}
            </ControlLabel>
            <Select
              clearable={false}
              name="ad-rating"
              onChange={this.handleAdContentRatingChange}
              options={adContentRatings}
              styleName="ad-rating-select"
              value={maxAdContentRating}
            />
            <Checkbox
              checked={tagForChildDirectedTreatment}
              name="tagForChildDirectedTreatment"
              onChange={this.handleToggleCheckbox(
                'tagForChildDirectedTreatment',
              )}
            >
              {i18next.t(LOCALIZATION.FORM_CHILD_DIRECT_TREATMENT_TITLE)}
            </Checkbox>
            <Checkbox
              checked={tagForUnderAgeOfConsent}
              name="tagForUnderAgeOfConsent"
              onChange={this.handleToggleCheckbox('tagForUnderAgeOfConsent')}
            >
              {i18next.t(LOCALIZATION.FORM_UNDER_AGE_CONTENT_TITLE)}
            </Checkbox>
          </FormGroup>
          <h3>{i18next.t(LOCALIZATION.BANNER_ADS_TITLE)}</h3>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_IOS_BANNER_AD_UNIT_ID_TITLE)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iOSBannerAdId')}
              type="text"
              value={iOSBannerAdId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_ANDROID_BANNER_AD_UNIT_ID_TITLE)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('AndroidBannerAdId')}
              type="text"
              value={AndroidBannerAdId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_BANNER_PLACEMENT_TITLE)}
            </ControlLabel>
            <FontIconPopover
              message={i18next.t(LOCALIZATION.FORM_BANNER_PLACEMENT_INFO)}
            >
              <FontIcon className="icon-popover" name="info" size="24px" />
            </FontIconPopover>
            <RadioSelector
              activeValue={bannerPlacement}
              className="ads-settings-selector"
              groupName="bannerPlacement"
              onSelect={this.handleBannerPlacementChange}
              options={bannerPlacementOptions}
            />
          </FormGroup>
          <h3>{i18next.t(LOCALIZATION.INTERSTITIAL_ADS_TITLE)}</h3>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_IOS_INTERSTITIAL_AD_UNIT_ID_TITLE)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iOSInterstitialAdId')}
              type="text"
              value={iOSInterstitialAdId}
            />
            <ControlLabel>
              {i18next.t(
                LOCALIZATION.FORM_ANDROID_INTERSTITIAL_AD_UNIT_ID_TITLE,
              )}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('AndroidInterstitialAdId')}
              type="text"
              value={AndroidInterstitialAdId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_INTERSTITIAL_KEYWORDS)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('keywords')}
              type="text"
              value={keywords}
            />
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={disabled}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.BUTTON_SUBMIT_TITLE)}
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
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdSettingsPage);
