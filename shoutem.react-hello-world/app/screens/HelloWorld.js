import React, { PureComponent } from 'react';

import {
  Heading,
  Tile,
} from '@shoutem/ui';

export default class HelloWorld extends PureComponent {
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
