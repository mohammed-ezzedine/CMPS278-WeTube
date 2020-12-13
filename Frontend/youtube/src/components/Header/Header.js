import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  TextField,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import VideoCallIcon from '@material-ui/icons/VideoCall';

import './Header.css';
import { AuthContext } from '../Auth/AuthContextProvider';

function Header() {
  const [auth, setAuth] = useContext(AuthContext);
  const [inputSearch, setInputSearch] = useState('');
  var currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));

  const handleChange = (e) => {
    setInputSearch(e.target.value);
  };

  function logout() {
    window.localStorage.removeItem('CurrentUser');
    currentUser = null;
    setAuth(false);
  }

  return (
    <div className="header">
      <div className="header__left">
        {/* <MenuIcon /> */}
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

      {auth ? (
        <div className="header__icons">
          <Link to={`/add-video`}>
            <VideoCallIcon className="header__icon" />
          </Link>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button {...bindTrigger(popupState)}>
                  <Avatar
                    alt={currentUser?.firstName + ' ' + currentUser?.lastName}
                    src={`https://youtube278.azurewebsites.net/api/channel/image-stream/${currentUser?.channel?.id}`}
                  />
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={popupState.close}>
                    <Link to={`/editChannel`}>Change Photo</Link>
                  </MenuItem>
                  <MenuItem onClick={popupState.close}>
                    <Button onClick={logout}>Logout</Button>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </div>
      ) : (
        <Link to="/login">
          <Button variant="contained" color="primary">
            {' '}
            Log In{' '}
          </Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
