import React from 'react';
import VideoCard from '../../VideoCard/VideoCard';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Avatar from '@material-ui/core/Avatar';

import './ChannelInfoPage.css';
import { Button } from '@material-ui/core';

function ChannelInfoPage() {
  return (
    <div className="channelInfo">
      <div className="channelInfo__interactive">
        <Avatar className="channelInfo__userAvatar" />
        <div className="channelInfo__interactiveInfo">
          <div className="channelInfo__interactiveInfoLeft">
            <h4>Test</h4>
            <p>317k subscribers</p>
          </div>
          <div className="channelInfo__interactiveInfoRight">
            <Button
              variant="contained"
              style={{ backgroundColor: '#c00', color: 'white' }}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className="channelInfo__featured">
        <h2>Featured</h2>
        <hr style={{ margin: '5px 0' }} />
        <div className="channelInfo__featuredContainer">
          {/* <ScrollMenu></ScrollMenu> */}
          <ScrollMenu
            arrowLeft={<div style={{ fontSize: '30px' }}>{' < '}</div>}
            arrowRight={<div style={{ fontSize: '30px' }}>{' > '}</div>}
            data={[
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
            ]}
          />
        </div>
      </div>
      <div className="channelInfo__playlists">
        <h2>Playlists</h2>

        <hr style={{ margin: '5px 0' }} />

        <div className="channelInfo__playlistsContainer">
          <ScrollMenu
            arrowLeft={<div style={{ fontSize: '30px' }}>{' < '}</div>}
            arrowRight={<div style={{ fontSize: '30px' }}>{' > '}</div>}
            data={[
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
            ]}
          />
        </div>
      </div>
      <div className="channelInfo__videos">
        <h2>All Videos</h2>
        <hr style={{ margin: '5px 0' }} />

        <div className="channelInfo__videosContainer">
          <ScrollMenu
            arrowLeft={<div style={{ fontSize: '30px' }}>{' < '}</div>}
            arrowRight={<div style={{ fontSize: '30px' }}>{' > '}</div>}
            data={[
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
              <VideoCard
                title="Test"
                views="12,000"
                timestamp="2020-02-10"
                channelImg="./dog.jpg"
                channel="Firas Harb"
                image="./dog.jpg"
              />,
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default ChannelInfoPage;
