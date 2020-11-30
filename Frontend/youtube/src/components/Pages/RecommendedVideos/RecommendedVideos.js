import React from 'react';
import './RecommendedVideos.css';
import VideoCard from '../../VideoCard/VideoCard';

import videos from '../../../assets/recommendedVideos.json';

function RecommendedVideos() {
  console.log(videos);
  return (
    <div className="recommendedVideos">
      <h2>Latest</h2>
      <div className="recommendedVideos__videos">
        {videos.map((video) => {
          return (
            <VideoCard
              title={video.title}
              views={video.views}
              timestamp={video.timestamp}
              channelImg={video.channelImg}
              channel={video.channel}
              image={video.image}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RecommendedVideos;
