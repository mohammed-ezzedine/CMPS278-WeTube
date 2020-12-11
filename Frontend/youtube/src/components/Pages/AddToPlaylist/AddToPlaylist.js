import CloseIcon from "@material-ui/icons/Close";
import { Button, IconButton, Menu, MenuItem, Slide } from "@material-ui/core";
import React, { useState } from "react";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import SnackBar from "@material-ui/core/Snackbar";

import './AddToPlaylist.css';

function AddToPlaylist({videoId}) {
    const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);

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
                        <MenuItem onClick={popupState.close}>Add to new playlist</MenuItem>
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