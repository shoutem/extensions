import React, { useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Subtitle, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { assets } from 'shoutem.layouts';
import { ext } from '../../const';
import { formatPrice } from '../../services';

const DealListItem = ({ deal, onDealPress, style }) => {
  const {
    title,
    image1,
    regularPrice,
    discountPrice,
    currency,
    endTime,
  } = deal;

  const resolvedImageSource = useMemo(
    () => (image1 ? { uri: image1 } : assets.noImagePlaceholder),
    [image1],
  );

  return (
    <TouchableOpacity
      styleName="sm-gutter-right"
      onPress={() => onDealPress(deal)}
    >
      <FastImage
        source={resolvedImageSource}
        resizeMode="cover"
        style={style.itemSize}
      />
      <View style={[style.overlayContainer, style.itemSize]}>
        <View styleName="flexible vertical md-gutter h-center">
          <Caption style={style.endsCaption}>
            {I18n.t(ext('endsLabel'))} {moment(endTime).format('MMMM D')}
          </Caption>
          <View styleName="flexible vertical v-center h-center">
            <Subtitle style={style.title} numberOfLines={2}>
              {title}
            </Subtitle>
          </View>
          <View styleName="vertical h-center">
            <Caption
              styleName={!!discountPrice && 'line-through'}
              style={style.regularPriceCaption}
            >
              {formatPrice(regularPrice, currency)}
            </Caption>
            <Text style={style.discountPriceCaption}>
              {`${formatPrice(discountPrice, currency)} `}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

DealListItem.propTypes = {
  deal: PropTypes.shape({
    currency: PropTypes.string,
    discountPrice: PropTypes.number,
    endTime: PropTypes.string,
    id: PropTypes.string,
    image1: PropTypes.string,
    redeemed: PropTypes.bool,
    regularPrice: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
  style: PropTypes.object.isRequired,
  onDealPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('DealListItem'))(DealListItem);
