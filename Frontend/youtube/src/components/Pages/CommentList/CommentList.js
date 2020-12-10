import React from 'react';
import CommentRow from '../CommentRow/CommentRow';

function CommentList({comments}) {
  return (
    <div className="commentList">
      {comments?.map((comment) => <CommentRow comment={comment} />)}
    </div>
  );
}

export default CommentList;
