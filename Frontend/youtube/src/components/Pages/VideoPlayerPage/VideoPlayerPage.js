import { render } from '@testing-library/react';
import React from 'react';
import ReactPlayer from 'react-player/file';
import PlayerRecommendation from '../PlayerRecommendation/PlayerRecommendation';
import InteractionSection from '../InteractionSection/InteractionSection';

import './VideoPlayer.css';

function VideoPlayerPage() {
  return (
    <div className="videoPlayer">
      <div className="videoPlayer__body">
        <div className="videoPlayer__player">
          <ReactPlayer url="testVideo.mp4" controls="true" />
        </div>
        <div className="videoPlayer__interactions">
          <InteractionSection />
        </div>
      </div>
      <div className="videoPlayer__playerRecommendations">
        <PlayerRecommendation />
      </div>
    </div>
  );
}

export default VideoPlayerPage;
