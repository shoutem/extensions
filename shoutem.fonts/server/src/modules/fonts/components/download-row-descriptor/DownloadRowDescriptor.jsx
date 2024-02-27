import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon, LoaderContainer } from '@shoutem/react-web-ui';
import './style.scss';

export default class DownloadRowDescriptor extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      downloading: false,
    };
  }

  async handleDownload(event) {
    const { font, onDownloadClick } = this.props;
    event.stopPropagation();

    if (!_.isFunction(onDownloadClick)) {
      return;
    }

    this.setState({ downloading: true });

    await onDownloadClick(font);
    this.setState({ downloading: false });
  }

  render() {
    const { downloading } = this.state;

    return (
      <LoaderContainer
        className="download-loader-container"
        size="22px"
        isLoading={downloading}
      >
        <Button className="btn-icon" onClick={this.handleDownload}>
          <FontIcon name="download" size="25px" />
        </Button>
      </LoaderContainer>
    );
  }
}

DownloadRowDescriptor.propTypes = {
  font: PropTypes.object.isRequired,
  onDownloadClick: PropTypes.func.isRequired,
};
