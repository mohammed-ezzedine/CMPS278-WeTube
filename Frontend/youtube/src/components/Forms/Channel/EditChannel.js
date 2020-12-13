import React, { useContext, useEffect, useState } from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { get, put } from 'axios';
//Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AssignmentInd from '@material-ui/icons/AssignmentIndOutlined';
import ImageIcon from '@material-ui/icons/Image';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
//Formik

import Copyright from '../Register/Copyright.js';
import { useStyles } from '../Register/styles.js';
import { CardMedia, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContextProvider.js';
import { useEditChannelStyles } from './styles.js';

const EditChannel = () => {
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));
  const classes = useEditChannelStyles();
  const [readerRes, setReaderRes] = useState(null);
  let { id, imageUrl } = (currentUser != null)? currentUser?.channel : { id: null, imageUrl: null};
  const [profilePic, setProfilePic] = useState(
    imageUrl
      ? `https://youtube278.azurewebsites.net/api/channel/image-stream/${id}`
      : null
  );
  const [auth, setAuth] = useContext(AuthContext);
  const [errorMessage, seterrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  console.log(readerRes);

  if (currentUser == null) {
    return(
      <div>
        <h2>You are not logged in.</h2>
      </div>
    )
  }


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    console.log(meta);
    return { url: 'https://httpbin.org/post' };
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === 'removed') {
      if (readerRes) {
        setProfilePic(readerRes);
      } else {
        setProfilePic(imageUrl);
      }
    }
    if (status === 'done') {
      let reader = new FileReader();
      reader.addEventListener('load', () => {
        setProfilePic(reader.result);
        setReaderRes(reader.result);
      });
      reader.readAsDataURL(file);
    }
    console.log(status, meta, file);
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = async (files, allFiles) => {
    let data = new FormData();
    let userId = currentUser.id;
    let userSecret = currentUser.secret;
    data.append('image', files[0].file);
    try {
      let response = await put(
        `https://youtube278.azurewebsites.net/api/channel/${id}?userId=${userId}&userSecret=${userSecret}`,
        data,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      );

      imageUrl = `https://youtube278.azurewebsites.net/api/channel/image-stream/${id}`;
      currentUser.channel.imageUrl = imageUrl;
      window.localStorage.setItem('CurrentUser', JSON.stringify(currentUser));
      setProfilePic(profilePic);
      seterrorMessage('profile pic has been updated successfully');
      setSuccess(true);
      setOpen(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          seterrorMessage("You don't have a channel yet");
        } else if (error.response.status === 401) {
          seterrorMessage(`You can't change this user's profile pic`);
        } else {
          seterrorMessage('An error occured');
          setSuccess(false);
          setOpen(true);
        }
        setSuccess(false);
        setOpen(true);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? 'success' : 'error'}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <div className={classes.paperLessMargin}>
        {/* <Avatar className={classes.avatar}>
          <ImageIcon />
        </Avatar>{' '} */}
        <Typography component="h1" variant="h5">
          Change Profile Pic{' '}
        </Typography>{' '}
        <Grid container spacing={2}>
          <Col className={classes.image}>
            {profilePic !== null ? (
              <Image
                src={profilePic}
                alt="ProfilePic"
                roundedCircle
                style={{ borderRadius: '50%' }}
                height="200px"
                width="200px"
              />
            ) : (
              <Image
                src={
                  'https://st.depositphotos.com/1052233/2885/v/950/depositphotos_28850541-stock-illustration-male-default-profile-picture.jpg'
                }
                alt="ProfilePic"
                roundedCircle
                style={{ borderRadius: '50%' }}
                height="200px"
                width="200px"
              />
            )}
          </Col>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Dropzone
              maxFiles={1}
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              accept="image/*"
            />
          </Grid>
        </Grid>{' '}
      </div>{' '}
      <Box mt={5}>
        <Copyright />
      </Box>{' '}
    </Container>
  );
};

export default EditChannel;

//   <ImageAudioVideo />

// import React, { useContext, useState } from 'react'
// import Dropzone from 'react-dropzone'
// import { AuthContext } from '../../Auth/AuthContextProvider'

// const Preview = ({ meta }) => {
//     const { name, percent, status } = meta
//     return (
//       <span style={{ alignSelf: 'flex-start', margin: '10px 3%', fontFamily: 'Helvetica' }}>
//         {name}, {Math.round(percent)}%, {status}
//       </span>
//     )
//   }

// const CustomPreview = () => {
// const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

// const handleSubmit = (files, allFiles) => {
//     console.log(files.map(f => f.meta))
//     allFiles.forEach(f => f.remove())
// }

// return (
//     <Dropzone
//     getUploadParams={getUploadParams}
//     onSubmit={handleSubmit}
//     PreviewComponent={Preview}
//     inputContent="Drop Files (with Preview)"
//     disabled={files => files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status))} />

// )
// }

// function EditChannel() {

//     const [profilePic, setProfilePic] = useState("");
//     const [percent, setPercent] = useState(0);
//     const [Description, setDescription] = useState("");
//     const [auth, setAuth] = useContext(AuthContext);
//     const [errorMessage, seterrorMessage] = useState("");
//     const [open, setOpen] = useState(false);
//     const [success, setSuccess] = useState(false);

//     const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }

//     setOpen(false);
//   };

//     return (
//         <div>
//         <form action="">
//         <CustomPreview />
//         </form>

//         </div>
//     );
// }

// export default EditChannel

// // let {image} = values;
// //                 let {status, data} = await post("https://youtube278.azurewebsites.net/api/channel", image , config);

// {/* <Dropzone onDrop={this.onDrop} className='dropzone-box'>
//             <div>Try dropping your channel image here, or click to select files to upload. {percent}</div>

//             </Dropzone>
//             <Box display="flex" alignItems="center">
//       <Box width="100%" mr={1}>
//         <LinearProgress variant="determinate" value={percent} />
//       </Box>
//       <Box minWidth={35}>
//         <Typography variant="body2" color="textSecondary">{`${Math.round(
//           props.value,
//         )}%`}</Typography>
//       </Box>
//     </Box> */}

//     // let onDrop = files => {
//     //     percent= 0;
//     //     let data = new FormData();
//     //     files.forEach(file => {
//     //         data.append('files', file, file.name);
//     //     });
//     // }

//     // const config = {
//     // headers: { 'content-type': 'multipart/form-data' },
//     // onUploadProgress: progressEvent => {
//     //     setPercent(Math.round(progressEvent.loaded * 100 / progressEvent.total));
//     //     if (percent >= 100) {
//     //     setPercent(100);
//     //     }
//     // }
//     // };
