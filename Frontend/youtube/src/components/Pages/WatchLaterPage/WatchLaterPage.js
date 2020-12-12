import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoRow from '../../VideoRow/VideoRow';

import './WatchLaterPage.css';

function WatchLaterPage() {
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [videos, setVideos] = useState([]);
  const query = (currentUser != null)? `?userId=${currentUser.id}&userSecret=${currentUser.secret}` : "";
  
  useEffect(() => {
    fetch(`https://youtube278.azurewebsites.net/api/identity/watch-later${query}`)
    .then(response => response.json())
    .then(result => setVideos(result))
    .catch(error => console.log('error', error));
  }, []);

  if (currentUser == null) {
    return (
      <h3>You are not logged in.</h3>
    )
  }
  
  return (
    <div className="watchLater">
      <div className="watchLater__latest">
        <h2>Latest Video</h2>
        <Link className="watchLater-thumbnail" to={`/video/${videos[videos.length - 1]?.id}`}>
          <img src={`https://youtube278.azurewebsites.net/api/video/image-stream/${videos[videos.length - 1]?.id}`} />
          <hr />
          <h3>{videos[videos.length - 1]?.author?.name}</h3>
          <p>{videos[videos.length - 1]?.title}</p>
        </Link>
      </div>
      <div className="watchLater__videos">
        {videos.map(video => 
          <Link to={`/video/${video.id}`}>
            <VideoRow
              views={video.views.length}
              description={video.description?.substring(0, 20)}
              timestamp={video.uploadDate.split('T')[0]}
              channel={video.author?.name}
              title={video.title}
              isShown={true}
              image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
            />
          </Link>
        )}
      </div>
    </div>
  );
}

export default WatchLaterPage;
