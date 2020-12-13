import CloseIcon from "@material-ui/icons/Close";
import { Button, IconButton, Menu, MenuItem, Slide, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import SnackBar from "@material-ui/core/Snackbar";

import './AddToPlaylist.css';

function AddToPlaylist({videoId}) {
    const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);
    const [inputPlaylist, setInputPlaylist] = useState("");
    const [myPlaylists, setMyPlaylists] = useState([]);

    useEffect(() => {
        if (currentUser != null) {
            fetch(`https://youtube278.azurewebsites.net/api/playlist/channel/${currentUser.channel?.id}`)
            .then(d => d.json())
            .then(d => {
                setMyPlaylists(d);
            })
            .catch((error) => console.log(error));
        }
    }, [currentUser])

    function TransitionUp(props) {
        return <Slide {...props} direction="up" />;
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
        return;
        }

        setOpen(false);
    };

    function addToWatchLater() {
        if (currentUser == null) {
            return;
        }

        fetch(`https://youtube278.azurewebsites.net/api/video/addtowatchlater/${videoId}`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            mode: "no-cors",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userSecret: currentUser.secret
          }),
        })
        .then(d => {
            if (d.ok) {
                setMessage("Added to watch later");
                setTransition(() => TransitionUp);
                setOpen(true);
            }
        })
        .catch((error) => console.log(error));
    }

    const handlePlaylistNameChange = (e) => {
        setInputPlaylist(e.target.value);
    }

    function addToNewPlaylist() {
        if (currentUser == null) {
            return;
        }

        fetch(`https://youtube278.azurewebsites.net/api/playlist`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            mode: "no-cors",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userSecret: currentUser.secret,
            name: inputPlaylist
          }),
        })
        .then(d => d.json())
        .then(d => {
            fetch(`https://youtube278.azurewebsites.net/api/playlist/addvideo`, {
                method: "POST",
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  mode: "no-cors",
                },
                body: JSON.stringify({
                  userId: currentUser.id,
                  userSecret: currentUser.secret,
                  videoId: videoId,
                  playlistId: d.id
                }),
              })
              .then(d => {
                  if (d.ok) {
                      setMessage(`Added to playlist ${inputPlaylist}`);
                      setTransition(() => TransitionUp);
                      setOpen(true);
                  }
              })
        })
        .catch((error) => console.log(error));
    }

    function addToPlaylist(playlist) {
        
        if (currentUser == null) {
            return;
        }

        fetch(`https://youtube278.azurewebsites.net/api/playlist/addvideo`, {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                mode: "no-cors",
            },
            body: JSON.stringify({
                userId: currentUser.id,
                userSecret: currentUser.secret,
                videoId: videoId,
                playlistId: playlist.id
            }),
            })
            .then(d => {
                if (d.ok) {
                    setMessage(`Added to playlist ${playlist.name}`);
                    setTransition(() => TransitionUp);
                    setOpen(true);
                }
            })
    }

    if (currentUser?.channel != null) {
        return (
            <div className="add-playlist-container">
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                        <Button {...bindTrigger(popupState)}>
                            <PlaylistAddIcon />
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem key="watch-later" onClick={(e) => {
                                popupState.close();
                                addToWatchLater()
                            }}>Add to Watch Later</MenuItem>
                            {myPlaylists.map(p => 
                                <MenuItem key={`playlist-${p.name}`}  onClick={(e) => {
                                    popupState.close();
                                    addToPlaylist(p)
                                }}>Add To Playlist: {p.name}</MenuItem>
                            )}
                            <MenuItem key="new-playlist">
                                <PopupState variant="popover" popupId="demo-popup-menu-2">
                                    {(popupState) => (
                                        <React.Fragment>
                                        <Button {...bindTrigger(popupState)}>
                                            Add to new playlist
                                        </Button>
                                        <Menu {...bindMenu(popupState)}>
                                            <MenuItem key="new-playlist-info">
                                                <TextField 
                                                    placeholder="Playlist name"
                                                    onChange={(e) => handlePlaylistNameChange(e)}
                                                />
                                                <Button onClick={(e) => {
                                                    popupState.close();
                                                    addToNewPlaylist()
                                                }}>Add</Button>
                                            </MenuItem>
                                        </Menu>
                                        </React.Fragment>
                                    )}
                                </PopupState>
                            </MenuItem>
                        </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
                <SnackBar
                    open={open}
                    autoHideDuration={4000}
                    onClose={handleClose}
                    message={message}
                    TransitionComponent={transition}
                    action={
                    <React.Fragment>
                        <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                        >
                        <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                    }
                />
            </div>
        );
    } else {
        // User is not signed in, or he doesn;t have a channel --> he can't add the video to a playlist
        return (
            <div className="add-playlist-container">
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                        <Button {...bindTrigger(popupState)}>
                            <PlaylistAddIcon />
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={popupState.close}>You should sign in first</MenuItem>
                        </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
            </div>
        );
    }
}

export default AddToPlaylist;