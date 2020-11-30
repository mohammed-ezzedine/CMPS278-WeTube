import React from 'react';
import VideoRow from '../../VideoRow/VideoRow';

import './HistoryPage.css';

import videos from '../../../assets/recommendedVideos.json';

function HistoryPage() {
  return (
    <div className="history">
      <h2>History</h2>
      <div className="history__videos">
        {videos.map((video) => {
          return (
            <VideoRow
              title={video.title}
              views={video.views}
              timestamp={video.timestamp}
              channel={video.channel}
              image={video.image}
              description={video.description}
            />
          );
        })}
        {/* <VideoRow
          views="32M"
          description="In this video I discuss why I have no interested in machine learning. ---- If you like cooking, checkout my side project: ..."
          timestamp="1 year ago"
          channel="Ben Awad"
          title="Why I don't like Machine Learning"
          image="http://i3.ytimg.com/vi/HnKaaDcWOXw/maxresdefault.jpg"
        /> */}
      </div>
    </div>
  );
}

export default HistoryPage;
