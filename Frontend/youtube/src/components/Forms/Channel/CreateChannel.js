import React, { useContext, useState } from "react";
import { post } from "axios";
//Material UI
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import AssignmentInd from "@material-ui/icons/AssignmentIndOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

//Formik
import { useFormik } from "formik";

import * as yup from "yup";

import Dropzone from "react-dropzone";
import Copyright from "../Register/Copyright.js";
import { useStyles } from "../Register/styles.js";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContextProvider.js";

export default function CreateChannel() {
  const classes = useStyles();
  const [Description, setDescription] = useState("");
  const [auth, setAuth] = useContext(AuthContext);
  console.log(auth);
  const [errorMessage, seterrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const validationSchema = yup.object({
    Description: yup
      .string()
      .min(2, "Description must contain at least 2 characters"),
  });
  const formik = useFormik({
    initialValues: {
      Description: Description || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        try {
          let { Description } = values;
          let currentUser = JSON.parse(
            window.localStorage.getItem("CurrentUser")
          );
          let { id, secret } = currentUser;
          console.log(id);
          let { status, data } = await post(
            "https://youtube278.azurewebsites.net/api/channel",
            JSON.stringify({
              "userId":id,
              "userSecret":secret,
              Description,
            }),
            {
              headers: {
                "content-type": "application/json",
              },
            }
          );
          (async () => {
                seterrorMessage("Channel has been created successfully");
                setSuccess(true);
                setOpen(true);
                currentUser.channel = data;
                window.localStorage.setItem("CurrentUser", currentUser);
              })()
            
        } 
        catch (error) {
          // console.error(error);
          if (error.response) {
            if (error.response.status === 400) {
              seterrorMessage("You already have a channel");
            }else{
              seterrorMessage(`Critical error occured`);
            }
            setSuccess(false);
            setOpen(true);  
          }
          
        }
      }


  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? "success" : "error"}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AssignmentInd />
        </Avatar>{" "}
        {/* <Typography component="h1" variant="h5">
          Create a Channel{" "}
        </Typography>{" "} */}
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                rows={2}
                id="Description"
                label="Description"
                name="Description"
                value={formik.values.Description}
                onChange={formik.handleChange}
                multiline
                error={
                  formik.touched.Description &&
                  Boolean(formik.errors.Description)
                }
                helperText={
                  formik.touched.Description && formik.errors.Description
                }
                inputProps={{ className: classes.textarea }}
              />{" "}
            </Grid>
          </Grid>{" "}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create{" "}
          </Button>{" "}
        </form>{" "}
      </div>{" "}
      <Box mt={5}>
        <Copyright />
      </Box>{" "}
      {success ? setTimeout(() => {
        return <Redirect to="/editChannel" />
      }, 2000): ""}
      {" "}
    </Container>
  );
}
