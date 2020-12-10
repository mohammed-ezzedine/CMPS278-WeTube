import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import './CommentRow.css';

function CommentRow({comment}) {
  return (
    <div className="commentRow">
      <Avatar />
      <div className="commentRow__info">
        <div className="commentRow__authorInfo">
          <h4>{comment.user.firstName} {comment.user.lastName}</h4>
          <span className="commentRow__timestamp">{comment.dateTime.split('T')[0]}</span>
        </div>
        <div className="commentRow__commentText">
          <p>
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommentRow;
