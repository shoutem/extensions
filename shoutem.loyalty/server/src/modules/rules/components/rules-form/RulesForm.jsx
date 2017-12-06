import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { Button } from 'react-bootstrap';
import RulesTable from '../../components/rules-table';
import './style.scss';

export default class RulesSettings extends Component {
  constructor(props) {
    super(props);

    this.handleRuleChange = this.handleRuleChange.bind(this);
    this.handleSaveChangesClick = this.handleSaveChangesClick.bind(this);
    this.handleRuleEnabledToggle = this.handleRuleEnabledToggle.bind(this);
    this.calculateHasChanges = this.calculateHasChanges.bind(this);

    const { rules } = props;

    this.state = {
      rules,
      rulePatches: {},
      inProgress: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { rules: nextRules } = nextProps;
    const { rules } = this.props;

    if (rules !== nextRules) {
      this.setState({ rules: nextRules });
    }
  }

  handleRuleChange(rule, rulePatch) {
    const { rules } = this.state;
    const { ruleType } = rule;

    this.setState({
      rules: {
        ...rules,
        [ruleType]: rulePatch,
      },
    }, this.calculateHasChanges);
  }

  handleRuleEnabledToggle(rule, enabled = true) {
    const { rules } = this.state;
    const { ruleType } = rule;

    this.setState({
      rules: {
        ...rules,
        [ruleType]: { ...rule, enabled },
      },
    }, this.calculateHasChanges);
  }

  handleSaveChangesClick() {
    const { rules } = this.state;

    this.setState({ inProgress: true });

    this.props.onUpdateRules(rules).then(() => (
      this.setState({
        inProgress: false,
        hasChanges: false,
      })
    ));
  }

  calculateHasChanges() {
    const { rules } = this.state;
    const { rules: initialRules } = this.props;

    const hasChanges = !_.isEqual(initialRules, rules);
    this.setState({ hasChanges });
  }

  render() {
    const {
      rules,
      inProgress,
      hasChanges,
    } = this.state;

    return (
      <div className="rules-form">
        <RulesTable
          onRuleChange={this.handleRuleChange}
          onRuleToggle={this.handleRuleEnabledToggle}
          rules={rules}
        />
        <Button
          bsStyle="primary"
          disabled={!hasChanges}
          onClick={this.handleSaveChangesClick}
        >
          <LoaderContainer isLoading={inProgress}>
            Update rules
          </LoaderContainer>
        </Button>
      </div>
    );
  }
}

RulesSettings.propTypes = {
  rules: PropTypes.object,
  onUpdateRules: PropTypes.func,
  onUpdateRequiredReceipt: PropTypes.func,
};
