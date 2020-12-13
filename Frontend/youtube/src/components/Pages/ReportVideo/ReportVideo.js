import React, { useEffect, useState } from "react";
import ReportIcon from "@material-ui/icons/Report";
import { Button, Menu, MenuItem, IconButton, Slide } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import SnackBar from "@material-ui/core/Snackbar";


function ReportVideo({videoId}) {
    const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);

    const reportReasons = [ "Harrasment and violence", "+18 Content", "Violence to Animals", "Fake news"]
    
    function TransitionUp(props) {
        return <Slide {...props} direction="up" />;
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
        return;
        }

        setOpen(false);
    };

    function reportVideo(reason) {
        fetch(`https://youtube278.azurewebsites.net/api/video/reportvideo/${videoId}`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            mode: "no-cors",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userSecret: currentUser.secret,
            text: reason
          }),
        })
        .then(d => {
            if (d.ok) {
                d.text()
                .then(r => {
                    if (r.length > 0) {
                        setMessage("This is the second report on this video for the same reason. It is now deleted by the administration. Thanks for your support.");
                    } else {
                        setMessage("Your report has been recorded.");
                    }
                    setTransition(() => TransitionUp);
                    setOpen(true);
                })
                .catch(e => {})
            } else if (d.status == 400) {
                setMessage("You have previously reported this video.");
                setTransition(() => TransitionUp);
                setOpen(true);
            }
        })
        .catch((error) => console.log(error));
    }

    if (currentUser != null) {
        return(
            <div className="add-playlist-container">
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                        <Button {...bindTrigger(popupState)}>
                            <ReportIcon />
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            {reportReasons.map(r => 
                                <MenuItem key={`reason-${r}`} onClick={(e) => {
                                    popupState.close();
                                    reportVideo(r)
                                }}>{r}</MenuItem>
                            )}
                           
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
                            <ReportIcon />
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

export default ReportVideo;