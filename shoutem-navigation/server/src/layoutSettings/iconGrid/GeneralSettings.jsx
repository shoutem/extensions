import React, { PropTypes, Component } from 'react';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import { NumericDropdown } from '@shoutem/react-web-ui';
import IconsAndText from '../common/IconsAndText';
import form from '../common/form';
import DropdownWrapper from '../common/DropdownWrapper';

const configuration = {
  default: {
    iconSize: 'medium',
    gridAlignment: 'topLeft',
    scrolling: 'continuous',
  },
  iconSize: {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
  gridAlignment: {
    topLeft: 'Top left',
    topCenter: 'Top center',
    topRight: 'Top right',
    middleLeft: 'Middle left',
    middleCenter: 'Middle center',
    middleRight: 'Middle right',
    bottomLeft: 'Bottom left',
    bottomCenter: 'Bottom center',
    bottomRight: 'Bottom right',
  },
  scrolling: {
    continuous: 'Continuous',
    paged: 'Pagination',
  },
};

export class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm);
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  render() {
    const {
      settings,
      fields,
      onSettingsChanged,
    } = this.props;

    const {
      rows,
      cols,
      gridAlignment,
      scrolling,
      iconSize,
    } = fields;

    return (
      <div className="general-settings">
        <h3>General settings</h3>
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
                <ControlLabel>Icon size</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.iconSize}
                  defaultKey={configuration.default.iconSize}
                  field={iconSize}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>Rows of icons / page</ControlLabel>
                <NumericDropdown min={1} max={6} name="rows" className="form-control" {...rows} />
              </Col>
              <Col md={4}>
                <ControlLabel>Columns of icons / page</ControlLabel>
                <NumericDropdown min={1} max={4} name="cols" className="form-control" {...cols} />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <ControlLabel>Grid alignment</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.gridAlignment}
                  defaultKey={configuration.default.gridAlignment}
                  field={gridAlignment}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>Scrolling</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.scrolling}
                  defaultKey={configuration.default.scrolling}
                  field={scrolling}
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

export default form((props) => {
  const { settings } = props;
  return {
    fields: ['rows', 'cols', 'gridAlignment', 'scrolling', 'iconSize'],
    defaultValues: {
      rows: settings.rows,
      cols: settings.cols,
      gridAlignment: settings.gridAlignment,
      scrolling: settings.scrolling,
      iconSize: settings.iconSize,
    },
    validation: {},
  };
})(GeneralSettings);
