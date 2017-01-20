import React, {
  PropTypes,
  Component,
} from 'react';

import {
  ScrollView,
  ViewPagerAndroid,
  Dimensions,
  Platform,
  View,
} from 'react-native';

const propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.number,
  onScroll: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number
};

/**
 * Renders a horizontal pager which renders pages by using
 * the provided renderPage function with data from provided
 * dataSource.
 *
 * It can be used as a general wrapper component for any group
 * of uniform components which require horizontal paging.
 * It abstracts away React Native API inconsistencies between
 * iOS and Android platforms and should be used instead of
 * ScrollView and ViewPagerAndroid for this matter.
 *
 * @returns {*}
 */

export default class HorizontalPager extends Component {

  constructor(props) {
    super(props);
    this.onPageSelectedPlatform = this.onPageSelectedPlatform.bind(this);
  }

  onPageSelectedPlatform(event){
    const { onPageSelected } = this.props;
      if(Platform.OS === 'android'){
        onPageSelected(event.nativeEvent.position);
      }
      else{
        if (event.nativeEvent.layoutMeasurement.width){
          const page = event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width;
          onPageSelected(Math.round(page));
        }
      }
  }

  render(){
    const { dataSource, renderPage, selectedPage, onPageSelected } = this.props;
    const pages = dataSource.map((src, key) => (
      <View 
        removeClippedSubviews
        style={[styles.item, {overflow:'hidden', height: this.props.height, width: this.props.width}]} 
        key={key}
      >
        {renderPage(src, key)}
      </View>
    ));

    if (Platform.OS === 'android') {
      return (
        <ViewPagerAndroid
          style={{ height:this.props.height }}
          initialPage={selectedPage}
          onPageSelected={this.onPageSelectedPlatform}
        >
          {pages}
        </ViewPagerAndroid>
      );
    }

    const xOffset = selectedPage > 0 ? selectedPage * this.props.width : 0; //xOffset has to be set in pixels on iOS. weird logic.
    return (
      <ScrollView
        contentOffset={{x:xOffset, y:0}}
        pagingEnabled
        horizontal
        onScroll={this.onPageSelectedPlatform}
        scrollEventThrottle={6000}
      >
        {pages}
      </ScrollView>
    );
  }

}

const styles = {
  item: {
    flex: 1,
  },
};

HorizontalPager.propTypes = propTypes;

export { HorizontalPager };
