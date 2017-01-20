import React, {
  Component
} from 'react';

import {
  View as RNView,
  Modal
} from 'react-native';

import {
  Image,
  Text,
  Icon,
  Title,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { ImageGallery } from '../components/ImageGallery';
import Share from 'react-native-share';

export default class PhotoDetails extends Component {

  constructor(props) {
    super(props);
    this.onPageSelected = this.onPageSelected.bind(this);
    this.onFullScreen = this.onFullScreen.bind(this);
    this.onShare = this.onShare.bind(this);
    this.state = { 
      fullScreen: false, 
      position: 0 
    }; 
  }

  componentWillMount(){
    const { photo, photos } = this.props;
    const position = photos.indexOf(photo);
    this.setState({ 
      position: position, 
    });
  }

  onShare() {
    const { photos } = this.props;
    const position = this.state.position;

    const nameText = photos[position].name ? photos[position].name.toUpperCase() : "" || photos[position].title ? photos[position].title.toUpperCase() : "";
    const descriptionText = photos[position].description || photos[position].summary;
    const imageUrl = _.get(photos[position], 'image.url') || _.get(photos[position], 'imageAttachments[0].url');


    Share.open({
      title: nameText,
      message: descriptionText,
      url: imageUrl,
    }, (sharingError) => {
      console.error(sharingError);
    });
  }

  onPageSelected(newPage){
    const currentPage = this.state.position;
    if (currentPage != newPage){
      this.setState({position: newPage});
    }
  }

  onFullScreen(newState){
    if (this.state.fullScreen !== newState) {
      this.setState({fullScreen:newState});
    }
  }

  render() {
    const { photo, setNavBarProps, photos } = this.props;
    const { position, fullScreen } = this.state;

    //set the title in the NavigationBar depending on full screen status
    if(fullScreen){
      setNavBarProps({
        leftComponent: <View></View>, //remove white back button
        styleName:'clear'
      });
    }
    else{
      setNavBarProps({
        title: position + 1 + "/" + photos.length,
        rightComponent: <View styleName="horizontal"><Icon name="comment" style={style.icons} /><Icon style={style.icons} name="share" onPress={this.onShare} /></View>,
      });  
    }

    return ( 
      <RNView 
        renderToHardwareTextureAndroid
        style={[style.container, fullScreen&&style.fullScreenContainer]}>
          <ImageGallery  
            data={photos}
            selectedPage={position}
            onPageSelected={this.onPageSelected}
            onFullScreen={this.onFullScreen}
          /> 
      </RNView> 
    );
  }
}

const style = {
  container: {
    backgroundColor: '#f2f2f2',
    position:'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
  },
  fullScreenContainer: {
    backgroundColor: '#000000',
  },
  icons: {
    color: '#333333',
    marginHorizontal: 8,
  },
}

const StyledPhotoDetails = connectStyle('shoutem.photos.photos', style)(PhotoDetails);


