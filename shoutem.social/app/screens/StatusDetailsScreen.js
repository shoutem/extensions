import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Modal } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/stack';
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
import {
  Divider,
  ImageGallery,
  ListView,
  Screen,
  ScrollView,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import {
  getRouteParams,
  HeaderCloseButton,
  HeaderIconButton,
} from 'shoutem.navigation';
import CommentView from '../components/CommentView';
import NewCommentFooter from '../components/NewCommentFooter';
import { CommentsListSkeleton } from '../components/skeleton-loading';
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

  const [showImagePreview, setImagePreview] = useState(false);
  const [imageGalleryData, setImageGalleryData] = useState(null);

  const headerHeight = useHeaderHeight();

  const status = useSelector(state => selectors.getStatus(state, statusId));
  const comments = useSelector(state =>
    selectors.getCommentsForStatus(state, statusId),
  );
  const filteredComments = useSelector(state =>
    selectors.getFilteredCommentsForStatus(state, statusId),
  );

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

  useLayoutEffect(() => {
    return navigation.setOptions({
      title: I18n.t(ext('postDetailsNavBarTitle')),
      headerRight,
    });
  }, [dispatch, headerRight, navigation, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = useCallback(() => {
    dispatch(loadComments(statusId));
  }, [dispatch, statusId]);

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

  const handleShowImagePreview = useCallback(imageGalleryData => {
    setImageGalleryData(imageGalleryData);
    setImagePreview(true);
  }, []);

  const handleHideImagePreview = useCallback(() => {
    setImagePreview(false);
  }, []);

  const renderRow = useCallback(
    comment => {
      return (
        <CommentView
          openProfile={openProfileForLegacyUser}
          comment={comment}
          deleteComment={deleteComment}
          onImagePress={handleShowImagePreview}
        />
      );
    },
    [handleShowImagePreview],
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

  const commentsData = useMemo(() => filteredComments?.data || [], [
    filteredComments,
  ]);

  const initialLoading =
    !isValid(comments) ||
    (isBusy(comments) &&
      (!comments || comments?.length === 0 || !isInitialized(comments)));

  return (
    <Screen styleName="paper with-notch-padding">
      {initialLoading && (
        <ScrollView>
          {renderStatus()}
          <CommentsListSkeleton />
        </ScrollView>
      )}
      {!initialLoading && (
        <ListView
          data={commentsData}
          loading={isBusy(commentsData)}
          renderHeader={renderStatus}
          renderRow={renderRow}
          renderFooter={renderLoadingMoreText}
          onLoadMore={loadMoreComments}
          ListEmptyComponent={null}
          style={style.list}
        />
      )}
      {enableComments && (
        <NewCommentFooter
          enablePhotoAttachments={enablePhotoAttachments}
          focusAddCommentInput={focusAddCommentInput}
          statusId={statusId}
          maxStatusLength={maxStatusLength}
        />
      )}

      <Modal
        onRequestClose={handleHideImagePreview}
        visible={showImagePreview}
        animationType="fade"
        transparent
      >
        <View styleName="fill-parent">
          <View style={[style.headerContainer, { height: headerHeight }]}>
            <HeaderCloseButton
              onPress={handleHideImagePreview}
              tintColor={style.closeIcon}
            />
          </View>
          <ImageGallery data={imageGalleryData} selectedIndex={0} />
        </View>
      </Modal>
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
