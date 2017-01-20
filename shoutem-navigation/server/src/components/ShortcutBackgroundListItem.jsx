import React, { PropTypes, Component } from 'react';
import { IconLabel } from '@shoutem/se-ui-kit';
import { ImageUploader, S3Uploader } from '@shoutem/web-core';
import { url, appId, awsDefaultBucket } from 'environment';

function getLabelIcon(shortcutType) {
  switch (shortcutType) {
    case 'navigation':
      return 'folder';
    default:
      return 'screen';
  }
}

export default class ShortcutBackgroundListItem extends Component {
  constructor(props) {
    super(props);
    this.handleNormalIconUploaded = this.handleNormalIconUploaded.bind(this);

    this.uploader = new S3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'images',
      awsBucket: awsDefaultBucket,
    });
  }

  handleNormalIconUploaded(iconUrl) {
    const { shortcutId, onIconSelected } = this.props;
    onIconSelected(shortcutId, { normalIconUrl: iconUrl });
  }

  render() {
    const { title, shortcutType, normalIconUrl } = this.props;
    const iconName = getLabelIcon(shortcutType);

    return (
      <tr>
        <td>
          <IconLabel iconName={iconName} size="24px" className="navigation__table-label">
            {title}
          </IconLabel>
        </td>
        <td>
          <ImageUploader
            uploader={this.uploader}
            onUploadSuccess={this.handleNormalIconUploaded}
            preview={normalIconUrl}
            canBeDeleted={false}
          />
        </td>
      </tr>
    );
  }
}

ShortcutBackgroundListItem.propTypes = {
  shortcutId: PropTypes.string,
  title: PropTypes.string,
  shortcutType: PropTypes.string,
  normalIconUrl: PropTypes.string,
  onIconSelected: PropTypes.func,
};
