import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import ItemSubtitle from '../../components/ItemSubtitle';
import { ext } from '../../const';

export function CompactListItem({
  imageSource,
  item,
  onPress,
  renderActions,
  style,
  subtitle,
  subtitleLeft,
  subtitleRight,
  title,
}) {
  function handleOnPress() {
    if (onPress) {
      onPress(item);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={!onPress && 1}
      onPress={handleOnPress}
      style={style.container}
    >
      <Row>
        <Image
          styleName="small"
          style={style.imageContainer}
          source={imageSource}
        />
        <View styleName="vertical space-between">
          <Subtitle numberOfLines={2} style={style.title}>
            {title}
          </Subtitle>
          <ItemSubtitle
            containerStyleName="horizontal space-between"
            subtitle={subtitle}
            subtitleLeft={subtitleLeft}
            subtitleRight={subtitleRight}
          />
        </View>
        {renderActions && renderActions(item)}
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

CompactListItem.propTypes = {
  item: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  imageSource: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderActions: PropTypes.func,
  style: PropTypes.object,
  subtitle: PropTypes.string,
  subtitleLeft: PropTypes.string,
  subtitleRight: PropTypes.string,
  onPress: PropTypes.func,
};

CompactListItem.defaultProps = {
  imageSource: null,
  subtitle: '',
  subtitleLeft: '',
  subtitleRight: '',
  style: {},
  renderActions: undefined,
  onPress: undefined,
};

export default connectStyle(ext('CompactListItem'))(CompactListItem);
