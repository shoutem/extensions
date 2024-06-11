import { Children, PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import sandbox from '@shoutem/extension-sandbox';
import { ext } from '../../src/const';

export class SyncStateEngineProvider extends PureComponent {
  constructor(props) {
    super(props);

    const { syncStateEngine } = props;

    this.handleActions = this.handleActions.bind(this);
    this.handleSandboxMessage = this.handleSandboxMessage.bind(this);
    this.checkData = this.checkData.bind(this);

    this.syncStateEngine = syncStateEngine;

    sandbox.subscribe(this.handleSandboxMessage);
    this.checkData(props);
  }

  componentDidMount() {
    this.syncStateEngine.subscribeToActions(this.handleActions);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  componentWillUnmount() {
    this.syncStateEngine.unsubscribeFromActions(this.handleActions);
  }

  checkData(nextProps, props = {}) {
    const { state } = props;
    const { state: nextState } = nextProps;

    const action = this.syncStateEngine.calculateDifferences(
      state,
      nextState,
      ext(),
    );

    if (action) {
      sandbox.sendMessage(...action);
    }
  }

  handleActions(action, source) {
    if (_.get(source, 'id') === 'builder') {
      return;
    }

    sandbox.sendMessage(...action);
  }

  handleSandboxMessage(message) {
    const source = {
      id: 'builder',
    };

    const action = this.syncStateEngine.processExternalChange(message, source);
    if (action) {
      this.props.syncAction(action);
    }
  }

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}

SyncStateEngineProvider.propTypes = {
  children: PropTypes.node,
  state: PropTypes.object,
  syncAction: PropTypes.func,
  syncStateEngine: PropTypes.object,
};

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    syncAction: action => dispatch(action),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SyncStateEngineProvider);
