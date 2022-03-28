import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, View } from '@shoutem/ui';
import { ext } from '../../const';

function SheetHeader({
  renderLeftSheetHeader,
  rightHeaderAction,
  showSharing,
  style,
}) {
  const baseHeaderStyleName = 'horizontal v-center solid md-gutter-horizontal';
  const headerStyleName = showSharing
    ? `${baseHeaderStyleName} space-between`
    : `${baseHeaderStyleName} h-end sm-gutter-vertical`;

  return (
    <View style={style.container} styleName={headerStyleName}>
      {renderLeftSheetHeader()}
      <Button onPress={rightHeaderAction} styleName="clear tight">
        <Icon name="close" fill={style.iconFill} />
      </Button>
    </View>
  );
}

SheetHeader.propTypes = {
  renderLeftSheetHeader: PropTypes.func.isRequired,
  rightHeaderAction: PropTypes.func.isRequired,
  showSharing: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

SheetHeader.defaultProps = {
  style: {},
};

export default connectStyle(ext('SheetHeader'))(SheetHeader);
