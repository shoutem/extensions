import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import i18next from 'i18next';
import form from '../common/form';
import DropdownWrapper from '../common/DropdownWrapper';
import CheckboxWrapper from '../common/CheckboxWrapper';
import LAYOUT_LOCALIZATION from '../localization';
import LOCALIZATION from './generalSettingsLocalization';

function getConfiguration() {
  return {
    default: {
      cardHeight: 'medium',
      itemGutter: 'medium',
      itemText: 'topLeft',
      textSize: 'small',
    },
    cardHeight: {
      small: i18next.t(LOCALIZATION.CARD_HEIGHT_SMALL),
      medium: i18next.t(LOCALIZATION.CARD_HEIGHT_MEDIUM),
      large: i18next.t(LOCALIZATION.CARD_HEIGHT_LARGE),
    },
    itemGutter: {
      noGutter: i18next.t(LAYOUT_LOCALIZATION.GUTTER_NO_GUTTER),
      small: i18next.t(LAYOUT_LOCALIZATION.GUTTER_SMALL),
      medium: i18next.t(LAYOUT_LOCALIZATION.GUTTER_MEDIUM),
      large: i18next.t(LAYOUT_LOCALIZATION.GUTTER_LARGE),
    },
    textSize: {
      small: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_SMALL),
      medium: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_MEDIUM),
      large: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_LARGE),
    },
    itemText: {
      noText: i18next.t(LAYOUT_LOCALIZATION.TEXT_NO_TEXT),
      topLeft: i18next.t(LAYOUT_LOCALIZATION.TEXT_TOP_LEFT),
      topCenter: i18next.t(LAYOUT_LOCALIZATION.TEXT_TOP_CENTER),
      topRight: i18next.t(LAYOUT_LOCALIZATION.TEXT_TOP_RIGHT),
      middleLeft: i18next.t(LAYOUT_LOCALIZATION.TEXT_MIDDLE_LEFT),
      middleCenter: i18next.t(LAYOUT_LOCALIZATION.TEXT_MIDDLE_CENTER),
      middleRight: i18next.t(LAYOUT_LOCALIZATION.TEXT_MIDDLE_RIGHT),
      bottomLeft: i18next.t(LAYOUT_LOCALIZATION.TEXT_BOTTOM_LEFT),
      bottomCenter: i18next.t(LAYOUT_LOCALIZATION.TEXT_BOTTOM_CENTER),
      bottomRight: i18next.t(LAYOUT_LOCALIZATION.TEXT_BOTTOM_RIGHT),
    },
  };
}

export class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    this.configuration = getConfiguration();

    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm, 1000);
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  render() {
    const { fields } = this.props;
    const { cardHeight, itemGutter, itemText, isFullWidth, textSize } = fields;

    return (
      <div>
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_ITEM_HEIGHT)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.cardHeight}
                  defaultKey={this.configuration.default.cardHeight}
                  field={cardHeight}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LAYOUT_LOCALIZATION.FORM_GUTTER_SETTINGS)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.itemGutter}
                  defaultKey={this.configuration.default.itemGutter}
                  field={itemGutter}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LAYOUT_LOCALIZATION.FORM_TEXT_SETTINGS)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.itemText}
                  defaultKey={this.configuration.default.itemText}
                  field={itemText}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LAYOUT_LOCALIZATION.FORM_TEXT_SIZE)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.textSize}
                  defaultKey={this.configuration.default.textSize}
                  field={textSize}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup className="general-settings__checkbox-container">
            <Row>
              <Col md={6}>
                <CheckboxWrapper {...isFullWidth}>
                  {i18next.t(LOCALIZATION.FORM_FULL_WIDTH)}
                </CheckboxWrapper>
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
    fields: ['cardHeight', 'itemGutter', 'itemText', 'isFullWidth', 'textSize'],
    defaultValues: {
      cardHeight: settings.cardHeight,
      itemGutter: settings.itemGutter,
      itemText: settings.itemText,
      isFullWidth: settings.isFullWidth,
      textSize: settings.textSize,
    },
    validation: {},
  };
})(GeneralSettings);
