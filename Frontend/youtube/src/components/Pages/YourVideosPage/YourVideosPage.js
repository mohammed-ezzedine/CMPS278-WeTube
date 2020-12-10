import React, { useEffect, useState } from 'react';
import VideoCard from '../../VideoCard/VideoCard';

import './YourVideosPage.css';

function YourVideosPage() {
  const [videos, setVideos] = useState([]);
  const [hiddenVideos, setHiddenVideos] = useState([]);
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));

  useEffect(() => {
    fetch(`https://youtube278.azurewebsites.net/api/video/channel/${currentUser.channel.id}`)
      .then(response => response.json())
      .then(result => setVideos(result))
      .catch(error => console.log('error', error));

    var raw = JSON.stringify({"userId":currentUser?.id,"userSecret":currentUser?.secret});
    fetch(`https://youtube278.azurewebsites.net/api/channel/hidden?id=${currentUser.channel.id}`,
    {
      "method": 'POST',
      headers: {
        "content-type": 'application/json',
      },
      body: raw
    })
      .then(response => response.json())
      .then(result => setHiddenVideos(result))
      .catch(error => console.log('error', error));
  }, [currentUser.id]);

  return (
    <div className="yourVideos">
      <h2>Your Videos</h2>
      <div className="yourVideos__videos">
        {videos.map((video) => {
            return (
              <VideoCard
                title={video.title}
                views={video.views?.length}
                path={`/video/${video.id}`}
                timestamp={video.uploadDate.split('T')[0] + " | " + video.uploadDate.split('T')[1].split('.')[0]}
                channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author.id}`}
                channel={video.author.name}
                image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
              />
            );
          })}
      </div>

      <h2>Hidden Videos</h2>
      <div className="yourVideos__videos">
        {hiddenVideos.map((video) => {
            return (
              <VideoCard
                title={video.title}
                views={video.views?.length}
                path={`/video/${video.id}`}
                timestamp={video.uploadDate.split('T')[0] + " | " + video.uploadDate.split('T')[1].split('.')[0]}
                channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author?.id}`}
                channel={video.author?.name}
                image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
              />
            );
          })}
      </div>
    </div>
  );
}

export default YourVideosPage;
