import React from 'react';
import { Link } from 'react-router-dom';
import './VideoRow.css';

function VideoRow({
  views,
  description,
  timestamp,
  channel,
  title,
  videoId,
  image,
  isShown,
}) {
  return (
    <Link to={`/video/${videoId}`}>
    <div className="videoRow">
      <img src={image} alt="" />
      <div className="videoRow__text">
        <h3 className="videoRow__videoTitle">{title}</h3>
       <Link to={`/channel/${channel.id}`}>
        <p className="videoRow__headline">
            {channel.name} • {views} views • {timestamp}
          </p>
       </Link>
        <p
          className="videoRow__description"
          style={{
            display: isShown ? 'block' : 'none',
          }}
        >
          {description}
        </p>
      </div>
    </div>
    </Link>
  );
}

export default VideoRow;
