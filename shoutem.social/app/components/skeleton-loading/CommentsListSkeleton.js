import React from 'react';
import CommentViewSkeleton from './CommentViewSkeleton';

export default function CommentsListSkeleton() {
  return (
    <>
      <CommentViewSkeleton />
      <CommentViewSkeleton />
      <CommentViewSkeleton />
    </>
  );
}
