import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import './CommentRow.css';

function CommentRow() {
  return (
    <div className="commentRow">
      <Avatar />
      <div className="commentRow__info">
        <div className="commentRow__authorInfo">
          <h4>Firas Harb</h4>
          <span className="commentRow__timestamp">6 Years Ago</span>
        </div>
        <div className="commentRow__commentText">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi cum
            officiis vitae perferendis quae, laborum eaque cumque temporibus.
            Aspernatur quo perferendis vero laboriosam tempore consequatur hic
            quaerat molestiae reprehenderit ea!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommentRow;
