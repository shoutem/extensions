import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  Row,
} from 'react-bootstrap';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { USER_APP_ROLES } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

export default class ChangeRoleForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { role } = props;

    const options = [
      {
        value: USER_APP_ROLES.USER,
        label: i18next.t(LOCALIZATION.APP_ROLE_USER),
      },
      {
        value: USER_APP_ROLES.ADMIN,
        label: i18next.t(LOCALIZATION.APP_ROLE_ADMIN),
      },
    ];

    if (role === USER_APP_ROLES.ROOT) {
      options.push({
        value: USER_APP_ROLES.ROOT,
        label: i18next.t(LOCALIZATION.APP_ROLE_ROOT),
      });
    }

    this.state = {
      submitting: false,
      options,
      role,
    };
  }

  handleSelectionChanged(newSelectedItem) {
    const role = _.get(newSelectedItem, 'value');
    this.setState({ role });
  }

  async handleSubmit() {
    const { onSubmit } = this.props;
    const { role } = this.state;

    if (_.isFunction(onSubmit)) {
      this.setState({ submitting: true });

      try {
        await onSubmit(role);
        this.setState({ submitting: false });
      } catch (error) {
        this.setState({ submitting: false });
      }
    }
  }

  render() {
    const { onCancel, role: propsRole } = this.props;
    const { options, submitting, role } = this.state;
    const hasChanges = propsRole !== role;

    // disable selection if user is root
    const isRoot = propsRole === USER_APP_ROLES.ROOT;

    return (
      <FormGroup className="change-role-form">
        <Row>
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_USER_APP_ROLE_TITLE)}
          </ControlLabel>
          <Select
            onChange={this.handleSelectionChanged}
            clearable={false}
            options={options}
            value={role}
            disabled={isRoot}
          />
        </Row>
        <ButtonToolbar>
          <Button
            bsSize="large"
            bsStyle="primary"
            disabled={submitting || !hasChanges}
            onClick={this.handleSubmit}
          >
            <LoaderContainer isLoading={submitting}>
              {i18next.t(LOCALIZATION.BUTTON_CHANGE_TITLE)}
            </LoaderContainer>
          </Button>
          <Button bsSize="large" disabled={submitting} onClick={onCancel}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL_TITLE)}
          </Button>
        </ButtonToolbar>
      </FormGroup>
    );
  }
}

ChangeRoleForm.propTypes = {
  role: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
