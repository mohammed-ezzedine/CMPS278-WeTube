import React, { useEffect, useState } from 'react';
import './RecommendedVideos.css';
import VideoCard from '../../VideoCard/VideoCard';
import {Helmet} from "react-helmet";

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
      <Helmet>
          <meta charSet="utf-8" />
          <title>WeTube - Home</title>
          <link rel="canonical" href="http://example.com" />
      </Helmet>
      <h2>Latest</h2>
      <div className="recommendedVideos__videos">
        {videos.map((video) => {
          return (
            <VideoCard
              key={video.id}
              title={video.title}
              views={video.views.length}
              timestamp={video.uploadDate}
              channelId={video.author.id}
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
