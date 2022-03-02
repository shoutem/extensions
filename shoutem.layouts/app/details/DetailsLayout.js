import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, EmptyStateView, ScrollView, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import DetailsSkeletonPlaceholder from './DetailsSkeletonPlaceholder';

export function DetailsLayout({
  children,
  emptyStateViewProps,
  isLoading,
  LeadImage,
  onScroll,
  title,
}) {
  if (isLoading) {
    return <DetailsSkeletonPlaceholder />;
  }

  if (emptyStateViewProps) {
    const defaultEmptyStateViewProps = {
      icon: 'error',
      message: I18n.t('shoutem.application.preview.noContentErrorMessage'),
    };

    return (
      <EmptyStateView
        {...(emptyStateViewProps || defaultEmptyStateViewProps)}
      />
    );
  }

  const resolvedStyleName = LeadImage ? '' : 'lg-gutter-bottom';

  return (
    <ScrollView onScroll={onScroll}>
      {!!LeadImage && <LeadImage />}
      <View styleName="solid">
        {!!title && (
          <View styleName={resolvedStyleName}>
            <Title styleName="xl-gutter-top md-gutter-bottom h-center">
              {title}
            </Title>
          </View>
        )}
        {children}
      </View>
      <Divider />
    </ScrollView>
  );
}

DetailsLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  emptyStateViewProps: PropTypes.object,
  isLoading: PropTypes.bool,
  LeadImage: PropTypes.func,
  style: PropTypes.object,
  title: PropTypes.string,
  onScroll: PropTypes.func,
};

DetailsLayout.defaultProps = {
  children: undefined,
  emptyStateViewProps: undefined,
  isLoading: false,
  style: {},
  title: '',
  LeadImage: undefined,
  onScroll: undefined,
};

export default connectStyle(ext('DetailsLayout'))(DetailsLayout);
