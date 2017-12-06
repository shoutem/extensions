import React, {
  Component,
} from 'react';

import {
  Heading,
  Tile,
} from '@shoutem/ui';

export default class HelloWorld extends Component {
  render() {
    const { shortcut } = this.props;
    const { greeting } = shortcut.settings;

    return (
      <Tile styleName="text-centric">
        <Heading styleName="sm-gutter-bottom">Hello, {greeting}</Heading>
      </Tile>
    );
  }
}
