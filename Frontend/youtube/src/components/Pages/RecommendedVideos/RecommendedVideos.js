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

  return (
    <div className="recommendedVideos">
      <h2>Latest</h2>
      <div className="recommendedVideos__videos">
        {videos.map((video) => {
          return (
            <VideoCard
              title={video.title}
              views={video.views.length}
              timestamp=""
              channelImg={video.author.imageUrl}
              channel=""
              image={video.thumbnailUrl}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RecommendedVideos;
