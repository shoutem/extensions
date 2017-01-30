import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';
import { FontIcon } from '@shoutem/se-ui-kit';
import "./style.scss";

export default class WebEdit extends Component {
  constructor(props) {
    super(props);
    this.onShowNavigationToolbarChange = this.onShowNavigationToolbarChange.bind(this);
    this.onOpenExternalBrowserChange = this.onOpenExternalBrowserChange.bind(this);
  }

  onShowNavigationToolbarChange(event) {
    if (event.target) {
      this.props.onShowNavigationToolbarChange(event.target.checked);
    }
  }

  onOpenExternalBrowserChange(event) {
    if (event.target) {
      this.props.onOpenExternalBrowserChange(event.target.checked);
    }
  }

  render() {
    const { url, showNavigationToolbar, openExternalBrowser, onRemoveClick } = this.props;
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
                onClick={onRemoveClick} />
            </div>
            <ControlLabel>Screen options</ControlLabel>
            <Checkbox
              checked={openExternalBrowser}
              onChange={this.onOpenExternalBrowserChange}
            >
              Open in external browser
            </Checkbox>
            <Checkbox
              checked={showNavigationToolbar}
              disabled={openExternalBrowser}
              onChange={this.onShowNavigationToolbarChange}
            >
              Show navigation toolbar
            </Checkbox>
          </FormGroup>
        </form>
      </div>
    );
  }
}

WebEdit.propTypes = {
  url: PropTypes.string,
  showNavigationToolbar: PropTypes.bool,
  openExternalBrowser: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  onShowNavigationToolbarChange: PropTypes.func,
  onOpenExternalBrowserChange: PropTypes.func
};
