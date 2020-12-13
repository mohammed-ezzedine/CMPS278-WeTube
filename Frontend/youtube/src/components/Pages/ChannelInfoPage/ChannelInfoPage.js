import React from 'react';
import VideoCard from '../../VideoCard/VideoCard';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Avatar from '@material-ui/core/Avatar';

import './ChannelInfoPage.css';
import { Button } from '@material-ui/core';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PlaylistCard from '../../PlaylistCard/PlaylistCard';
import { get, post } from "axios";

function ChannelInfoPage() {
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [channel, setChannel] = useState({});
  const [subscribed, setSubscribed] = useState(false)
  let { id } = useParams();

  useEffect(() => {
    fetch(`https://youtube278.azurewebsites.net/api/channel/${id}`)
      .then(r => r.json())
      .then(d => {
        setChannel(d);
        setSubscribed(d?.subscribers?.filter(s => s.id == currentUser?.channel?.id)?.length > 0);
      })
  }, [id])

  
  const SubscribeChannel = async () => {
    try {
      let response = await post(
        `https://youtube278.azurewebsites.net/api/channel/subscribe`,
        {
          UserId: currentUser.id,
          UserSecret: currentUser.secret,
          ChannelId: channel.id,
        }
      );
      setSubscribed(true);
        window.localStorage.setItem("CurrentUser", JSON.stringify(response.data));

    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      }
      
    }
  };

  const UnsubscribeChannel = async() => {
    try {
      let response = await post(
        `https://youtube278.azurewebsites.net/api/channel/unsubscribe`,
        {
          UserId: currentUser.id,
          UserSecret: currentUser.secret,
          ChannelId: channel.id,
        }
      );
      setSubscribed(false);
      window.localStorage.setItem("CurrentUser", JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  }

  const subscribeBtn = (channel.id == currentUser.channel.id)? "" :
    (subscribed)?
      <Button
        variant="contained"
        onClick={UnsubscribeChannel}
        style={{ backgroundColor: '#c00', color: 'white' }}
      >
        Unsubscribe
      </Button> :
      <Button
        onClick={SubscribeChannel}
        variant="contained"
        style={{ backgroundColor: '#c00', color: 'white' }}
    >
      Subscribe
    </Button>

  return (
    <div className="channelInfo">
      <div className="channelInfo__interactive">
        <Avatar 
          className="channelInfo__userAvatar" 
          src={`https://youtube278.azurewebsites.net/api/channel/image-stream/${channel.id}`}
        />
        <div className="channelInfo__interactiveInfo">
          <div className="channelInfo__interactiveInfoLeft">
            <h4>{channel.name}</h4>
            <h2>{channel.description}</h2>
            <p>{channel.subscribers?.length} subscribers</p>
          </div>
          <div className="channelInfo__interactiveInfoRight">
              {currentUser.channel.id === channel.id ? (
                  <Button color="primary" variant="contained" href={`/channel/stats`} >
                        Channel Info
                  </Button>
              ) :subscribeBtn }
            
          </div>
        </div>
      </div>
      <div className="channelInfo__featured">
        <h2>Featured</h2>
        <hr style={{ margin: '5px 0' }} />
        <div className="channelInfo__featuredContainer">
          <ScrollMenu
            key="featuredvideos"
            arrowLeft={<div style={{ fontSize: '30px' }}>{' < '}</div>}
            arrowRight={<div style={{ fontSize: '30px' }}>{' > '}</div>}
            data={channel?.videos?.filter(v=>v.featured)?.map(v => 
              <VideoCard
                key={`featuredvideos-${v.id}`}
                title={v?.title}
                views={v?.views?.length}
                timestamp={v?.uploadDate}
                channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${v?.author?.id}`}
                channel={v?.author?.name}
                image={`https://youtube278.azurewebsites.net/api/video/image-stream/${v?.id}`}
              />
            )}
          />
        </div>
      </div>
      <div className="channelInfo__playlists">
        <h2>Playlists</h2>

        <hr style={{ margin: '5px 0' }} />

        <div className="channelInfo__playlistsContainer">
          <ScrollMenu
            key="playlists"
            arrowLeft={<div style={{ fontSize: '30px' }}>{' < '}</div>}
            arrowRight={<div style={{ fontSize: '30px' }}>{' > '}</div>}
            data={channel?.playlists?.map(p =>
              <Link to={`/video/${p.videos[p.videos.length-1]?.id}/${p?.id}`}>
                <PlaylistCard
                  key={`playlist-${p.id}`}
                  thumbnail={ `https://youtube278.azurewebsites.net/api/video/image-stream/${p.videos[0]?.id}`}
                  numOfVideos={p.videos?.length}
                  title={p?.name}
                />
              </Link>
            )}
          />
        </div>
      </div>
      <div className="channelInfo__videos">
        <h2>All Videos</h2>
        <hr style={{ margin: '5px 0' }} />

        <div className="channelInfo__videosContainer">
          <ScrollMenu
            key="videos"
            arrowLeft={<div style={{ fontSize: '30px' }}>{' < '}</div>}
            arrowRight={<div style={{ fontSize: '30px' }}>{' > '}</div>}
            data={channel?.videos?.map(v => 
              <VideoCard
                key={`videos-${v.id}`}
                title={v?.title}
                views={v?.views?.length}
                timestamp={v?.uploadDate}
                channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${v?.author?.id}`}
                channel={v?.author?.name}
                image={`https://youtube278.azurewebsites.net/api/video/image-stream/${v?.id}`}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default ChannelInfoPage;
