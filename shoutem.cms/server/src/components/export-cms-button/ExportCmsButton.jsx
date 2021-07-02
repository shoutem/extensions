import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { FontIcon, LoaderContainer } from '@shoutem/react-web-ui';
import { fetchCmsDataZip } from '../../actions';
import { CURRENT_SCHEMA } from '../../types';
import './style.scss';

class ExportCmsButton extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      downloadInProgress: false,
    };
  }

  async handleDownloadCSV() {
    const { appId, categoryId } = this.props;

    this.setState({ downloadInProgress: true });

    const cmsDataBlob = await fetchCmsDataZip(appId, categoryId);

    const blobUrl = URL.createObjectURL(cmsDataBlob);
    const fileName = `${_.last(CURRENT_SCHEMA.split('.'))}`;

    const link = document.createElement('a');
    link.setAttribute('href', blobUrl);
    link.setAttribute('download', fileName);

    document.body.appendChild(link);

    link.click();

    // Remove references
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    this.setState({ downloadInProgress: false });
  }

  render() {
    const { downloadInProgress } = this.state;

    return (
      <Button
        bsSize="large"
        className="export-button"
        onClick={this.handleDownloadCSV}
      >
        <LoaderContainer
          size="20px"
          className="export-loader"
          isLoading={downloadInProgress}
        >
          <FontIcon className="export-icon" name="download" size="25px" />
        </LoaderContainer>
      </Button>
    );
  }
}

ExportCmsButton.propTypes = {
  appId: PropTypes.string,
  categoryId: PropTypes.string,
};

export default ExportCmsButton;
