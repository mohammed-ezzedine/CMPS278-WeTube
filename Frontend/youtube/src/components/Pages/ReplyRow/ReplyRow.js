import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import '../CommentRow/CommentRow.css';

function ReplyRow({reply}) {
  return (
    <div className="commentRow reply">
      {/* <Avatar /> */}
      <div className="commentRow__info">
        <div className="commentRow__authorInfo">
          <h4>{reply.user.firstName} {reply.user.lastName}</h4>
          <span className="commentRow__timestamp">{reply.dateTime.split('T')[0]}</span>
        </div>
        <div className="commentRow__commentText">
          <p>
            {reply.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReplyRow;
