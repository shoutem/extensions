import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { LIST } from '../const';
import ListItem from '../components/ListItem';
import { connect } from 'react-redux';
import { FolderBaseScreen } from './FolderBaseScreen';
import { shortcutChildrenRequired } from '../helpers';

class List extends FolderBaseScreen {
  static propTypes = {
    ...FolderBaseScreen.propTypes,
    // TODO(Braco) - update props
    listAlignment: React.PropTypes.string,
    topOffset: React.PropTypes.number,
    showText: React.PropTypes.bool,
    backgroundImage: React.PropTypes.string,
  };

  resolvePageProps() {
    const { topOffset, listAlignment } = this.getLayoutSettings();
    const { pageHeight } = this.state;
    return {
      ...super.resolvePageProps(),
      style: {
        paddingTop: topOffset,
        // Min height stretch page so list can be vertically aligned
        minHeight: pageHeight,
      },
      styleName: listAlignment,
    };
  }

  renderRow(shortcut, index) {
    const { showText, showIcon, inItemAlignment } = this.getLayoutSettings();
    const { style } = this.props;
    return (
      <ListItem
        key={`item_${index}`}
        showText={showText}
        showIcon={showIcon}
        shortcut={shortcut}
        inItemAlignment={inItemAlignment}
        onPress={this.itemPressed}
        style={style}
      />
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  const { inItemAlignment } = props;

  // Add inItemAlignment as style name to align content
  styleNames.push(`in-item-alignment-${inItemAlignment}`);

  return FolderBaseScreen.mapPropsToStyleNames(styleNames, props);
};

export default shortcutChildrenRequired(
  connect(FolderBaseScreen.mapStateToProps, FolderBaseScreen.mapDispatchToProps)(
    connectStyle(LIST, undefined, mapPropsToStyleNames)(List)
  )
);
