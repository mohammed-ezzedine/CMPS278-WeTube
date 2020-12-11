import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Button } from "@material-ui/core";

import './CommentRow.css';
import ReplyList from '../ReplyList/ReplyList';

function CommentRow({comment}) {
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [inputReply, setInputReply] = useState("");

  const handleReplyChange = (e) => {
    setInputReply(e.target.value);
  }

  function sendReply() {
    if(inputReply == "" || currentUser == null) {
      return;
    }

    fetch(`https://youtube278.azurewebsites.net/api/comment/reply`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret,
        commentId: comment.id,
        message: inputReply
      }),
    })
    .then(d => d.json())
    .then(d => {
      setInputReply("");
      comment.userCommentReplies.push(d);
    })
    .catch((error) => console.log(error));
  }

  const addReplySection = (currentUser == null)? "" :
    <div className="add-reply">
      <textarea 
      rows="1" 
      placeholder="Add a reply..."
      onChange={(e) => handleReplyChange(e)} />
      <div className="submit-wrapper">
        <Button 
          variant="contained"
          onClick={() => sendReply()}
        >Send Reply</Button>
      </div>
    </div>

  return (
    <div className="commentRow">
      {/* <Avatar /> */}
      <div className="commentRow__info">
        <div className="commentRow__authorInfo">
          <h4>{comment.user.firstName} {comment.user.lastName}</h4>
          <span className="commentRow__timestamp">{comment.dateTime.split('T')[0]}</span>
        </div>
        <div className="commentRow__commentText">
          <p>
            {comment.text}
          </p>
          {addReplySection}
          <ReplyList replies={comment.userCommentReplies} />
        </div>
      </div>
    </div>
  );
}

export default CommentRow;
