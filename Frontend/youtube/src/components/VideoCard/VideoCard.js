import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import './VideoCard.css';
import { Link } from 'react-router-dom';
import { Button } from "@material-ui/core";

function VideoCard({
  image,
  title,
  channel,
  views,
  timestamp,
  channelImg,
  path,
  hidden = false,
  adminView = false,
  featured = false,
  channelId = -1
}) {
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [videoHidden, setVideoHidden] = useState(hidden);
  const [videoFetured, setVideoFetured] = useState(featured);

  function hideVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/video/hide/${path}`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret
      }),
    })
    .then(d => {
      if (d.ok) {
        setVideoHidden(true);
      }
    })
    .catch((error) => console.log(error));
  }

  function showVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/video/show/${path}`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret
      }),
    })
    .then(d => {
      if (d.ok) {
        setVideoHidden(false);
      }
    })
    .catch((error) => console.log(error));
  }

  function featureVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/channel/feature-video`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret,
        channelId: channelId,
        videoId: parseInt(path)
      }),
    })
    .then(d => {
      if (d.ok) {
        setVideoFetured(true);
      }
    })
    .catch((error) => console.log(error));
  }

  const link = (videoHidden)?
    <img className="videoCard__thumbnail" src={image} alt="" /> :
    <Link to={`/video/${path}`}>
      <img className="videoCard__thumbnail" src={image} alt="" />
    </Link>

  const toggleVisibilityBtn = (adminView)?
    (videoHidden)?
      <Button onClick={() => showVideo()}>Show</Button> :
      <Button onClick={() => hideVideo()}>Hide</Button>
    : "";

  const toggleFeatureBtn = (adminView & !videoHidden)?
    (!videoFetured)?
      <Button onClick={() => featureVideo()}>Feature</Button>
      : ""
    : "";

  return (
    <div className="videoCard">
      {link}
      <div className="videoCard__info">
        <Avatar className="videoCard__avatar" alt={channel} src={channelImg} />
        <div className="videoCard__text">
          <h4>{title}</h4>
          <p>{channel}</p>
          <p>
            {views} Views • {timestamp?.split('T')[0]}
          </p>
          {toggleVisibilityBtn}
          {toggleFeatureBtn}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
