import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import SmallVimeoView from '../components/SmallVimeoView';
import { ext } from '../const';
import { VimeoList, mapStateToProps, mapDispatchToProps } from './VimeoList';

class SmallVimeoList extends VimeoList {
  renderRow(video) {
    return <SmallVimeoView video={video} onPress={this.openDetailsScreen} />;
  }
}

export default connectStyle(ext('SmallVimeoList'))(
  connect(mapStateToProps, mapDispatchToProps)(SmallVimeoList),
);
