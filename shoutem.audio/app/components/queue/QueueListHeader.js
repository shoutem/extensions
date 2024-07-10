import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Title } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

const QueueListHeader = ({ style }) => {
  return <Title style={style.title}>{I18n.t(ext('queueTitle'))}</Title>;
};

QueueListHeader.propTypes = {
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('QueueListHeader'))(QueueListHeader);
