import React from 'react';
import PropTypes from 'prop-types';
import {
  Caption,
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';

export default function ListPeopleView({ person, onPress: onPressHandler }) {
  function onPress() {
    onPressHandler(person);
  }

  const personImage = person.image
    ? { uri: person.image.url }
    : assets.noImagePlaceholder;

  return (
    <TouchableOpacity key={person.id} onPress={onPress}>
      <View>
        <Row>
          <Image
            source={personImage}
            styleName="small rounded-corners placeholder"
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>
              {/* eslint-disable-next-line react-native/no-raw-text */}
              {person.firstName} {person.lastName}
            </Subtitle>
            <Caption>{person.profession}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </View>
    </TouchableOpacity>
  );
}

ListPeopleView.propTypes = {
  person: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
