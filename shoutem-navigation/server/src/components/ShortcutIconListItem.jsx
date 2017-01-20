import React, { PropTypes, Component } from 'react';
import { IconLabel } from '@shoutem/se-ui-kit';
import { IconPicker, S3Uploader } from '@shoutem/web-core';
import {
  url,
  appId,
  getActiveTheme,
  getDefaultTheme,
  awsDefaultBucket,
} from 'environment';

function getLabelIcon(shortcutType) {
  switch (shortcutType) {
    case 'navigation':
      return 'folder';
    default:
      return 'screen';
  }
}

export default class ShortcutIconListItem extends Component {
  constructor(props) {
    super(props);
    this.handleIconSelected = this.handleIconSelected.bind(this);

    this.uploader = new S3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'icons',
      awsBucket: awsDefaultBucket,
    });
  }

  handleIconSelected(icon) {
    const { shortcutId, onIconSelected } = this.props;
    onIconSelected(shortcutId, { icon });
  }

  render() {
    const { shortcutType, title, icon } = this.props;
    const iconName = getLabelIcon(shortcutType);
    const activeTheme = getActiveTheme();
    const defaultTheme = getDefaultTheme();

    return (
      <tr>
        <td>
          <IconLabel iconName={iconName} size="24px" className="navigation__table-label">
            {title}
          </IconLabel>
        </td>
        <td>
          <IconPicker
            appId={appId}
            activeTheme={activeTheme}
            defaultTheme={defaultTheme}
            preview={icon}
            onSelect={this.handleIconSelected}
            uploader={this.uploader}
          />
        </td>
      </tr>
    );
  }
}

ShortcutIconListItem.propTypes = {
  shortcutId: PropTypes.string,
  title: PropTypes.string,
  shortcutType: PropTypes.string,
  icon: PropTypes.string,
  onIconSelected: PropTypes.func,
};
