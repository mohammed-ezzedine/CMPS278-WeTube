import React from 'react';
import './Sidebar.css';
import SidebarRow from '../SidebarRow/SidebarRow';
import { Link } from 'react-router-dom';

//Icons
import HomeIcon from '@material-ui/icons/Home';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import SubscriptionIcon from '@material-ui/icons/Subscriptions';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import HistoryIcon from '@material-ui/icons/History';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import ThumbUpAltIconOutlined from '@material-ui/icons/ThumbUpAlt';
// import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';

function Sidebar() {
  const getSidebarRows = () => {
    const sidebar = document.querySelector('.sidebar');
    console.log(sidebar.children);
  };

  return (
    <div className="sidebar">
      <SidebarRow Icon={HomeIcon} title="Home" pageLink="home" />
      <SidebarRow Icon={WhatshotIcon} title="Trending" pageLink="trending" />
      <SidebarRow
        Icon={SubscriptionIcon}
        title="Subscriptions"
        pageLink="subscriptions"
      />
      <hr />
      <SidebarRow
        Icon={VideoLibraryIcon}
        title="Playlists"
        pageLink="playlists"
      />
      <SidebarRow Icon={HistoryIcon} title="History" pageLink="history" />
      <SidebarRow
        Icon={OndemandVideoIcon}
        title="Your Videos"
        pageLink="your-videos"
      />
      <SidebarRow
        Icon={WatchLaterIcon}
        title="Watch Later"
        pageLink="watch-later"
      />
      {/* <SidebarRow Icon={ThumbUpAltIconOutlined} title="Liked Videos" /> */}
      {/* <SidebarRow Icon={ExpandMoreOutlinedIcon} title="Show More" /> */}
    </div>
  );
}

export default Sidebar;
