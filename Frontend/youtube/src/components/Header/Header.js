import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';

import './Header.css';

function Header() {
  const [inputSearch, setInputSearch] = useState('');

  const handleChange = (e) => {
    setInputSearch(e.target.value);
  };

  return (
    <div className="header">
      <div className="header__left">
        <MenuIcon />
        <Link to="/">
          <img
            className="header_logo"
            src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_YouTube_%282015-2017%29.svg"
            alt="Logo Of Youtube"
          />
        </Link>
      </div>

      <div className="header__input">
        <input
          onChange={(e) => handleChange(e)}
          value={inputSearch}
          placeholder="Search"
          type="text"
        />
        <Link className="header__searchLink" to={`/search/${inputSearch}`}>
          <SearchIcon className="header__inputButton" />
        </Link>
      </div>

      <div className="header__icons">
        <VideoCallIcon className="header__icon" />
        <AppsIcon className="header__icon" />
        <NotificationsIcon className="header__icon" />
        <Avatar
          alt="Firas Harb"
          src="https://media-exp1.licdn.com/dms/image/C4E03AQEOXFZLu5cS_g/profile-displayphoto-shrink_200_200/0?e=1611187200&v=beta&t=-80oZ6xgokRpwsu1-qCQnhRoWXgdzk7zu6vIrrQ2gFk"
        />
      </div>
    </div>
  );
}

export default Header;
