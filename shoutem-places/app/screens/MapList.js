import React, {
  Component
} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Icon,
  Divider,
  Title,
  Row,
  View,
  Image,
  Spinner,
  Caption,
  Subtitle,
  DropDownMenu,
  Overlay,
  Screen
} from '@shoutem/ui';

import { MapView } from '@shoutem/ui-addons';

import { connect } from 'react-redux'
import { navigateTo, navigateBack } from '@shoutem/core/navigation';
import { bindActionCreators } from 'redux';
import { ext } from '../const';
import {
  isBusy,
  find,
  getCollection,
  shouldRefresh,
  isInitialized
} from '@shoutem/redux-io';

class MapList extends Component {


  constructor(props) {
    super(props);
    const passCat = this.props;
    const categoryIds = this.props.categoryIds || [this.props.parentCategoryId];
    this.state = { selectedCategory: passCat, selectedCategoryIds: [...categoryIds]};
    this.state = { selectedMarker: null };
    this.getMarkers = this.getMarkers.bind(this);
    this.renderImageRow = this.renderImageRow.bind(this);
    this.loadCategory = this.loadCategory.bind(this);
    this.findSelectedPlace = this.findSelectedPlace.bind(this);
  }

componentDidMount() {

    const { find, places, placeCategories } = this.props;
    if (shouldRefresh(places)) {
      find(ext('places'), 'all', {
        include: 'image',
      });
    }

    if (shouldRefresh(placeCategories)) {
      find("shoutem.core.categories", 'placeCategories', {
        schema: ext('places')
      });
    }
  }

  loadCategory(category = null) {

    const { find } = this.props;
    if (category) {
      this.setState({ selectedCategory: category['id'] })
      find(ext('places'), 'all', {
        "filter[categories]": category['id'],
        include: 'image',
      });

    }
    else {
      find(ext('places'), 'all', {
        include: 'image',
      });
    }
  }

checkForImage(place){
if(place.image)
return ({uri: place.image.url}) ;
else
return (require('../assets/data/no_image.png'));
}

renderDropDown(){

const { placeCategories } = this.props;
const { selectedCategoryIds } = this.state;

  return (
    <DropDownMenu styleName='horizontal'
      options={placeCategories}
      onOptionSelected={this.onCategorySelected}
      selectedOption={this.state.selectedCategory}
      titleProperty={"name"}
      valueProperty={"id"}/>
      );
  }

  findSelectedPlace(){
    const { selectedMarker } = this.state;
    const { places } = this.props;
    var returnedPlace=null;


       if (selectedMarker) {
         const selectedPlace = places.find(place => place.id === selectedMarker.placeId);
         if (selectedPlace) returnedPlace=selectedPlace;
        }
       else returnedPlace=places[0];
       if (returnedPlace==null) returnedPlace=places[0];
       return returnedPlace;
  }

  getMarkers(places) {
    const markers = [];

    for (var i = 0; i < places.length; i++) {
      if (places[i].latitude && places[i].longitude)
      {
      markers.push({
        latitude: parseFloat(places[i].latitude),
        longitude: parseFloat(places[i].longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        placeId: places[i].id
  });}}
 console.log('markeri',markers);
  return(markers);
}

renderImageRow()
{
  const { places, navigateTo } = this.props;
  const { selectedMarker } = this.state;
  const returnedPlace = this.findSelectedPlace();

  return(
  <TouchableOpacity onPress={() => navigateTo({
          screen: ext('PlacesDetailsLarge'),
          props: { place: returnedPlace }
        })}>
        <Row>
  <Image styleName="small" source={this.checkForImage(returnedPlace)}/>
  <View styleName="vertical">
    <Subtitle numberOfLines={1}>{returnedPlace.name}</Subtitle>
    <Caption numberOfLines={2}>{returnedPlace.address}</Caption>
  </View>
  <Icon name="add-to-favorites"/>

  </Row><Divider styleName="line" />
      </TouchableOpacity>);
}

render() {


  const { places, placeCategories, navigateTo, passCat, navigateBack } = this.props;

  if (!this.state.selectedCategory) {  this.state.selectedCategory = passCat; }
  this.props.setNavBarProps({
    leftComponent: <Text/>,
    centerComponent: <Text>PLACES</Text>,
    rightComponent: <TouchableOpacity onPress={() => navigateBack()}><View><Text>List</Text></View></TouchableOpacity>
  });

  return (

    <Screen>

{this.renderDropDown() }

      <MapView

        markers={this.getMarkers(places)}
        onMarkerPressed={marker => {
          this.setState({selectedMarker: marker});
                                    }}
        />


      {this.renderImageRow()}

    </Screen>

  );
}
}

export default connect(
  (state, ownProps) => ({
    parentCategoryId: _.get(ownProps, 'parentCategory.id'),
    places: getCollection(state[ext()].allPlaces, state),
    placeCategories: getCollection(state[ext()].placeCategories, state)
  }),
  (dispatch) => bindActionCreators({ navigateTo, navigateBack, find }, dispatch)
)(MapList)
