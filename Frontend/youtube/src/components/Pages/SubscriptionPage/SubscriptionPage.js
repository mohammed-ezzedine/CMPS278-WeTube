import React, { useEffect, useState } from 'react';
import VideoCard from '../../VideoCard/VideoCard';

import './SubscriptionPage.css';

function SubscriptionPage() {
  const [content, setContent] = useState(null);
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));

  useEffect(() => {
    let userId = currentUser?.id;
    let userSecret = currentUser?.secret;

    var raw = JSON.stringify({ UserId: userId, UserSecret: userSecret });

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://youtube278.azurewebsites.net/api/video/from-subscriptions',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setContent(result))
      .catch((error) => console.log('error', error));
  }, []);

  return (
    <div className="subscriptions">
      <h2>Subscriptions</h2>
      <div className="subscriptions__videos">
        {content?.videos?.map((video) => {
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

export default SubscriptionPage;
