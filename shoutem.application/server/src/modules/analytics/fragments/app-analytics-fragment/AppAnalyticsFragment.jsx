import React, { useEffect, useMemo, useState } from 'react';
import { FormGroup, HelpBlock } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import { get, toString } from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  AnalyticsDropdown,
  AnalyticsGraph,
  AnalyticsTab,
  AnalyticsTable,
  CustomRangeModal,
} from '../../components';
import { resolveAnalyticsFilters, resolveAppAnalyticsTabs } from '../../const';
import { fetchAppAnalytics, getAppAnalytics } from '../../redux';
import {
  formatAnalyticsPercentagesByPlatform,
  formatDatetimeParams,
  formatGraphData,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

const DEFAULT_X_AXIS_PROPS = { dataKey: 'xAxisLabel' };
const PAGE_VIEWS_TABLE_HEADERS = ['Page', 'Page views'];

export default function AppAnalyticsFragment({ appId }) {
  const dispatch = useDispatch();
  const appAnalytics = useSelector(getAppAnalytics);
  const { loading, categories } = appAnalytics;

  const TABS = useMemo(() => resolveAppAnalyticsTabs(), []);
  const FILTERS = useMemo(() => resolveAnalyticsFilters(), []);

  const DEFAULT_TIMEFRAME = formatDatetimeParams(FILTERS.LAST_30_DAYS);

  const [customRangeModalActive, setCustomRangeModalActive] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.DOWNLOADS);
  const [activeFilter, setActiveFilter] = useState(FILTERS.LAST_30_DAYS);
  const [startDate, setStartDate] = useState(DEFAULT_TIMEFRAME.startDate);
  const [endDate, setEndDate] = useState(DEFAULT_TIMEFRAME.endDate);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchAppAnalytics(appId, startDate, endDate)).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      setError(i18next.t(LOCALIZATION.ERROR_MESSAGE));
    });
  }, [appId, activeFilter, startDate, endDate, dispatch]);

  const handleDownloadsTabPress = () => setActiveTab(TABS.DOWNLOADS);

  const handleSessionsTabPress = () => setActiveTab(TABS.SESSIONS);

  const handleActiveUsersTabPress = () => setActiveTab(TABS.ACTIVE_USERS);

  const handlePageViewsTabPress = () => setActiveTab(TABS.PAGE_VIEWS);

  const handleHideCustomRangeModal = () => setCustomRangeModalActive(false);

  const handleCustomRangeModalSubmit = (startDate, endDate) => {
    const customRangeFilter = `${startDate} - ${endDate}`;

    setActiveFilter(customRangeFilter);
    setStartDate(startDate);
    setEndDate(endDate);
    setError(null);
  };

  function handleFilterClick(filter) {
    if (filter === FILTERS.CUSTOM_RANGE) {
      setCustomRangeModalActive(true);
      return;
    }

    const { startDate, endDate } = formatDatetimeParams(filter);

    setActiveFilter(filter);
    setStartDate(startDate);
    setEndDate(endDate);
    setError(null);
  }

  const graphData = formatGraphData(appAnalytics);

  const analyticsPercentages = formatAnalyticsPercentagesByPlatform(
    get(categories, activeTab.key),
  );

  const isPageViewsTabActive = useMemo(() => activeTab === TABS.PAGE_VIEWS, [
    activeTab,
    TABS.PAGE_VIEWS,
  ]);

  return (
    <div>
      <div className="analytics-dropdown">
        <AnalyticsDropdown
          filters={FILTERS}
          activeFilter={activeFilter}
          onItemClick={handleFilterClick}
        />
      </div>
      <LoaderContainer isLoading={loading} isOverlay>
        <div className="app-analytics__analytics-container">
          <div className="app-analytics__main-container">
            <AnalyticsTab
              tab={TABS.DOWNLOADS}
              value={toString(categories?.downloads?.total)}
              onTabClick={handleDownloadsTabPress}
              active={activeTab === TABS.DOWNLOADS}
              graphData={graphData}
            />
            <AnalyticsTab
              tab={TABS.SESSIONS}
              value={toString(categories?.sessions?.total)}
              onTabClick={handleSessionsTabPress}
              active={activeTab === TABS.SESSIONS}
              graphData={graphData}
            />
            <AnalyticsTab
              tab={TABS.ACTIVE_USERS}
              value={toString(categories?.activeUsers?.total)}
              onTabClick={handleActiveUsersTabPress}
              active={activeTab === TABS.ACTIVE_USERS}
              graphData={graphData}
            />
            <AnalyticsTab
              tab={TABS.PAGE_VIEWS}
              value={toString(categories?.pageViews?.total)}
              onTabClick={handlePageViewsTabPress}
              active={isPageViewsTabActive}
              graphData={graphData}
            />
          </div>
          <AnalyticsGraph
            graphData={graphData}
            lineDataKey={activeTab.key}
            label={activeTab.title}
            xAxisProps={DEFAULT_X_AXIS_PROPS}
            analyticsPercentages={analyticsPercentages}
          />
        </div>
        {isPageViewsTabActive && (
          <AnalyticsTable
            data={appAnalytics?.pageViews}
            title={i18next.t(LOCALIZATION.ANALYTICS_TABLE_TITLE)}
            headers={PAGE_VIEWS_TABLE_HEADERS}
          />
        )}
        {error && (
          <FormGroup validationState="error">
            <HelpBlock>{error}</HelpBlock>
          </FormGroup>
        )}
      </LoaderContainer>
      {customRangeModalActive && (
        <CustomRangeModal
          onHide={handleHideCustomRangeModal}
          onSubmit={handleCustomRangeModalSubmit}
        />
      )}
    </div>
  );
}

AppAnalyticsFragment.propTypes = {
  appId: PropTypes.string.isRequired,
};
