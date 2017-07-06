import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { FormGroup } from 'react-bootstrap';
import './style.scss';

export default class RuleTableRow extends Component {
  constructor(props) {
    super(props);

    this.resolveStateFromProps = this.resolveStateFromProps.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRuleChanged = this.handleRuleChanged.bind(this);

    this.state = {
      isValid: true,
    };
  }

  componentWillMount() {
    this.resolveStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.resolveStateFromProps(nextProps);
  }

  resolveStateFromProps(props, value = null) {
    const { rule, validateRule, valueKey } = props;

    const newValue = _.isNull(value) ? _.get(rule, ['implementationData', valueKey]) : value;
    const isValid = validateRule(newValue);

    this.setState({ value: newValue, isValid });
    return isValid;
  }

  handleInputChange(event) {
    const value = event.target.value;
    const isValid = this.resolveStateFromProps(this.props, value);

    if (isValid) {
      this.handleRuleChanged(value);
    }
  }

  handleRuleChanged(value) {
    const { rule, onRuleChange, valueKey, valueTransformer } = this.props;
    const finalValue = valueTransformer(value);

    const rulePatch = {
      id: rule.id,
      ruleType: rule.ruleType,
      implementationData: { [valueKey]: finalValue },
    };

    onRuleChange(rule, rulePatch);
  }

  render() {
    const { customerAction, unit } = this.props;
    const { value, isValid } = this.state;

    const validationState = isValid ? 'success' : 'error';

    return (
      <tr className="rule-table-row">
        <td>{customerAction}</td>
        <td>
          <FormGroup validationState={validationState}>
            <input
              type="text"
              className="form-control"
              value={value}
              onChange={this.handleInputChange}
            />
            <label>{unit}</label>
          </FormGroup>
        </td>
      </tr>
    );
  }
}

RuleTableRow.propTypes = {
  rule: PropTypes.object,
  onRuleChange: PropTypes.func,
  unit: PropTypes.string,
  customerAction: PropTypes.string,
  valueKey: PropTypes.string,
  validateRule: PropTypes.func,
  valueTransformer: PropTypes.func,
};
