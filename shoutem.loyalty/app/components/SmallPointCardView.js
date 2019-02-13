import React, {
  Component,
} from 'react';
import QRCode from 'react-native-qrcode';

import {
  TouchableOpacity,
  Caption,
  Title,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

/**
 * Renders a small point card
 */
class SmallPointCardView extends Component {
  static defaultProps = {
    onPress: () => {},
  };

  render() {
    const { cardId, points, onPress, style } = this.props;

    return (
      <View
        styleName="featured"
        style={style.container}
      >
        <View
          styleName="horizontal v-center h-center"
          style={style.innerContainer}
        >
          <View styleName="flexible v-center h-center">
            <Title
              styleName="h-center"
              style={style.points}
            >
              {points}
            </Title>
            <Caption
              styleName="h-center sm-gutter"
              style={style.pointsTitle}
            >
              {I18n.t(ext('myCardScreenPointsTitle'))}
            </Caption>
          </View>
          <View
            styleName="flexible vertical solid v-center h-center lg-gutter md-gutter-horizontal"
            style={style.qrBackground}
          >
            <TouchableOpacity onPress={onPress}>
              <QRCode
                size={102}
                value={JSON.stringify([cardId])}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


export default connectStyle(ext('SmallPointCardView'))(SmallPointCardView);
