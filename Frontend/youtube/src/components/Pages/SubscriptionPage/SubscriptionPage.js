import React, { useEffect, useState } from 'react';
import VideoCard from '../../VideoCard/VideoCard';

import './SubscriptionPage.css';

function SubscriptionPage() {
  // const [subscribedChannels, setSubscribedChannels] = useState([]);

  // const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));

  // useEffect(async () => {
  //   const response = await fetch(
  //     'https://youtube278.azurewebsites.net/api/channel/subscriptions',
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-Origin': '*',
  //         mode: 'no-cors',
  //       },
  //       method: 'POST',
  //       body: JSON.stringify({
  //         UserId: currentUser.id,
  //         UserSecret: currentUser.secret,
  //       }),
  //     }
  //   );
  //   const listOfChannels = await response.json();
  //   // for (channel in listOfChannels) console.log(channel);
  //   setSubscribedChannels(listOfChannels);
  // }, []);

  return (
    <div className="subscriptions">
      <h2>Subscriptions</h2>
      <div className="subscriptions__videos">
        {/* <VideoCard
          title="CRAZIEST AND MOST DELUDED FEMINIST I HAVE EVER SEEN!"
          views="12K"
          timestamp="1 hour ago"
          channelImg="https://yt3.ggpht.com/a-/AOh14GhxwFqIBW-4SE9Xl-gwYpXZnymeEIsiyXudRQ=s68-c-k-c0x00ffffff-no-rj-mo"
          channel="Easy Swish Sniper"
          image="http://i3.ytimg.com/vi/lKicPe0guoo/maxresdefault.jpg"
        /> */}
      </div>
    </div>
  );
}

export default SubscriptionPage;
