import PropTypes from 'prop-types';
import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
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
