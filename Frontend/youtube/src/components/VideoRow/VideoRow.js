import React from 'react';
import { Link } from 'react-router-dom';
import './VideoRow.css';

function VideoRow({
  views,
  description,
  timestamp,
  channel,
  title,
  path,
  image,
  isShown,
}) {
  return (
    <Link to={`/video/${path}`}>
      <div className="videoRow">
        <img className="videom-thumbnail" src={image} alt="" />
        <div className="videoRow__text">
          <h3 className="videoRow__videoTitle">{title}</h3>
          <Link to={`/channel/${channel?.id}`}>
            <p className="videoRow__headline">
              {channel?.name} • {views} views • {timestamp.split('T')[0]}
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
