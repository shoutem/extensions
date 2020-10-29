import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import form from '../common/form';
import IconsAndText from '../common/IconsAndText';
import DropdownWrapper from '../common/DropdownWrapper';
import LAYOUT_LOCALIZATION from '../localization';
import LOCALIZATION from './localization';

function getConfiguration() {
  return {
    default: {
      iconSize: 'medium',
      inItemAlignment: 'left',
      listAlignment: 'top',
      textSize: 'small',
    },
    iconSize: {
      small: i18next.t(LOCALIZATION.ICON_SIZE_SMALL),
      medium: i18next.t(LOCALIZATION.ICON_SIZE_MEDIUM),
      large: i18next.t(LOCALIZATION.ICON_SIZE_LARGE),
    },
    textSize: {
      small: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_SMALL),
      medium: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_MEDIUM),
      large: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_LARGE),
    },
    inItemAlignment: {
      left: i18next.t(LOCALIZATION.IN_ITEM_ALIGNMENT_LEFT),
      center: i18next.t(LOCALIZATION.IN_ITEM_ALIGNMENT_CENTER),
      right: i18next.t(LOCALIZATION.IN_ITEM_ALIGNMENT_RIGHT),
    },
    listAlignment: {
      top: i18next.t(LOCALIZATION.LIST_ALIGNMENT_TOP),
      middle: i18next.t(LOCALIZATION.LIST_ALIGNMENT_MIDDLE),
      bottom: i18next.t(LOCALIZATION.LIST_ALIGNMENT_BOTTOM),
    },
  };
}

export class GeneralSettings extends Component {
  constructor(props) {
    super(props);

    this.configuration = getConfiguration();

    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm);
  }

  saveForm() {
    const layoutSettings = this.props.form.toObject();
    this.props.onSettingsChanged(layoutSettings);
  }

  render() {
    const { fields, settings, onSettingsChanged } = this.props;
    const {
      topOffset,
      listAlignment,
      inItemAlignment,
      iconSize,
      textSize,
    } = fields;
    const showIcon = _.get(settings, ['showIcon'], true);
    const showText = _.get(settings, 'showText', true);

    return (
      <div>
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={4}>
                <IconsAndText
                  settings={settings}
                  onSettingsChanged={onSettingsChanged}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_ICON_SIZE)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.iconSize}
                  defaultKey={this.configuration.default.iconSize}
                  field={iconSize}
                  disabled={!showIcon}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LAYOUT_LOCALIZATION.FORM_TEXT_SIZE)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.textSize}
                  defaultKey={this.configuration.default.textSize}
                  field={textSize}
                  disabled={!showText}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_LIST_ALIGNMENT)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.listAlignment}
                  defaultKey={this.configuration.default.listAlignment}
                  field={listAlignment}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_OFFSET_FROM_TOP)}
                </ControlLabel>
                <input
                  name="cols"
                  type="number"
                  className="form-control"
                  {...topOffset}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_IN_ITEM_ALIGNMENT)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.inItemAlignment}
                  defaultKey={this.configuration.default.inItemAlignment}
                  field={inItemAlignment}
                />
              </Col>
            </Row>
          </FormGroup>
        </form>
      </div>
    );
  }
}

GeneralSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  form: PropTypes.object,
  onFieldChange: PropTypes.func,
};

export default form(props => {
  const { settings } = props;
  return {
    fields: [
      'topOffset',
      'listAlignment',
      'inItemAlignment',
      'iconSize',
      'textSize',
    ],
    defaultValues: {
      topOffset: settings.topOffset,
      listAlignment: settings.listAlignment,
      inItemAlignment: settings.inItemAlignment,
      iconSize: settings.iconSize,
      textSize: settings.textSize,
    },
    validation: {},
  };
})(GeneralSettings);
