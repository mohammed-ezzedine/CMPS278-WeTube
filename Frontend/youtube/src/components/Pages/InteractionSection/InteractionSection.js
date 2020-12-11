import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import ShareIcon from "@material-ui/icons/Share";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import ReportIcon from "@material-ui/icons/Report";
import CommentList from "../CommentList/CommentList";
import SnackBar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import Avatar from '@material-ui/core/Avatar';

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import "./InteractionSection.css";
import { Button } from "@material-ui/core";
import { post } from "axios";

function InteractionSection({ views, channelName, video }) {
  const [selectedThumb, setSelectedThumb] = useState(null);
  const [open, setOpen] = useState(false);
  const [transition, setTransition] = useState(undefined);
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [likes, setLikes] = useState(null)
  const [dislikes, setDislikes] = useState(null)
  const [subscribed, setSubscribed] = useState(null)
  const [liked, setLiked] = useState(null)
  const [disliked, setDisliked] = useState(null)

  useEffect(() => {
    if (video && video.reactions) {
      setLikes(video.reactions.filter(reaction => !!reaction.like).length)
      setDislikes(video.reactions.filter(reaction => !reaction.like).length)
      setSubscribed((currentUser.subscriptions.filter(channel => channel.id === video.author.id).length > 0))
      setLiked(video.reactions.filter(reaction => reaction.user.id === currentUser.id && reaction.like))
      setDisliked(video.reactions.filter(reaction => reaction.user.id === currentUser.id && !reaction.like))
    }
  }, [video])
  const [inputComment, setInputComment] = useState("");
  // const [likes, setLikes] = useState(video.reactions.filter(reaction => !!reaction.like).length)
  // const [dislikes, setDislikes] = useState(video.reactions.filter(reaction => !reaction.like).length)
  // const [subscribed, setSubscribed] = useState(currentUser.subscriptions.filter(channel => channel.id === video.author.id))

  const handleCommentChange = (e) => {
    setInputComment(e.target.value);
  }

  function sendComment() {
    if(inputComment == "" || currentUser == null) {
      return;
    }

    fetch(`https://youtube278.azurewebsites.net/api/comment`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret,
        videoId: video.id,
        message: inputComment
      }),
    })
    .then(d => d.json())
    .then(d => {
      video.comments.push(d);
      setInputComment("");
    })
    .catch((error) => console.log(error));
  }

  const addCommentSection = (currentUser == null)? "" :
    <div className="add-comment">
      <textarea 
      rows="1" 
      placeholder="Add a comment..."
      onChange={(e) => handleCommentChange(e)} />
      <div className="submit-wrapper">
        <Button 
          variant="contained"
          onClick={() => sendComment()}
        >Send Comment</Button>
      </div>
    </div>

  //Liking/Disliking/Subscribing methods
  function LikeVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/video/like/${video.id}`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret,
      }),
    })
    .then((response) => {
      if (response.ok && response.status === 200) {
        setLikes(likes +1)
        if(disliked) {
          setDisliked(false)
          setDislikes(dislikes -1)
            
        }
          setLiked(true)
          setLikes(likes +1)
          
      }
      }
    )
    .catch((error) => console.log(error));
  }

  function DislikeVideo() {
    fetch(
      `https://youtube278.azurewebsites.net/api/video/undolike/${video.id}`,
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          mode: "no-cors",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userSecret: currentUser.secret,
        }),
      }
    ).then((response) => {
      if (response.ok && response.status === 200) {
        if(liked) {
          setLiked(false)
          setLikes(likes -1)
            
        }
          setDisliked(true)
          setDislikes(dislikes +1)
          
      }
    }
    )
    .catch((error) => console.log(error));
  }
  const SubscribeChannel = async () => {
    try {
      let response = await post(
        `https://youtube278.azurewebsites.net/api/channel/subscribe`,
        {
          UserId: currentUser.id,
          UserSecret: currentUser.secret,
          ChannelId: video.author.id,
        }
      );
    } catch (error) {
      
    }
  };

  function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

  const handleClick = (thumb, Transition) => {
    setTransition(() => Transition);
    if (thumb === "thumbsUp") {
      LikeVideo();
      setSelectedThumb("Video Liked");

    } else if (thumb === "thumbsDown") {
      DislikeVideo();
      setSelectedThumb("Video Disliked"); 

      
    } else if (thumb === "subscribe") {
      SubscribeChannel();
      setSelectedThumb(`Subscribed To ${video.author.name}`);

    }
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="interactions">
      <SnackBar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={selectedThumb}
        TransitionComponent={transition}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <div className="interactions__info">
        <div className="interactions__mainInteractionSection">
          <div className="interactions__title">
            <h4>{video.title}</h4>
            <p>
              {views} views • {video?.uploadDate?.split("T")[0]}
            </p>
          </div>
          <div className="interactions__interactiveSection">
            <Button
              className="interactions__subscribe"
              size="small"
              variant="contained"
              onClick={() => {
                subscribed ? handleClick("unsubscribe", TransitionUp)   : handleClick("subscribe", TransitionUp)
              }}
            >
              {subscribed ? "Subscribed" :"Subscribe"}
            </Button>
            <span className="reaction-counter">{likes}</span>
            <ThumbUpIcon
              className="interactions__thumbsUp"
              color={liked ? "primary" : "inherit"}
              onClick={() => {handleClick("thumbsUp", TransitionUp)}}
            />
            <span className="reaction-counter">{dislikes}</span>
            <ThumbDownAltIcon
              className="interactions__thumbsDown"
              color={disliked ? "secondary" : "inherit"}
              onClick={() => handleClick("thumbsDown", TransitionUp)}
            />
            <ShareIcon />
            <PlaylistAddIcon />
            <ReportIcon />
          </div>
        </div>
        <div className="channel-info">
          <Avatar className="channel-card" alt={video?.author?.name} src={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video?.author?.id}`} />
          <h4 className="channel-name">{video?.author?.name}</h4>
        </div>
        <div className="video-descr">{video.description}</div> 

        <div className="interactions__commentSection">
          <div className="interactions__commentSection">
            {addCommentSection}
            <CommentList comments={video.comments}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractionSection;
