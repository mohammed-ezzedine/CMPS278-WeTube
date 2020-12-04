import React from 'react';
import './SearchPage.css';
import VideoRow from '../../VideoRow/VideoRow';

import TuneOutlinedIcon from '@material-ui/icons/TuneOutlined';
import videos from '../../../assets/recommendedVideos.json';

function SearchPage() {
  return (
    <div className="searchPage">
      <div className="searchPage__filter">
        <TuneOutlinedIcon />
        <h2>FILTER</h2>
      </div>
      <hr />
      {/* 
        Dummy Data for testing
        Keep there until we start handling real data
       */}

      {videos.map((video) => {
        return (
          <VideoRow
            views={video.views}
            description={video.description}
            timestamp={video.timestamp}
            channel={video.channel}
            title={video.title}
            image={video.image}
          />
        );
      })}
    </div>
  );
}

export default SearchPage;
