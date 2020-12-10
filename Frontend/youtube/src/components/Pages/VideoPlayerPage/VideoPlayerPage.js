import React from 'react';
import PlayerRecommendation from '../PlayerRecommendation/PlayerRecommendation';
import InteractionSection from '../InteractionSection/InteractionSection';

import './VideoPlayer.css';

function VideoPlayerPage() {
  return (
    <div className="videoPlayer">
      <div className="videoPlayer__body">
        <div className="videoPlayer__player">
          <video src="testVideo.mp4" autoPlay controls></video>
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
