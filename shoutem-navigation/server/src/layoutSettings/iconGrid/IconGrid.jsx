import React, { PropTypes, Component } from 'react';
import IconsBackgroundSettings from '../common/IconsBackgroundSettings';
import BackgroundSettings from '../common/BackgroundSettings';
import provideScreenSettings from '../provideScreenSettings';
import GeneralSettings from './GeneralSettings';

const LAYOUT_TYPE = 'iconGrid';

export class IconGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      normalIconUrl: `settings.navigation.${LAYOUT_TYPE}.normalIconUrl`,
    };

    this.handleIconChanged = this.handleIconChanged.bind(this);
  }

  handleIconChanged(shortcutId, changedIcons) {
    const { onIconChanged } = this.props;
    onIconChanged(shortcutId, changedIcons, LAYOUT_TYPE);
  }

  render() {
    const { settings, childShortcuts, onSettingsChanged } = this.props;
    const { normalIconUrl } = this.state;
    return (
      <div>
        <GeneralSettings
          settings={settings}
          onSettingsChanged={onSettingsChanged}
        />
        <IconsBackgroundSettings
          settings={settings}
          onSettingsChanged={onSettingsChanged}
          shortcuts={childShortcuts}
          onIconChanged={this.handleIconChanged}
          normalIconUrl={normalIconUrl}
        />
        <BackgroundSettings
          settings={settings}
          onSettingsChanged={onSettingsChanged}
          shortcuts={childShortcuts}
        />
      </div>
    );
  }
}

IconGrid.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  onIconChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};

export default provideScreenSettings(IconGrid);
