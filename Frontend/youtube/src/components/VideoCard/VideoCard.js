import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import './VideoCard.css';
import { Link } from 'react-router-dom';
import { Button, Menu, MenuItem, TextField, Slide, IconButton, Dialog } from "@material-ui/core";
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import CloseIcon from "@material-ui/icons/Close";
import SnackBar from "@material-ui/core/Snackbar";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function VideoCard({
  image,
  title,
  channel,
  views,
  timestamp,
  channelImg,
  path,
  description = "",
  hidden = false,
  adminView = false,
  featured = false,
  channelId = -1
}) {
  const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
  const [videoHidden, setVideoHidden] = useState(hidden);
  const [videoFetured, setVideoFetured] = useState(featured);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [transition, setTransition] = useState(undefined);

  function hideVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/video/hide/${path}`, {
      method: "PUT",
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
        setVideoHidden(true);
        setMessage("Video is hidden. Refresh the page to view the changes");
        setTransition(() => TransitionUp);
        setOpen(true);
      }
    })
    .catch((error) => console.log(error));
  }

  function TransitionUp(props) {
      return <Slide {...props} direction="up" />;
  }

  const handleClose = (event, reason) => {
      if (reason === "clickaway") {
      return;
      }

      setOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleClickOpen = () => {
    setConfirmOpen(true);
  };

  function showVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/video/show/${path}`, {
      method: "PUT",
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
        setVideoHidden(false);
        setMessage("Video is shown. Refresh the page to view the changes");
        setTransition(() => TransitionUp);
        setOpen(true);
      }
    })
    .catch((error) => console.log(error));
  }

  function featureVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/channel/feature-video`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret,
        channelId: channelId,
        videoId: parseInt(path)
      }),
    })
    .then(d => {
      if (d.ok) {
        setVideoFetured(true);
        setMessage("Video is featured. Refresh the page to view the changes");
        setTransition(() => TransitionUp);
        setOpen(true);
      }
    })
    .catch((error) => console.log(error));
  }

  const handleTitleChange = (e) => {
    setInputTitle(e.target.value);
  }

  const handleDescriptionChange = (e) => {
    setInputDescription(e.target.value);
  }

  function deleteVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/video/${path}`, {
      method: "DELETE",
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
        handleConfirmClose();
        setMessage("Video is successfully deleted. Refresh the page to view the changes");
        setTransition(() => TransitionUp);
        setOpen(true);
      }
    })
    .catch((error) => console.log(error));
  }

  function editVideo() {
    fetch(`https://youtube278.azurewebsites.net/api/video/${path}`, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userSecret: currentUser.secret,
        Title: (inputTitle != "")? inputTitle : title,
        Description: (inputDescription != "")? inputDescription : description,
        Shown: !hidden
      }),
    })
    .then(d => {
      if (d.ok) {
        setMessage("Video is successfully updated. Refresh the page to view the changes");
        setTransition(() => TransitionUp);
        setOpen(true);
        d.json().then(r => {
          title = r.title;
          description = r.description;
        })
      }
    })
    .catch((error) => console.log(error));
  }

  const link = (videoHidden)?
    <img className="videoCard__thumbnail" src={image} alt="" /> :
    <Link to={`/video/${path}`}>
      <img className="videoCard__thumbnail" src={image} alt="" />
    </Link>

  const toggleVisibilityBtn = (adminView)?
    (videoHidden)?
      <Button color="default" onClick={() => showVideo()}>Show</Button> :
      <Button color="default" onClick={() => hideVideo()}>Hide</Button>
    : "";

  function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }

  const deleteBtn = (adminView)?
    <>
    <Button color="secondary" onClick={handleClickOpen}>
    Delete
    </Button>
    <Dialog
      open={confirmOpen}
      onClose={handleConfirmClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Delete
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this video?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleConfirmClose} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteVideo} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
    : "";

  const editBtn = (adminView)?
    <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
              <React.Fragment>
              <Button {...bindTrigger(popupState)}>Edit</Button>
              <Menu {...bindMenu(popupState)}>
                  <MenuItem>
                    <TextField 
                      aria-readonly={false}
                      helperText="Title"
                      defaultValue={title}
                      onChange={(e) => handleTitleChange(e)}
                    />
                  </MenuItem>
                  <MenuItem>
                    <TextField 
                      aria-readonly={false}
                      helperText="Description"
                      defaultValue={description}
                      onChange={(e) => handleDescriptionChange(e)}
                    />
                  </MenuItem>
                  <MenuItem>
                    <Button onClick={(e) => {
                        popupState.close();
                        editVideo()
                    }}>Update</Button>
                  </MenuItem>
              </Menu>
              </React.Fragment>
          )}
      </PopupState>
    : "";

  const toggleFeatureBtn = (adminView & !videoHidden)?
    (!videoFetured)?
      <Button color="primary" onClick={() => featureVideo()}>Feature</Button>
      : ""
    : "";

  return (
    <div className="videoCard">
      {link}
      <div className="videoCard__info">
        <Avatar className="videoCard__avatar" alt={channel} src={channelImg} />
        <div className="videoCard__text">
          <h4>{title}</h4>
          <p>{channel}</p>
          <p>{description}</p>
          <p>
            {views} Views • {timestamp?.split('T')[0]}
          </p>
        </div>
      </div>
      <div className="admin-operations">
        {toggleVisibilityBtn}
        {toggleFeatureBtn}
        {deleteBtn}
        {editBtn}
      </div>
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
}

export default VideoCard;
