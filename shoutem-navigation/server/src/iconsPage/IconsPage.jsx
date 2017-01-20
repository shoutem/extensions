import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { isInitialized } from '@shoutem/redux-io';
import { EmptyResourcePlaceholder, LoaderContainer } from '@shoutem/se-ui-kit';
import { getShortcut } from 'environment';
import ShortcutsList from '../components/ShortcutsList';
import ShortcutIconListItem from '../components/ShortcutIconListItem';
import { updateShortcut } from '../reducer';
import emptyImage from '../../assets/empty.png';
import { loadShortcuts } from './actions';

import './style.scss';

export class IconsPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleIconChange = this.handleIconChange.bind(this);
    this.renderShortcutsList = this.renderShortcutsList.bind(this);
  }

  handleIconChange(shortcutId, changedIcon) {
    const { icon } = changedIcon;
    this.props.updateShortcut({
      id: shortcutId,
      attributes: { icon },
    });
  }

  renderShortcutsList(shortcuts) {
    if (!shortcuts || shortcuts.length === 0) {
      return (
        <EmptyResourcePlaceholder
          className="icons-page__empty-placeholder"
          imageSrc={emptyImage}
          title="Navigation is empty"
        >
          <span>Start adding screens. They will appear in your main navigation!</span>
        </EmptyResourcePlaceholder>
      );
    }

    return (
      <div className="icons-page">
        <ShortcutsList
          className="icons-page__shortcuts-list"
          shortcuts={shortcuts}
          headerTitles={['Navigation item', 'Icon']}
          getListItem={(shortcut) => (
            <ShortcutIconListItem
              shortcutType={shortcut.shortcutType}
              title={shortcut.title}
              icon={shortcut.icon}
              shortcutId={shortcut.id}
              onIconSelected={this.handleIconChange}
            />
          )}
        />
      </div>
    );
  }

  render() {
    const { shortcut } = this.props;

    return (
      <LoaderContainer className="icons-page" isLoading={!isInitialized(shortcut)}>
        {this.renderShortcutsList(shortcut.children)}
      </LoaderContainer>
    );
  }
}

IconsPage.propTypes = {
  shortcut: PropTypes.object.isRequired,
  updateShortcut: PropTypes.func.isRequired,
};


function mapStateToProps() {
  const shortcut = getShortcut();
  return {
    shortcut,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadShortcuts: () => dispatch(loadShortcuts()),
    updateShortcut: (shortcut) => dispatch(updateShortcut(shortcut)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IconsPage);
