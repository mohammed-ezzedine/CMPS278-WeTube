import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import './PlaylistCard.css';

function PlaylistCard({ thumbnail, title, channel, channelImg, numOfVideos }) {
  return (
    <div className="playlistCard">
      <div className="playlistCard__thumbnailContainer">
        <div className="playlistCard__playOverlay">
          <PlayArrowIcon className="playlistCard__Icons" />
          <p>Play All</p>
        </div>
        <div className="playlistCard__overlay">
          <p>{numOfVideos}</p>
          <PlaylistPlayIcon className="playlistCard__Icons" />
        </div>
        <img src={thumbnail} className="playlistCard__thumbnail" />
      </div>
      <div className="playlistCard__info">
        <div className="playlistCard__text">
          <h4>{title}</h4>
          <p>{channel}</p>
        </div>
      </div>
    </div>
  );
}

export default PlaylistCard;
