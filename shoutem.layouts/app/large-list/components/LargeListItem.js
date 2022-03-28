import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  ImageBackground,
  Overlay,
  Row,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { ItemSubtitle } from '../../components';
import { ext } from '../../const';

export function LargeListItem({
  item,
  title,
  hasOverlay,
  imageSource,
  numberOfLines,
  overlayStyleName,
  style,
  subtitle,
  subtitleLeft,
  subtitleRight,
  onPress,
  renderActions,
  renderOverlayChild,
}) {
  function handlePress() {
    if (onPress) {
      onPress(item);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={!onPress && 1}
      onPress={handlePress}
      style={style.mainContainer}
    >
      <Tile>
        <ImageBackground
          styleName="large-wide placeholder"
          source={imageSource}
          style={style.imageContainer}
        >
          {hasOverlay && (
            <Overlay styleName={overlayStyleName}>
              {renderOverlayChild && renderOverlayChild()}
            </Overlay>
          )}
        </ImageBackground>
        <Row>
          <View>
            <Title numberOfLines={numberOfLines}>{title}</Title>
            <ItemSubtitle
              containerStyleName="horizontal space-between"
              subtitle={subtitle}
              subtitleLeft={subtitleLeft}
              subtitleRight={subtitleRight}
            />
          </View>
          {renderActions && renderActions(item)}
        </Row>
      </Tile>
    </TouchableOpacity>
  );
}

LargeListItem.propTypes = {
  item: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  hasOverlay: PropTypes.bool,
  imageSource: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  numberOfLines: PropTypes.number,
  overlayStyleName: PropTypes.string,
  renderActions: PropTypes.func,
  renderOverlayChild: PropTypes.func,
  style: PropTypes.object,
  subtitle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  subtitleLeft: PropTypes.string,
  subtitleRight: PropTypes.string,
  onPress: PropTypes.func,
};

LargeListItem.defaultProps = {
  hasOverlay: false,
  imageSource: null,
  numberOfLines: 2,
  overlayStyleName: '',
  renderActions: undefined,
  renderOverlayChild: undefined,
  style: {},
  subtitle: '',
  subtitleLeft: '',
  subtitleRight: '',
  onPress: undefined,
};

export default connectStyle(ext('LargeListItem'))(LargeListItem);
