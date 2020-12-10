import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import './VideoCard.css';

function VideoCard({ image, title, channel, views, timestamp, channelImg }) {
  return (
    <div className="videoCard">
      <img className="videoCard__thumbnail" src={image} alt="" />
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
