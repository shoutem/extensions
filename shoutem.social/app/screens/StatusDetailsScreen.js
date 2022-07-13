import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
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
import { openProfileForLegacyUser } from '../services';

export function StatusDetailsScreen(props) {
  const { navigation, style } = props;
  const {
    focusAddCommentInput,
    enableComments,
    enableInteractions,
    enablePhotoAttachments,
    statusId,
    maxStatusLength,
  } = getRouteParams(props);

  const dispatch = useDispatch();

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
  }, []);

  useLayoutEffect(() => {
    return navigation.setOptions({
      title: I18n.t(ext('postDetailsNavBarTitle')),
      headerRight,
    });
  }, [dispatch, headerRight, navigation, status]);

  useEffect(() => {
    loadStatusComments();
  }, []);

  const loadMoreComments = useCallback(() => {
    dispatch(next(comments));
  }, [comments, dispatch]);

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
          enableImageFullScreen
          enableComments={enableComments}
          enableInteractions={enableInteractions}
          enablePhotoAttachments={enablePhotoAttachments}
          goBackAfterBlock
          maxStatusLength={maxStatusLength}
          showNewCommentInput={false}
        />
      </View>
    );
  }, [
    enableComments,
    enableInteractions,
    enablePhotoAttachments,
    maxStatusLength,
    status,
  ]);

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

  const screenStyle = isTabBar ? 'paper' : 'paper with-notch-padding';

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
          enablePhotoAttachments={enablePhotoAttachments}
          focusAddCommentInput={focusAddCommentInput}
          statusId={statusId}
          maxStatusLength={maxStatusLength}
        />
      )}
    </Screen>
  );
}

StatusDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

StatusDetailsScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('StatusDetailsScreen'))(StatusDetailsScreen);
