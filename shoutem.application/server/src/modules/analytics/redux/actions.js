import moment from 'moment';
import { shoutemUrls } from 'src/services';
import { formatPageViewResponseData, formatResponseData } from '../services';
import { getAppAnalytics } from './selectors';

export const SAVE_ANALYTICS_DATA = '@@analytics/SAVE_ANALYTICS_DATA';
export const SET_PAGE_VIEWS_DATA = '@@analytics/SET_PAGE_VIEWS_DATA';
export const SET_LOADING = '@@analytics/SET_LOADING';
export const SET_CURRENT_FILTER = '@@analytics/SET_CURRENT_FILTER';
export const CLEAR_APP_ANALYTICS_DATA = '@@analytics/CLEAR_APP_ANALYTICS_DATA';

export function saveAnalyticsData(payload) {
  return {
    type: SAVE_ANALYTICS_DATA,
    payload,
  };
}

export function setLoading(payload) {
  return {
    type: SET_LOADING,
    payload,
  };
}

export function saveAnalyticsPageViewsData(payload) {
  return {
    type: SET_PAGE_VIEWS_DATA,
    payload,
  };
}

export function setCurrentFilter(startDate, endDate) {
  const period = moment(endDate).diff(startDate, 'days') > 1 ? 'day' : 'hour';
  const payload = {
    startDate,
    endDate,
    period,
  };

  return {
    type: SET_CURRENT_FILTER,
    payload,
  };
}

export function clearData() {
  return { type: CLEAR_APP_ANALYTICS_DATA };
}

function getGoogleApiUrl(appId) {
  return shoutemUrls.cloudApi(
    `shoutem.google-analytics/v1/apps/${appId}/analytics`,
  );
}

export function fetchGoogleAnalytics(appId, startDate, endDate) {
  return async (dispatch, getState) => {
    dispatch(setCurrentFilter(startDate, endDate));

    const apiUrl = getGoogleApiUrl(appId);
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

    const dimension =
      moment(endDate).diff(startDate, 'days') > 1 ? 'date' : 'dateHour';

    const params = {
      'filter[metric]': 'activeUsers,sessions,newUsers,screenPageViews',
      'filter[dimension]': `${dimension},platform`,
      'filter[from]': formattedStartDate,
      'filter[to]': formattedEndDate,
      sort: `dimension.${dimension}`,
    };

    const url = `${apiUrl}?${new URLSearchParams(params)}`;
    const response = await fetch(url)
      .then(res => res.json())
      .then(data => data?.data?.attributes);

    const existingData = getAppAnalytics(getState());
    const analyticsData = formatResponseData(response, existingData);

    return dispatch(saveAnalyticsData(analyticsData));
  };
}

export function fetchGooglePageViews(appId, startDate, endDate) {
  return async dispatch => {
    const apiUrl = getGoogleApiUrl(appId);
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

    const params = {
      'filter[metric]': 'screenPageViews',
      'filter[dimension]': 'unifiedScreenName',
      'filter[from]': formattedStartDate,
      'filter[to]': formattedEndDate,
      sort: '-metric.screenPageViews',
      'row[limit]': 10,
    };

    const url = `${apiUrl}?${new URLSearchParams(params)}`;
    const response = await fetch(url)
      .then(res => res.json())
      .then(data => data?.data?.attributes);

    const data = formatPageViewResponseData(response);

    return dispatch(saveAnalyticsPageViewsData(data));
  };
}

export function fetchAppAnalytics(appId, startDate, endDate) {
  return async dispatch => {
    // TODO: If dates already exist in state, don't fetch again
    dispatch(clearData());
    dispatch(setLoading(true));

    await dispatch(fetchGoogleAnalytics(appId, startDate, endDate));
    await dispatch(fetchGooglePageViews(appId, startDate, endDate));

    dispatch(setLoading(false));
  };
}
