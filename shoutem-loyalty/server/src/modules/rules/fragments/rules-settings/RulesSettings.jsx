import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { isInitialized, shouldLoad } from '@shoutem/redux-io';
import { Button, FormGroup, Checkbox } from 'react-bootstrap';
import { loadRules, updateRules, getRulesById } from '../../redux';
import { updateRuleById } from '../../services';
import RulesTable from '../../components/rules-table';
import './style.scss';

export class RulesSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleRuleChange = this.handleRuleChange.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleToggleRequireReceipt = this.handleToggleRequireReceipt.bind(this);
    this.calculateHasChanges = this.calculateHasChanges.bind(this);

    const { rules, requireReceiptCode } = props;
    this.state = {
      changedRuleIds: [],
      rules,
      requireReceiptCode,
      inProgress: false,
      hasChanges: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { programId, rules: nextRules } = nextProps;
    const { rules } = props;

    if (shouldLoad(nextProps, props, 'rules')) {
      this.props.loadRules(programId);
    }

    if (rules !== nextRules) {
      this.setState({ rules: nextRules });
    }
  }

  handleRuleChange(rule, rulePatch) {
    const { changedRuleIds, rules } = this.state;
    const { id } = rule;

    this.setState({
      rules: updateRuleById(rules, id, rulePatch),
      changedRuleIds: [...changedRuleIds, id],
      hasChanges: true,
    });
  }

  handleToggleRequireReceipt() {
    const { requireReceiptCode } = this.state;

    const nextRequireReceiptCode = !requireReceiptCode;
    this.setState({
      requireReceiptCode: nextRequireReceiptCode,
      hasChanges: this.calculateHasChanges(nextRequireReceiptCode),
    });
  }

  calculateHasChanges(newRequireReceiptCode) {
    const { changedRuleIds } = this.state;
    const { requireReceiptCode } = this.props;

    return !_.isEmpty(changedRuleIds) ||
      requireReceiptCode !== newRequireReceiptCode;
  }

  handleSaveChanges() {
    const { changedRuleIds, rules, requireReceiptCode } = this.state;
    const { programId, updateRules, onUpdateRequiredReceipt } = this.props;

    this.setState({ inProgress: true });
    const changedRules = _.filter(rules, rule => changedRuleIds.includes(rule.id));

    return Promise.all([
      updateRules(changedRules, programId),
      onUpdateRequiredReceipt({ requireReceiptCode }),
    ]).then(() => (
      this.setState({
        changedRuleIds: [],
        inProgress: false,
        hasChanges: false,
      }))
    );
  }

  render() {
    const {
      requireReceiptCode,
      rules,
      hasChanges,
      inProgress,
    } = this.state;

    return (
      <LoaderContainer
        isLoading={!isInitialized(rules)}
        className="rules-settings"
      >
        <h3>Program settings</h3>
        <RulesTable
          rules={rules}
          onRuleChange={this.handleRuleChange}
        />
        <FormGroup>
          <Checkbox
            checked={requireReceiptCode}
            onChange={this.handleToggleRequireReceipt}
          >
            Require receipt code for purchase validation
          </Checkbox>
        </FormGroup>
        <Button
          bsStyle="primary"
          onClick={this.handleSaveChanges}
          disabled={!hasChanges}
        >
          <LoaderContainer isLoading={inProgress}>
            Save
          </LoaderContainer>
        </Button>
      </LoaderContainer>
    );
  }
}

RulesSettings.propTypes = {
  programId: PropTypes.string,
  rules: PropTypes.object,
  requireReceiptCode: PropTypes.bool,
  loadRules: PropTypes.func,
  updateRules: PropTypes.func,
  onUpdateRequiredReceipt: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    rules: getRulesById(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadRules: (programId) => (
      dispatch(loadRules(programId))
    ),
    updateRules: (changedRules, programId) => (
      dispatch(updateRules(changedRules, programId))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesSettings);
