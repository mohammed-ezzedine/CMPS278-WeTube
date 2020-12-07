import React from 'react';
import CommentRow from '../CommentRow/CommentRow';

function CommentList() {
  return (
    <div className="commentList">
      <CommentRow />
      <CommentRow />
      <CommentRow />
    </div>
  );
}

export default CommentList;
