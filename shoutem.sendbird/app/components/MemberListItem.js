import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  ImageBackground,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';

class MemberListItem extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleUserPress() {
    const { user } = this.props;

    Keyboard.dismiss();

    return navigateTo(ext('ChatWindowScreen'), { user });
  }

  render() {
    const { user, style } = this.props;

    const profileImageUrl = _.get(user, 'profile.image');
    const memberName =
      _.get(user, 'profile.name') || _.get(user, 'profile.nick', '');

    return (
      <TouchableOpacity onPress={this.handleUserPress}>
        <Row style={style.row}>
          <ImageBackground
            imageStyle={style.image}
            source={{ uri: profileImageUrl }}
            style={style.image}
            styleName="small"
          />
          <View styleName="vertical v-start">
            <View styleName="horizontal space-between v-center">
              <Subtitle style={[style.text, style.nickname]}>
                {memberName}
              </Subtitle>
            </View>
          </View>
        </Row>
      </TouchableOpacity>
    );
  }
}

MemberListItem.propTypes = {
  user: PropTypes.object.isRequired,
  style: PropTypes.object,
};

MemberListItem.defaultProps = {
  style: {},
};

function mapStateToProps(state) {
  return {
    state,
  };
}

export default connect(
  mapStateToProps,
  null,
)(connectStyle(ext('MemberListItem'))(MemberListItem));
