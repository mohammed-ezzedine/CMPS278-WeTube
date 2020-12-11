import React from 'react';
import ReplyRow from '../ReplyRow/ReplyRow';

function ReplyList({replies}) {
  return (
    <div className="commentList">
      {replies?.map((reply) => <ReplyRow reply={reply} />)}
    </div>
  );
}

export default ReplyList;
