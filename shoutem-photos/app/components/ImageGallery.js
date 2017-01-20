import React, {
  PropTypes,
  Component,
} from 'react';

import {
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import {
  Text,
  Icon,
  Subtitle,
  Caption,
} from '@shoutem/ui';

import { ImagePreview } from './ImagePreview';
import { HorizontalPager } from './HorizontalPager';
import { connectStyle } from '@shoutem/theme';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  selectedPage: PropTypes.number,
  onPageSelected: PropTypes.func,
  onFullScreen: PropTypes.func,
};


/**
 * Renders a collection of ImageGallery components within
 * a HorizontalPager. Each preview component is rendered
 * on a separate page.
 *
 * @returns {*}
 */

export default class ImageGallery extends Component {

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this.onPressImage = this.onPressImage.bind(this);
    this.setFullScreen = this.setFullScreen.bind(this);
    this.onCollapseDescription = this.onCollapseDescription.bind(this);
    this.limitHeight = this.limitHeight.bind(this);
    this.state = { 
      width: null, 
      height: null,
      fullScreen: false,
      collapsed: true,
      maxHeight: null
    };
  }

  _onLayout(event){
    if( this.state.width != event.nativeEvent.layout.width && this.state.height != event.nativeEvent.layout.height ){
      this.setState({
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height,
      })
    }
  }

  onPressImage(){
    const newState = !this.state.fullScreen
    this.setState({fullScreen:newState});
    this.props.onFullScreen && this.props.onFullScreen(newState);
  }

  setFullScreen(){
    if(!this.state.fullScreen){
      this.setState({fullScreen:true});
      this.props.onFullScreen && this.props.onFullScreen(true);
    }
  }

  //this is not-so-pretty hack to limit image description overlay height.
  //TODO: remove this and use maxHeight introduced in RN 0.29
  limitHeight(event){
    const { height } = event.nativeEvent.layout;
    const maximumHeight = 200;
    if (height>maximumHeight){
      this.setState({maxHeight:maximumHeight})
    }
  }

  onCollapseDescription(){
    this.setState({collapsed: !this.state.collapsed})
  }

  renderPage(page, key) {
    const { selectedPage, data } = this.props;
    const { width, height, fullScreen, collapsed, maxHeight } = this.state;
    //always render only central (currently loaded) image plus two images to the left and to the right
    const minPage = selectedPage <= 2 ? 0 : selectedPage - 2;
    const maxPage = selectedPage >= (data.length - 2 - 1) ? data.length-1 : selectedPage + 2; //-1 at two places due to zero based array

    const nameText = page.name ? page.name.toUpperCase() : "" || page.title ? page.title.toUpperCase() : "";
    const descriptionText = page.description || page.summary;

    if(key >= minPage && key <= maxPage){
        const photoName = <View style={[style.fixedName, {width: width}]}><Subtitle style={style.nameText} numberOfLines={2}>{nameText}</Subtitle></View>;
        const descriptionIcon = collapsed ? <Icon name="up-arrow" style={style.icons} />
                                : <Icon name="down-arrow" style={style.icons} />
        const collapsedDescriptionText = <Caption style={style.descriptionText} numberOfLines={2}>{descriptionText}</Caption>;
        const fullDescriptionText = <Caption style={style.descriptionText}>{descriptionText}</Caption>;
        const photoDescription = descriptionText ?
          <View style={[style.fixedDescription, {width: width}]}>
            <TouchableOpacity onPress={this.onCollapseDescription}>
              {descriptionText.length >=90 ? descriptionIcon : null}
              <View style={style.innerDescription} onLayout={this.limitHeight}>
                <ScrollView style={{height: collapsed? null : maxHeight}}>
                    {collapsed ? collapsedDescriptionText : fullDescriptionText}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </View>
          : null;

        return (
            <View   
              style={{ flex:1, width: width, height: height}} >
                  <ImagePreview
                      data={page}
                      key={key}
                      width={width}
                      height={height}
                      onPress={this.onPressImage}
                      onZoom={this.setFullScreen}
                  />
              { fullScreen ? null : photoName }
              { fullScreen ? null : photoDescription }
            </View>
        )
      }
  }

  render(){
    const { data, selectedPage, onPageSelected } = this.props;
    const { width, height } = this.state;
    return (
      <View 
        style={{flex: 1}} 
        onLayout={this._onLayout} >
        <HorizontalPager
          width={width}
          height={height}
          dataSource={data}
          renderPage={this.renderPage}
          selectedPage={selectedPage}
          onPageSelected={onPageSelected}
        />
      </View>
    );
  }
}

ImageGallery.propTypes = propTypes;

const style = {
  fixedName:{
    backgroundColor: '#f2f2f2',  
    position:'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    height: 60,
    top: 70,
    left: 0, 
  },
  nameText:{
    color: '#222222',
    textAlign: 'center',
  },
  fixedDescription:{
    position:'absolute',
    backgroundColor: '#f2f2f2',  
    paddingTop: 5,
    bottom: 0,
    left: 0,
  },
  innerDescription:{
    backgroundColor: '#f2f2f2',  
    padding: 15,
    marginTop: -8,
  },
  descriptionText:{
    color: '#333333',
    textAlign: 'center',
  },
  icons:{
    color: '#333333',
  },
};

const StyledImageGallery = connectStyle('shoutem.ui.ImageGallery', style)(ImageGallery);

export {
  StyledImageGallery as ImageGallery,
};
