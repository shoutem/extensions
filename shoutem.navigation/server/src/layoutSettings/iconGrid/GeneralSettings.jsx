import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import { NumericDropdown } from '@shoutem/react-web-ui';
import IconsAndText from '../common/IconsAndText';
import form from '../common/form';
import DropdownWrapper from '../common/DropdownWrapper';
import LAYOUT_LOCALIZATION from '../localization';
import LOCALIZATION from './localization';

function getConfiguration() {
  return {
    default: {
      iconSize: 'medium',
      gridAlignment: 'topLeft',
      scrolling: 'continuous',
      marginSize: 'compact',
      textSize: 'small',
    },
    iconSize: {
      small: i18next.t(LOCALIZATION.ICON_SIZE_SMALL),
      medium: i18next.t(LOCALIZATION.ICON_SIZE_MEDIUM),
      large: i18next.t(LOCALIZATION.ICON_SIZE_LARGE),
      extraLarge: i18next.t(LOCALIZATION.ICON_SIZE_EXTRA_LARGE),
      xxl: i18next.t(LOCALIZATION.ICON_SIZE_XXL),
      xxxl: i18next.t(LOCALIZATION.ICON_SIZE_XXXL),
      xxxxl: i18next.t(LOCALIZATION.ICON_SIZE_XXXXL),
    },
    textSize: {
      small: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_SMALL),
      medium: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_MEDIUM),
      large: i18next.t(LAYOUT_LOCALIZATION.TEXT_SIZE_LARGE),
    },
    gridAlignment: {
      topLeft: i18next.t(LOCALIZATION.GRID_ALIGNMENT_TOP_LEFT),
      topCenter: i18next.t(LOCALIZATION.GRID_ALIGNMENT_TOP_CENTER),
      topRight: i18next.t(LOCALIZATION.GRID_ALIGNMENT_TOP_RIGHT),
      middleLeft: i18next.t(LOCALIZATION.GRID_ALIGNMENT_MIDDLE_LEFT),
      middleCenter: i18next.t(LOCALIZATION.GRID_ALIGNMENT_MIDDLE_CENTER),
      middleRight: i18next.t(LOCALIZATION.GRID_ALIGNMENT_MIDDLE_RIGHT),
      bottomLeft: i18next.t(LOCALIZATION.GRID_ALIGNMENT_BOTTM_LEFT),
      bottomCenter: i18next.t(LOCALIZATION.GRID_ALIGNMENT_BOTTOM_CENTER),
      bottomRight: i18next.t(LOCALIZATION.GRID_ALIGNMENT_BOTTOM_RIGHT),
    },
    scrolling: {
      continuous: i18next.t(LOCALIZATION.SCROLLING_CONTINUOUS),
      paged: i18next.t(LOCALIZATION.SCROLLING_PAGED),
    },
    marginSize: {
      compact: i18next.t(LOCALIZATION.MARGIN_SIZE_COMPACT),
      comfortable: i18next.t(LOCALIZATION.MARGIN_SIZE_COMFORTABLE),
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
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  render() {
    const { settings, fields, onSettingsChanged } = this.props;

    const {
      rows,
      cols,
      gridAlignment,
      scrolling,
      iconSize,
      marginSize,
      textSize,
    } = fields;

    return (
      <div className="general-settings">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={12}>
                <IconsAndText
                  settings={settings}
                  onSettingsChanged={onSettingsChanged}
                  textOnlySupported={false}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_ICON_SIZE)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.iconSize}
                  defaultKey={this.configuration.default.iconSize}
                  field={iconSize}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>{i18next.t(LOCALIZATION.FORM_ROWS)}</ControlLabel>
                <NumericDropdown
                  min={1}
                  max={6}
                  name="rows"
                  className="form-control"
                  {...rows}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_COLUMS)}
                </ControlLabel>
                <NumericDropdown
                  min={1}
                  max={4}
                  name="cols"
                  className="form-control"
                  {...cols}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_GRID_ALIGNMENT)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.gridAlignment}
                  defaultKey={this.configuration.default.gridAlignment}
                  field={gridAlignment}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_SCROLLING)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.scrolling}
                  defaultKey={this.configuration.default.scrolling}
                  field={scrolling}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_MARGIN_SIZE)}
                </ControlLabel>
                <DropdownWrapper
                  valuesMap={this.configuration.marginSize}
                  defaultKey={this.configuration.default.marginSize}
                  field={marginSize}
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
      'rows',
      'cols',
      'gridAlignment',
      'scrolling',
      'iconSize',
      'marginSize',
      'textSize',
    ],
    defaultValues: {
      rows: settings.rows,
      cols: settings.cols,
      gridAlignment: settings.gridAlignment,
      scrolling: settings.scrolling,
      iconSize: settings.iconSize,
      marginSize: settings.marginSize,
      textSize: settings.textSize,
    },
    validation: {},
  };
})(GeneralSettings);
