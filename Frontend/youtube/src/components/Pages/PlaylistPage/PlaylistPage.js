import React, { useState, useEffect } from 'react';

import './PlaylistPage.css';
import PlaylistCard from '../../PlaylistCard/PlaylistCard';
import { Link } from 'react-router-dom';

function PlaylistPage() {
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [myPlaylists, setMyPlaylists] = useState([]);

  useEffect(() => {
    fetch(`https://youtube278.azurewebsites.net/api/playlist/channel/${currentUser?.channel?.id}`)
    .then(d => d.json())
    .then(d => {
        setMyPlaylists(d);
    })
    .catch((error) => console.log(error));
  }, [currentUser])

  if (currentUser == null) {
    return (
      <div>
        <h2>Playlists</h2>
        <h2>You are not logged in</h2>
      </div>
    )
  }    

  return (
    <div className="playlist">
      <h2>Playlist</h2>
      <div className="playlist__videos">
        {myPlaylists.map(p =>
          <Link to={`/video/${p.videos[p.videos.length-1]?.id}/${p.id}`}>
            <PlaylistCard
              thumbnail={ `https://youtube278.azurewebsites.net/api/video/image-stream/${p.videos[0]?.id}`}
              numOfVideos={p.videos?.length}
              title={p.name}
            />
          </Link>
        )}
      </div>
    </div>
  );
}

export default PlaylistPage;
