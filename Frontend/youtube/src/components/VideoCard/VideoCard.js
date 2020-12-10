import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import './VideoCard.css';
import { Link } from 'react-router-dom';

function VideoCard({
  image,
  title,
  channel,
  views,
  timestamp,
  channelImg,
  path,
}) {
  return (
    <div className="videoCard">
      <Link to={`/video/${path}`}>
        <img className="videoCard__thumbnail" src={image} alt="" />
      </Link>
      <div className="videoCard__info">
        <Avatar className="videoCard__avatar" alt={channel} src={channelImg} />
        <div className="videoCard__text">
          <h4>{title}</h4>
          <p>{channel}</p>
          <p>
            {views} Views • {timestamp?.split('T')[0]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
