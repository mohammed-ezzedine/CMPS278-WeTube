import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ShareIcon from "@material-ui/icons/Share";
import CommentList from "../CommentList/CommentList";
import SnackBar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import Avatar from '@material-ui/core/Avatar';

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import "./InteractionSection.css";
import AddToPlaylist from '../AddToPlaylist/AddToPlaylist';
import ReportVideo from '../ReportVideo/ReportVideo';
import { Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { get, post } from "axios";
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom";

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
    if (video.author && video.reactions) {
      setLikes(video.reactions?.filter(reaction => !!reaction.like)?.length)
      setDislikes(video.reactions?.filter(reaction => !reaction.like)?.length)
      setSubscribed((currentUser?.subscriptions?.filter(channel => channel.id === video.author.id)?.length > 0))
      setLiked((video.reactions?.filter(reaction => reaction.user.id === currentUser?.id && reaction.like)?.length >0))
      setDisliked((video.reactions?.filter(reaction => reaction.user.id === currentUser?.id && !reaction.like)?.length >0))
      
    }
  }, [video])
      
  const [inputComment, setInputComment] = useState("");
  // const [likes, setLikes] = useState(video.reactions.filter(reaction => !!reaction.like).length)
  // const [dislikes, setDislikes] = useState(video.reactions.filter(reaction => !reaction.like).length)
  // const [subscribed, setSubscribed] = useState(currentUser?.subscriptions.filter(channel => channel.id === video.author.id))

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
        userId: currentUser?.id,
        userSecret: currentUser?.secret,
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
      <TextField 
        className="comment-textarea"
        rows="1" 
        placeholder="Add a comment..."
        value={inputComment}
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
    if (!liked && currentUser != null) {
      fetch(`https://youtube278.azurewebsites.net/api/video/like/${video.id}`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser?.id,
        userSecret: currentUser?.secret,
      }),
    })
    .then((response) => {
      if (response.ok && response.status === 200) {
        return response.json()
      }
    })
    .then(video =>{

      setLiked(true)
      setLikes(likes + 1)
        if(disliked) {
          setDisliked(false)
          setDislikes(dislikes > 0 ? dislikes -1 : 0 )
            
        }
          
      
    })
    .catch((error) => console.log(error));
    }
    
  }

  function DislikeVideo() {
    if (!disliked && currentUser != null) {
      fetch(
        `https://youtube278.azurewebsites.net/api/video/dislike/${video.id}`,
        {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            mode: "no-cors",
          },
          body: JSON.stringify({
            userId: currentUser?.id,
            userSecret: currentUser?.secret,
          }),
        }
      ).then((response) => {
        if (response.ok && response.status === 200) {
          // console.log(response);
          return response.json()
        }
      }
      )
      .then((video) => {
        setDisliked(true)
        setDislikes(dislikes+ 1)
          if(liked) {
            setLiked(false)
            setLikes(likes >0 ? likes -1 : 0)
              
          }
            
      })
      .catch((error) => console.log(error));
    }
  }
  const SubscribeChannel = async () => {
    if (currentUser == null) {
      return;
    }

    try {
      console.log(video.author);
      let response = await post(
        `https://youtube278.azurewebsites.net/api/channel/subscribe`,
        {
          UserId: currentUser?.id,
          UserSecret: currentUser?.secret,
          ChannelId: video.author.id,
        }
      );
      setSubscribed(true);
        window.localStorage.setItem("CurrentUser", JSON.stringify(response.data));

    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      }
      
    }
  };
  const UnsubscribeChannel = async() => {
    try {
      let response = await post(
        `https://youtube278.azurewebsites.net/api/channel/unsubscribe`,
        {
          UserId: currentUser?.id,
          UserSecret: currentUser?.secret,
          ChannelId: video.author.id,
        }
      );
      setSubscribed(false);
      window.localStorage.setItem("CurrentUser", JSON.stringify(response.data));
    } catch (error) {
      console.error(error.response.data);
    }
  }
  
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
    else if (thumb === "unsubscribe") {
      let confirming = window.confirm("Are you sure you want to unsubscribe");
      console.log(confirming);
      if (!confirming) {
        return;
      }
        UnsubscribeChannel();
        setSelectedThumb(`Unsubscribed From ${video.author.name}`);
      
    }
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function copyVideoUrl() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setTransition(() => TransitionUp);
        setSelectedThumb("Video link is copied to your clipboard.");
        setOpen(true);
      })
  }

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
            { (currentUser == null || video.author.id === currentUser?.id) ? "" : (<Button
              className="interactions__subscribe"
              size="small"
              variant="contained"
              style={{backgroundColor: subscribed ? "lightgray": "#c00"}}
              onClick={() => {
                subscribed ? handleClick("unsubscribe", TransitionUp) : handleClick("subscribe", TransitionUp)
              }}
            >
              {subscribed ? "Subscribed" :"Subscribe"}
            </Button>
            )
}
            <FormControlLabel
              control={<Checkbox icon={<ThumbUpAltOutlinedIcon style={{color: liked !== null && liked ? "blue" : "" }}/>} 
              checkedIcon={<ThumbUpIcon style={{color: liked !== null && liked ? "blue" : "" }} />} 
              name="checkedH" />}
              label={likes}
              disabled={currentUser == null}
              className="interactions__thumbsUp"
              color="primary"
              style={{ color: liked !== null && liked ? "blue" : "" }}
              onClick={() => {handleClick("thumbsUp", TransitionUp)}}
            />
            <FormControlLabel
              control={<Checkbox icon={<ThumbDownAltOutlinedIcon style={{color: disliked !== null && disliked ? "red" : "" }} />} 
              checkedIcon={<ThumbDownIcon style={{color: disliked !== null && disliked ? "red" : "" }} />} 
              name="checkedH" />}
              label={dislikes}
              disabled={currentUser == null}
              className="interactions__thumbsDown"
              color={"secondary"}
              style={{ color: disliked !== null && disliked ? "red" : "" }}
              onClick={() => {handleClick("thumbsDown", TransitionUp)}}
            />
            <Button
              onClick={copyVideoUrl}>
              <ShareIcon />
            </Button>
            <AddToPlaylist videoId={video.id}/>
            <ReportVideo videoId={video.id}/>
          </div>
        </div>
        <div className="channel-info">
          <Link to={`/channel/${video?.author?.id}`}>
            <Avatar className="channel-card" alt={video?.author?.name} src={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video?.author?.id}`} />
          </Link>
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
