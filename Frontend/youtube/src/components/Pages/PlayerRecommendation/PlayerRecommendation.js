import React, { useEffect, useState } from 'react';
import VideoRow from '../../VideoRow/VideoRow';
import { Link } from 'react-router-dom';

import './PlayerRecommendation.css';

function PlayerRecommendation({channelId}) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    if (channelId != undefined) {
      fetch(`https://youtube278.azurewebsites.net/api/video/recommendation?channelId=${channelId}`, requestOptions)
        .then(response => response.json())
        .then(result => setVideos(result))
        .catch(error => console.log('error', error));
    }
  }, [channelId]);

  return (
    <div className="playerRecommendation">
      {videos?.map((video) => {
          return (
            <Link to={`/video/${video.id}`}>
              <VideoRow
                title={video.title}
                views={video.views.length}
                description={video.description}
                timestamp={video.uploadDate.split('T')[0]}
                channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author.id}`}
                channel={video.author.name}
                image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
                isShown={0}
              />
            </Link>
          );
        })}
    </div>
  );
}

export default PlayerRecommendation;
