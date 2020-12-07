import React, { useState } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ShareIcon from '@material-ui/icons/Share';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ReportIcon from '@material-ui/icons/Report';
import CommentList from '../CommentList/CommentList';
import SnackBar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import './InteractionSection.css';

function InteractionSection() {
  const [open, setOpen] = useState(false);

  //handling ThumbsUp & ThumbsDown events
  const handleClick = () => {
    console.log(open);
    setOpen(true);
  };
  const handleClose = (reason) => {
    if (reason == 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="interactions">
      <SnackBar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={open}
        autoHideDuration={4000}
        //TODO: Handle onClose bug preventing SnackBar from opening..
        // onClose={handleClose}
        message="Video Liked"
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
      <div className="interactions__info">
        <div className="interactions__mainInteractionSection">
          <div className="interactions__title">
            <h4>Friends "Skidmark still got a way with the ladies"</h4>
            <p>830,000 views • Jan 29, 2013</p>
          </div>
          <div className="interactions__interactiveSection">
            <ThumbUpIcon
              className="interactions__thumbsUp"
              onClick={handleClick}
            />
            <ThumbDownAltIcon className="interactions__thumbsDown" />
            <ShareIcon />
            <PlaylistAddIcon />
            <ReportIcon />
          </div>
        </div>
        <div className="interactions__commentSection">
          <div className="interactions__commentSection">
            <CommentList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractionSection;
