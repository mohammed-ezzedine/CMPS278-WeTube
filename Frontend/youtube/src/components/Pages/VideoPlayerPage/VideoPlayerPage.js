import React, { useEffect, useState } from 'react';
import PlayerRecommendation from '../PlayerRecommendation/PlayerRecommendation';
import InteractionSection from '../InteractionSection/InteractionSection';

import './VideoPlayer.css';
import { useParams } from 'react-router-dom';

function VideoPlayerPage() {
  const [video, setVideo] = useState({});
  const [views, setViews] = useState(0);
  const [channelName, setChannelName] = useState('');
  let { id } = useParams();
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));

  const loadVideoData = async () => {
    const response = await fetch(
      `https://youtube278.azurewebsites.net/api/Video/${id}`);
    const responseJSON = await response.json();
    setVideo(responseJSON);
    setViews(responseJSON.views.length);
    setChannelName(responseJSON.author.name);
  };

  useEffect(() => {
    loadVideoData();
  }, []);

  return (
    <div className="videoPlayer">
      <div className="videoPlayer__body">
        <div className="videoPlayer__player">
          <video
            src={`https://youtube278.azurewebsites.net/api/video/stream/${id}?userId=${currentUser.id}&userSecret=${currentUser.secret}`}
            autoPlay
            controls
          ></video>
        </div>
        <div className="videoPlayer__interactions">
          <InteractionSection views={views} channelName={channelName} />
        </div>
      </div>
      <div className="videoPlayer__playerRecommendations">
        <PlayerRecommendation />
      </div>
    </div>
  );
}

export default VideoPlayerPage;
