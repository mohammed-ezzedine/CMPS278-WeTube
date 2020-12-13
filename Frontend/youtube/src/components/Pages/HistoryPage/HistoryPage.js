import React, { useEffect, useState } from 'react';
import VideoRow from '../../VideoRow/VideoRow';
import {Helmet} from "react-helmet";

import './HistoryPage.css';

function HistoryPage() {
  const [videos, setVideos] = useState([]);
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));

  useEffect(() => {
    if (currentUser != null) {
      fetch(`https://youtube278.azurewebsites.net/api/Identity/history?userId=${currentUser?.id}&userSecret=${currentUser?.secret}`)
        .then(response => response.json())
        .then(result => setVideos(result))
        .catch(error => console.log('error', error));
    }
  }, []);

  if (currentUser != null) {
    return (
      <div className="history">
        <Helmet>
            <meta charSet="utf-8" />
            <title>WeTube - History</title>
            <link rel="canonical" href="http://example.com" />
        </Helmet>
        <h2>History</h2>
        <div className="history__videos">
          {videos.map((video) => {
            return (
              <VideoRow
                key={video.id}
                path={video.id}
                channel={video.author}
                title={video.title}
                views={video.viewsCount}
                timestamp={
                  video.uploadDate.split('T')[0] +
                  ' | ' +
                  video.uploadDate.split('T')[1].split('.')[0]
                }
                channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author.id}`}
                image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h2>History</h2>
        <h2>You are not logged in</h2>
      </div>
    )
  }
}

export default HistoryPage;
