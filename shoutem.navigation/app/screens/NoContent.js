import PropTypes from 'prop-types';
import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Screen, EmptyStateView } from '@shoutem/ui';
import { NavigationBar } from '../components/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function NoContent({ title }) {
  return (
    <Screen styleName="full-screen paper">
      <NavigationBar title={title} />
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
