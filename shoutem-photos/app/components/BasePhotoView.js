import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export class BasePhotoView extends React.Component {
    static propTypes = {
        onPress: PropTypes.func,
        photo: PropTypes.shape({
            description: PropTypes.string,
            id: PropTypes.string,
            source: PropTypes.object,
            timeUpdated: PropTypes.string,
            title: PropTypes.string,
        }).isRequired,
    }

    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        const { onPress, photo } = this.props;

        if (_.isFunction(onPress)) {
            onPress(photo);
        }
    }
}
