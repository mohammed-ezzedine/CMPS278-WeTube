import React, { useEffect, useState } from 'react';
import PlayerRecommendation from '../PlayerRecommendation/PlayerRecommendation';
import InteractionSection from '../InteractionSection/InteractionSection';

import './VideoPlayer.css';
import { useParams } from 'react-router-dom';

function VideoPlayerPage({ match }) {
  const [video, setVideo] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    setVideo(id);
  }, []);

  return (
    <div className="videoPlayer">
      <div className="videoPlayer__body">
        <div className="videoPlayer__player">
          <video
            src={`https://youtube278.azurewebsites.net/api/video/stream/${id}`}
            autoPlay
            controls
          ></video>
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
