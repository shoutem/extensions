import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { Modal, Button } from 'react-bootstrap';
import classNames from 'classnames';
import FiltersForm from '../filters-form';
import LOCALIZATION from './localization';

const styles = {
  footer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  resetContainer: {
    flex: 1,
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: 80,
  },
  resetIcon: {
    fontSize: 25,
    fontWeight: 700,
    color: '#A3A7B5',
  },
  resetText: {
    fontWeight: 500,
    fontSize: 14,
    paddingLeft: 5,
    textTransform: 'uppercase',
  },
};

export default class FiltersModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.formRef = createRef();

    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  show(options) {
    if (this.state.show) {
      return;
    }

    this.setState({
      show: true,
      ...options,
    });
  }

  hide() {
    if (this.mounted) {
      this.setState({
        show: false,
      });
    }
  }

  handleAbort() {
    const { onAbort } = this.state;

    if (!onAbort) {
      this.hide();
      return;
    }

    onAbort();
    this.hide();
  }

  handleApply(filterOptions) {
    const { onSubmit } = this.props;

    if (_.isFunction(onSubmit)) {
      onSubmit(filterOptions);
    }

    this.hide();
  }

  handleFormSubmit() {
    this.formRef.current.submit();
  }

  handleReset() {
    const { onSubmit } = this.props;

    if (_.isFunction(onSubmit)) {
      onSubmit({ filters: null });
    }

    this.hide();
  }

  render() {
    const { schema } = this.props;
    const { show, filterOptions } = this.state;

    const resetIconClassName = classNames('se-icon', 'se-icon-refresh');

    return (
      <Modal onHide={this.handleAbort} show={show}>
        <Modal.Header>
          <Modal.Title>{i18next.t(LOCALIZATION.CREATE_FILTER)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FiltersForm
            ref={this.formRef}
            schema={schema}
            initialValues={filterOptions}
            onSubmit={this.handleApply}
          />
        </Modal.Body>
        <Modal.Footer style={styles.footer}>
          <div style={styles.resetContainer}>
            <div style={styles.resetButton} onClick={this.handleReset}>
              <span style={styles.resetIcon} className={resetIconClassName} />
              <div style={styles.resetText}>
                {i18next.t(LOCALIZATION.RESET)}
              </div>
            </div>
          </div>
          <div>
            <Button bsStyle="default" onClick={this.handleAbort}>
              {i18next.t(LOCALIZATION.CANCEL)}
            </Button>
            <Button bsStyle="primary" onClick={this.handleFormSubmit}>
              {i18next.t(LOCALIZATION.APPLY)}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

FiltersModal.propTypes = {
  schema: PropTypes.object,
  onSubmit: PropTypes.func,
};
