import React, { PropTypes, Component } from 'react';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import form from '../common/form';
import DropdownWrapper from '../common/DropdownWrapper';

const configuration = {
  default: {
    itemGutter: 'small',
    itemText: 'topLeft',
  },
  itemGutter: {
    noGutter: 'No gutter',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
  itemText: {
    noText: 'No text',
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
};

export class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm, 1000);
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  render() {
    const { fields } = this.props;
    const {
      itemGutter,
      itemText,
    } = fields;

    return (
      <div>
        <h3>General settings</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={4}>
                <ControlLabel>Gutter settings</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.itemGutter}
                  defaultKey={configuration.default.itemGutter}
                  field={itemGutter}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>Text settings</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.itemText}
                  defaultKey={configuration.default.itemText}
                  field={itemText}
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
    fields: ['itemGutter', 'itemText'],
    defaultValues: {
      itemGutter: settings.itemGutter,
      itemText: settings.itemText,
    },
    validation: {},
  };
})(GeneralSettings);
