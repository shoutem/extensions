import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Screen, EmptyStateView } from '@shoutem/ui';
import { ext } from '../const';

function NoContent() {
  return (
    <Screen styleName="paper">
      <EmptyStateView
        message={I18n.t('shoutem.application.preview.noContentErrorMessage')}
      />
    </Screen>
  );
}

NoContent.propTypes = {
  title: PropTypes.string,
};

export default connectStyle(ext('NoContent'))(NoContent);
