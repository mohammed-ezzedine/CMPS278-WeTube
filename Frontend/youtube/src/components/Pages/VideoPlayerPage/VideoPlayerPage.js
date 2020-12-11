import React, { useEffect, useState } from 'react';
import PlayerRecommendation from '../PlayerRecommendation/PlayerRecommendation';
import InteractionSection from '../InteractionSection/InteractionSection';

import './VideoPlayer.css';
import { useParams } from 'react-router-dom';

function VideoPlayerPage() {
  const [video, setVideo] = useState({});
  const [views, setViews] = useState(0);
  const [channelName, setChannelName] = useState('');
  let { id, playlistId } = useParams();
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));
  const query = (currentUser == null)? "" : `?userId=${currentUser.id}&userSecret=${currentUser.secret}`;

  const recommendationLink = (playlistId != null) ?
  `https://youtube278.azurewebsites.net/api/playlist/${playlistId}` :
  (video?.author?.id != undefined && video?.author?.id != null)?
  `https://youtube278.azurewebsites.net/api/video/recommendation?channelId=${video?.author?.id}` : "";

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
  }, [id]);

  return (
    <div className="videoPlayer">
      <div className="videoPlayer__body">
        <div className="videoPlayer__player">
          <video
            src={`https://youtube278.azurewebsites.net/api/video/stream/${id}${query}`}
            autoPlay
            controls
          ></video>
        </div>
        <div className="videoPlayer__interactions">
          <InteractionSection views={views} channelName={channelName} video={video} />
        </div>
      </div>
      <div className="videoPlayer__playerRecommendations">
        <PlayerRecommendation recommendationLink={recommendationLink}/>
      </div>
    </div>
  );
}

export default VideoPlayerPage;
