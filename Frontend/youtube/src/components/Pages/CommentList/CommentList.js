import React from 'react';
import CommentRow from '../CommentRow/CommentRow';

function CommentList({comments}) {
  return (
    <div className="commentList">
      {comments?.map((comment) => <CommentRow key={comment.id} comment={comment} />)}
    </div>
  );
}

export default CommentList;
