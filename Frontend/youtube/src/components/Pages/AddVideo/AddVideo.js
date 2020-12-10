import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import VideoCard from '../../VideoCard/VideoCard';
import { post, put } from 'axios';

import './AddVideo.css';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import VideoCallTwoToneIcon from '@material-ui/icons/VideoCallTwoTone';

import * as yup from 'yup';
import { useStyles } from '../../Forms/Register/styles';
import { Redirect } from 'react-router-dom';
import Copyright from '../../Forms/Register/Copyright';
import Dropzone from 'react-dropzone-uploader';
import { Image } from '@material-ui/icons';

const AddVideo = () => {
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [percent, setPercent] = useState(null);
  const currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));
  const [Thumbnail, setThumbnail] = useState(null);
  const [Video, setVideo] = useState(null);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const classes = useStyles();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const validationSchema = yup.object({
    Title: yup
      .string()
      .min(2, 'Title must contain at least 2 characters')
      .max(100, 'Title must contain max 100 characters')
      .required('Title is required'),
    Description: yup
      .string()
      .min(2, 'Description must contain at least 2 characters')
      .max(100, 'Description must contain max 100 characters')
      .required('Description is required'),
  });

  const formik = useFormik({
    initialValues: {
      Title: Title || '',
      Description: Description || '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setTimeout(async () => {
        let data = new FormData();
        let userId = currentUser.id;
        let userSecret = currentUser.secret;
        setPercent(0);
        console.log(Video);

        if (Video === null) {
          seterrorMessage('Insert a Video!');
          setSuccess(false);
          setOpen(true);
          return;
        }
        if (Thumbnail === null) {
          seterrorMessage('Insert a Thumbnail!');
          setSuccess(false);
          setOpen(true);
          return;
        }

        data.append('Thumbnail', Thumbnail);
        data.append('Video', Video);
        try {
          let response = await post(
            `https://youtube278.azurewebsites.net/api/Video/upload?userId=${userId}&userSecret=${userSecret}`,
            data,
            {
              headers: {
                'content-type': 'multipart/form-data',
                mode: 'no-cors',
              },
              onUploadProgress: (progressEvent) => {
                const totalLength = progressEvent.lengthComputable
                  ? progressEvent.total
                  : progressEvent.target.getResponseHeader('content-length') ||
                    progressEvent.target.getResponseHeader(
                      'x-decompressed-content-length'
                    );
                console.log('onUploadProgress', totalLength);
                if (totalLength !== null) {
                  setPercent(
                    Math.round((progressEvent.loaded * 100) / totalLength)
                  );
                }
              },
            }
          );
          setDescription(values.Description);
          setTitle(values.Title);

          await put(
            `https://youtube278.azurewebsites.net/api/Video/${response.data.id}`,
            {
              UserId: userId,
              UserSecret: userSecret,
              Title: Title,
              Description: Description,
              Featured: false,
              Shown: true,
            },
            {
              headers: {
                'content-type': 'application/json',
              },
            }
          );
          seterrorMessage('Video has been uploaded successfully');
          setSuccess(true);
          setOpen(true);
        } catch (error) {
          if (error.response) {
            seterrorMessage(`An error has occurred ${error.response} `);
            setSuccess(false);
            setOpen(true);
          }
        }
      }, 2000);
    },
  });
  const handleChangeStatusThumbnail = ({ meta, file }, status) => {
    if (status === 'removed') {
      setThumbnail(null);
    }
    if (status === 'done') {
      setThumbnail(file);
    }
    console.log(status, meta, file);
  };

  const handleChangeStatusVideo = ({ meta, file }, status) => {
    console.log(status, meta, file);
    if (status === 'removed') {
      setVideo(null);
      setPercent(null);
    }
    if (status === 'done') {
      setVideo(file);
    }
  };
  const getUploadParams = ({ meta }) => {
    return { url: 'https://httpbin.org/post' };
  };

  const handleSubmit = async (props) => {
    console.log(props);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? 'success' : 'error'}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VideoCallTwoToneIcon />
        </Avatar>{' '}
        <Typography component="h1" variant="h5">
          Upload{' '}
        </Typography>{' '}
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="title"
                label="Title"
                name="Title"
                value={formik.values.Title}
                onChange={formik.handleChange}
                error={formik.touched.Title && Boolean(formik.errors.Title)}
                helperText={formik.touched.Title && formik.errors.Title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                rows={2}
                name="Description"
                label="Description"
                type="text"
                id="description"
                multiline
                value={formik.values.Description}
                onChange={formik.handleChange}
                error={
                  formik.touched.Description &&
                  Boolean(formik.errors.Description)
                }
                helperText={
                  formik.touched.Description && formik.errors.Description
                }
                inputProps={{ className: classes.textarea }}
              />
            </Grid>{' '}
            <Grid item xs={12}>
              <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatusThumbnail}
                maxFiles={1}
                accept="image/*"
                inputContent="Drop Thumbnail"
                disabled={(files) =>
                  files.some((f) =>
                    [
                      'preparing',
                      'getting_upload_params',
                      'uploading',
                    ].includes(f.meta.status)
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Dropzone
                onChangeStatus={handleChangeStatusVideo}
                maxFiles={1}
                accept="video/*"
                inputContent="Drop Video"
                disabled={(files) =>
                  files.some((f) =>
                    [
                      'preparing',
                      'getting_upload_params',
                      'uploading',
                    ].includes(f.meta.status)
                  )
                }
              />
            </Grid>
          </Grid>{' '}
          {percent !== null ? (
            <LinearProgress variant="buffer" value={percent} valueBuffer={10} />
          ) : (
            ''
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Upload{' '}
          </Button>{' '}
        </form>
      </div>{' '}
      <Box mt={5}>
        <Copyright />
      </Box>{' '}
      {/* {success ? <Redirect to="../../Pages/RecommendedVideos" /> : ''} */}
    </Container>
  );
};

export default AddVideo;
