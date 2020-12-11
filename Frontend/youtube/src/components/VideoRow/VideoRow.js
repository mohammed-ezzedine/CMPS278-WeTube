import React from 'react';
import './VideoRow.css';

function VideoRow({
  views,
  description,
  timestamp,
  channel,
  title,
  image,
  isShown,
}) {
  return (
    <div className="videoRow">
      <img className="videom-thumbnail" src={image} alt="" />
      <div className="videoRow__text">
        <h3 className="videoRow__videoTitle">{title}</h3>
        <p className="videoRow__headline">
          {channel} • {views} views • {timestamp}
        </p>
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
  );
}

export default VideoRow;
