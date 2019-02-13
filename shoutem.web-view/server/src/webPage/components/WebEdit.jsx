import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { Checkbox, FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default class WebEdit extends Component {
  constructor(props) {
    super(props);

    this.handleShowNavigationToolbarChange = this.handleShowNavigationToolbarChange.bind(this);
    this.handleGeolocationPermissionChange = this.handleGeolocationPermissionChange.bind(this);
  }

  handleShowNavigationToolbarChange(event) {
    if (event.target) {
      this.props.onShowNavigationToolbarChange(event.target.checked);
    }
  }

  handleGeolocationPermissionChange(event) {
    if (event.target) {
      this.props.onRequireGeolocationPermissionChange(event.target.checked);
    }
  }

  render() {
    const {
      url,
      showNavigationToolbar,
      requireGeolocationPermission,
      hasWebsiteSettings,
      onRemoveClick,
    } = this.props;

    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>Website URL</ControlLabel>
            <div className="web-edit__url-container">
              <div className="web-edit__web-img" />
              <div className="text-ellipsis">
                <span className="web-edit__url">
                  {url}
                </span>
              </div>
              <FontIcon
                className="web-edit__remove"
                name="close"
                size="large"
                onClick={onRemoveClick}
              />
            </div>
            {hasWebsiteSettings && (
              <div>
                <ControlLabel>Website settings</ControlLabel>
                <div>
                  <Checkbox
                    checked={requireGeolocationPermission}
                    onChange={this.handleGeolocationPermissionChange}
                  >
                    This website requires location permissions
                  </Checkbox>
                </div>
                <div>
                  <Checkbox
                    checked={showNavigationToolbar}
                    onChange={this.handleShowNavigationToolbarChange}
                  >
                    Show navigation toolbar
                  </Checkbox>
                </div>
              </div>
            )}
          </FormGroup>
        </form>
      </div>
    );
  }
}

WebEdit.propTypes = {
  hasWebsiteSettings: PropTypes.bool,
  url: PropTypes.string,
  showNavigationToolbar: PropTypes.bool,
  requireGeolocationPermission: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  onShowNavigationToolbarChange: PropTypes.func,
  onRequireGeolocationPermissionChange: PropTypes.func,
};
