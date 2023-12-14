import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import ActionSheet from 'react-native-action-sheet';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  hasNext,
  isBusy,
  isInitialized,
  isValid,
  next,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Divider, ListView, Screen, Text, View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import {
  getRouteParams,
  HeaderIconButton,
  isTabBarNavigation,
} from 'shoutem.navigation';
import CommentView from '../components/CommentView';
import NewCommentFooter from '../components/NewCommentFooter';
import { CommentViewSkeleton } from '../components/skeleton-loading';
import StatusView from '../components/StatusView';
import { ext } from '../const';
import { deleteComment, deleteStatus, loadComments, selectors } from '../redux';
import { getGiphyApiKey } from '../redux/selectors';
import { openProfileForLegacyUser } from '../services';

export function StatusDetailsScreen(props) {
  const { navigation, style } = props;
  const {
    statusId,
    maxStatusLength,
    focusAddCommentInputOnMount,
  } = getRouteParams(props);

  const addCommentInputRef = useRef(null);

  const giphyApiKey = useSelector(getGiphyApiKey);

  const dispatch = useDispatch();

  const {
    enableComments,
    enableGifAttachments,
    enablePhotoAttachments,
    enableInteractions,
  } = useSelector(state => getExtensionSettings(state, ext()));
  const status = useSelector(state => selectors.getStatus(state, statusId));
  const comments = useSelector(state =>
    selectors.getCommentsForStatus(state, statusId),
  );
  const filteredComments = useSelector(state =>
    selectors.getFilteredCommentsForStatus(state, statusId),
  );
  const isTabBar = useSelector(isTabBarNavigation);

  const headerRight = useCallback(
    props => {
      // If it's status owner
      if (_.get(status, 'deletable') !== 'yes') {
        return null;
      }

      return (
        <HeaderIconButton
          iconName="more-horizontal"
          onPress={openActionSheet}
          {...props}
        />
      );
    },
    [openActionSheet, status],
  );

  const openActionSheet = useCallback(() => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: [
          I18n.t(ext('deleteStatusOption')),
          I18n.t(ext('cancelStatusSelectionOption')),
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      index => {
        if (index === 0) {
          return dispatch(deleteStatus(status)).then(navigation.goBack);
        }

        return null;
      },
    );
  }, [dispatch, navigation.goBack, status]);

  const loadStatusComments = useCallback(() => {
    if (status?.id) {
      dispatch(loadComments(status.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    return navigation.setOptions({
      title: I18n.t(ext('postDetailsNavBarTitle')),
      headerRight,
    });
  }, [dispatch, headerRight, navigation, status]);

  useEffect(() => {
    loadStatusComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreComments = () => {
    dispatch(next(comments));
  };

  const renderLoadingMoreText = useCallback(() => {
    if (!hasNext(comments)) {
      return null;
    }

    return (
      <View styleName="horizontal h-center v-center md-gutter">
        <Text>{I18n.t(ext('loadingMoreComments'))}</Text>
        <Divider styleName="line" />
      </View>
    );
  }, [comments]);

  const renderRow = useCallback(
    comment => {
      return (
        <CommentView
          comment={comment}
          deleteComment={deleteComment}
          openProfile={openProfileForLegacyUser}
          statusId={statusId}
        />
      );
    },
    [statusId],
  );

  const renderStatus = useCallback(() => {
    return (
      <View styleName="lg-gutter-bottom">
        <StatusView
          status={status}
          enableComments={enableComments}
          enableInteractions={enableInteractions}
          enableImageFullScreen
          goBackAfterBlock
          maxStatusLength={maxStatusLength}
          addCommentInputRef={addCommentInputRef}
        />
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxStatusLength, status]);

  const skeletonLoading = useMemo(
    () => ({
      data: [1, 2, 3], // just a mockup of 3 array elements to produce 3 skeleton components in list
      component: () => <CommentViewSkeleton />,
    }),
    [],
  );

  const commentsData = useMemo(() => filteredComments?.data || [], [
    filteredComments,
  ]);

  const initialLoading =
    !isValid(comments) ||
    (isBusy(comments) &&
      (!comments || comments?.length === 0 || !isInitialized(comments)));

  const resolvedData = useMemo(
    () => (initialLoading ? skeletonLoading.data : commentsData),
    [initialLoading, commentsData, skeletonLoading.data],
  );
  const resolvedRenderRow = useMemo(
    () => (initialLoading ? skeletonLoading.component : renderRow),
    [initialLoading, skeletonLoading.component, renderRow],
  );

  const screenStyle = isTabBar ? 'paper' : 'paper md-gutter-bottom';

  return (
    <Screen styleName={screenStyle}>
      <ListView
        data={resolvedData}
        loading={isBusy(commentsData)}
        ListEmptyComponent={null}
        renderFooter={renderLoadingMoreText}
        renderHeader={renderStatus}
        renderRow={resolvedRenderRow}
        style={style.list}
        onLoadMore={loadMoreComments}
        onRefresh={loadStatusComments}
      />
      {enableComments && (
        <NewCommentFooter
          addCommentInputRef={addCommentInputRef}
          statusId={statusId}
          maxStatusLength={maxStatusLength}
          focusAddCommentInputOnMount={focusAddCommentInputOnMount}
          enableGifAttachments={enableGifAttachments}
          enablePhotoAttachments={enablePhotoAttachments}
          giphyApiKey={giphyApiKey}
        />
      )}
    </Screen>
  );
}

StatusDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  focusAddCommentInputOnMount: PropTypes.bool,
  style: PropTypes.object,
};

StatusDetailsScreen.defaultProps = {
  focusAddCommentInputOnMount: false,
  style: {},
};

export default connectStyle(ext('StatusDetailsScreen'))(StatusDetailsScreen);
