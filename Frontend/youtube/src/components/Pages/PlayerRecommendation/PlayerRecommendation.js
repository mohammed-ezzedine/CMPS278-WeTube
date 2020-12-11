import React, { useEffect, useState } from 'react';
import VideoRow from '../../VideoRow/VideoRow';

import './PlayerRecommendation.css';

function PlayerRecommendation({channelId}) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    if (channelId !== undefined) {
      fetch(`https://youtube278.azurewebsites.net/api/video/recommendation?channelId=${channelId}`, requestOptions)
        .then(response => response.json())
        .then(result => setVideos(result))
        .catch(error => console.log('error', error));
    }
  }, [channelId]);

  console.log(videos);
  return (
    <div className="playerRecommendation">
      {videos?.map((video) => {
          return (
            <VideoRow
              title={video.title}
              videoId={video.id}
              views={video.views.length}
              description={video.description}
              timestamp={video.uploadDate.split('T')[0]}
              channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author.id}`}
              channel={video.author}
              image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
              isShown={0}
            />
          );
        })}
    </div>
  );
}

export default PlayerRecommendation;
