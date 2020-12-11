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
        fetch(`https://youtube278.azurewebsites.net/api/playlist/channel/${currentUser.channel?.id}`)
        .then(d => d.json())
        .then(d => {
            setMyPlaylists(d);
        })
        .catch((error) => console.log(error));
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
            console.log(d);
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

    return (
        <div className="add-playlist-container">
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <React.Fragment>
                    <Button {...bindTrigger(popupState)}>
                        <PlaylistAddIcon />
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={(e) => {
                            popupState.close();
                            addToWatchLater()
                        }}>Add to Watch Later</MenuItem>
                        {myPlaylists.map(p => 
                            <MenuItem onClick={(e) => {
                                popupState.close();
                                addToPlaylist(p)
                            }}>Add To Playlist: {p.name}</MenuItem>
                        )}
                        <MenuItem>
                            <PopupState variant="popover" popupId="demo-popup-menu-2">
                                {(popupState) => (
                                    <React.Fragment>
                                    <Button {...bindTrigger(popupState)}>
                                        Add to new playlist
                                    </Button>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem>
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
                // anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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
}

export default AddToPlaylist;