import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Avatar, Button } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import AppsIcon from "@material-ui/icons/Apps";
import NotificationsIcon from "@material-ui/icons/Notifications";

import "./Header.css";
import { AuthContext } from "../Auth/AuthContextProvider";

function Header() {
  const [auth] = useContext(AuthContext)
  const [inputSearch, setInputSearch] = useState("");
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));
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

    { auth ?
      <div className="header__icons">
        <Link to={`/add-video`}>
          <VideoCallIcon className="header__icon" />
        </Link>
        <AppsIcon className="header__icon" />
        <NotificationsIcon className="header__icon" />
        <Avatar
          alt="Firas Harb"
          src={currentUser.channel?.imageUrl}
        />
      </div>
      : 
      <Link to="/login"><Button variant="contained" color="primary"> Log In </Button></Link>

}
    </div>
  );
}

export default Header;
