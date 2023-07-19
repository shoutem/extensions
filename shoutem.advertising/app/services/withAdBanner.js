import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';
import { AdContext } from '../providers';

export function withAdBanner(WrappedComponent) {
  function AdComponent(props) {
    const { extensionSettings, route } = props;

    const { bannerPlacement } = extensionSettings;

    return (
      <AdContext.Consumer>
        {context => {
          const isExcludedScreen = _.includes(
            context?.disabledBannerScreens,
            route.name,
          );
          const hasCustomBanner = _.includes(
            context?.customBannerScreens,
            route.name,
          );

          if (
            !context?.isConfigured ||
            WrappedComponent.adBannerDisabled ||
            isExcludedScreen
          ) {
            return <WrappedComponent {...props} />;
          }

          if (WrappedComponent.hasCustomAdRenderer || hasCustomBanner) {
            return (
              <WrappedComponent
                {...props}
                renderAdBanner={context?.renderBanner}
              />
            );
          }

          const bannerPlacementTop = bannerPlacement === 'Top';

          return (
            <View styleName="flexible">
              {bannerPlacementTop && context?.renderBanner()}
              <WrappedComponent {...props} />
              {!bannerPlacementTop && context?.renderBanner()}
            </View>
          );
        }}
      </AdContext.Consumer>
    );
  }

  const mapStateToProps = state => ({
    extensionSettings: getExtensionSettings(state, ext()),
  });

  AdComponent.propTypes = {
    extensionSettings: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  };

  return connect(mapStateToProps)(AdComponent);
}
