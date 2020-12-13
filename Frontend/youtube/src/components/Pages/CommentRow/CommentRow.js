import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Button, Checkbox, FormControlLabel } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import './CommentRow.css';

import Axios from 'axios';

import ReplyList from '../ReplyList/ReplyList';


function CommentRow({comment}) {
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [inputReply, setInputReply] = useState("");
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [liked, setLiked] = useState(null)
  const [disliked, setDisliked] = useState(null)


  useEffect(() => {
    if (comment) {
      setLikes(comment.userCommentReactions.filter(reaction => reaction.like).length);
      setDislikes(comment.userCommentReactions.filter(reaction => !reaction.like).length);
      setLiked(comment.userCommentReactions.filter(reaction => reaction.user.id === currentUser?.id && reaction.like).length > 0);
      setDisliked(comment.userCommentReactions.filter(reaction => reaction.user.id === currentUser?.id && !reaction.like).length > 0);
    }
    
  }, [comment])

  const handleReplyChange = (e) => {
    setInputReply(e.target.value);
  }
  const like = async() => {
    if (liked || currentUser == null) {
      return;
    }
    try {
      
      let response = await Axios.post(`https://youtube278.azurewebsites.net/api/Comment/like`, {
        "UserId": currentUser.id,
        "UserSecret": currentUser.secret,
        "CommentId": comment.id
    })
    setLiked(true)
    setLikes(likes + 1)

      if(disliked) {
        setDisliked(false)
        setDislikes(dislikes > 0 ? dislikes -1 : 0 )
          
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }
  const dislike = async() => {
    if (disliked || currentUser == null) {
      return;
    }
    try {
      
      let response = await Axios.post(`https://youtube278.azurewebsites.net/api/Comment/dislike`, {
        "UserId": currentUser.id,
        "UserSecret": currentUser.secret,
        "CommentId": comment.id
    })
    setDisliked(true)
    setDislikes(dislikes+ 1)
      if(liked) {
        setLiked(false)
        setLikes(likes >0 ? likes -1 : 0)
          
      }
    } catch (error) {
      console.error(error.response.data);
    }
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
      <TextField 
        className="reply-textarea"
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
          <FormControlLabel
              control={<Checkbox icon={<ThumbUpAltOutlinedIcon style={{color:  liked !== null && liked ? "blue" : "" }}/>} 
              checkedIcon={<ThumbUpIcon style={{color:  liked !== null && liked ? "blue" : "" }} />} 
              name="checkedC" />}
              label={likes}
              disabled={currentUser == null}
              className="interactions__thumbsUp"
              color="primary"
              style={{ color:  liked !== null && liked ? "blue" : "" }}
              onClick={like}
            />

            <FormControlLabel
              control={<Checkbox icon={<ThumbDownAltOutlinedIcon style={{color:  disliked ? "red" : "" }} />} 
              checkedIcon={<ThumbDownIcon style={{color: disliked ? "red" : "" }} />} 
              name="checkedC" />}
              label={dislikes}
              disabled={currentUser == null}
              className="interactions__thumbsDown"
              color={"secondary"}
              style={{ color: disliked ? "red" : "" }}
              onClick={dislike}
            />
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
