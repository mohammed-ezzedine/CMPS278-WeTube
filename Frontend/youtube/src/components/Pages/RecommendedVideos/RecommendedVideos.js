import React, { useEffect, useState } from 'react';
import './RecommendedVideos.css';
import VideoCard from '../../VideoCard/VideoCard';

function RecommendedVideos() {
  const [videos, setvideos] = useState([]);

  useEffect(() => {
    fetch('https://youtube278.azurewebsites.net/api/video/recommendation', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setvideos(d);
      });
  }, []);

  console.log(videos);

  return (
    <div className="recommendedVideos">
      <h2>Latest</h2>
      <div className="recommendedVideos__videos">
        {videos.map((video) => {
          return (
            <VideoCard
              title={video.title}
              views={video.views.length}
              timestamp={video.uploadDate}
              channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author.id}`}
              channel={video.author.name}
              image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
              path={video.id}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RecommendedVideos;
