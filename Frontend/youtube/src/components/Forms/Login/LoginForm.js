import React, { useContext, useState } from "react";
//Material UI
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Link } from 'react-router-dom';

//Formik
import { useFormik } from "formik";

import * as yup from "yup";

import './LoginForm.css'

import Copyright from "../Register/Copyright.js";
import { useStyles } from "../Register/styles.js";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContextProvider.js";

export default function LoginForm({firstTime}) {
  const classes = useStyles();
  const [UserName, setUserName] = useState("");
  const [auth, setAuth] = useContext(AuthContext);
  const [Password, setPassword] = useState("");
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
    UserName: yup
      .string()
      .min(2, "Username must contain at least 2 characters")
      .required("Username is required"),
    Password: yup
      .string()
      .min(8, "Password must contain at least 8 characters")
      .required("Enter your password"),
  });
  const formik = useFormik({
    initialValues: {
      UserName: UserName || "",
      Password: Password || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await setTimeout(async () => {
        try {
          let response = await fetch(
            "https://youtube278.azurewebsites.net/api/identity/signin",
            {
              method: "POST",
              headers: new Headers({
                "Content-Type": "application/json",
              }),
              body: JSON.stringify(values),
            }
          );
          response.ok && response.status === 200
            ? (async() => {
                response = await response.json();
                window.localStorage.setItem("CurrentUser", JSON.stringify(response));
                setSuccess(true);
                setOpen(false);
                setAuth(true);
              })()
            : (async () => {
                if (response.status === 404) {
                    seterrorMessage("User was not found, incorrect credentials");
                }
                else {
                    seterrorMessage("An error occurred");
                }
                setSuccess(false);
                setOpen(true);
                setAuth(true);
              })();
        } catch (error) {
          seterrorMessage('Critical error occured, check your internet connection');
          setSuccess(false);
          setOpen(true);
          setAuth(false);
        }
      }, 100);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success? "success" : "error"}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>{" "}
        <Typography component="h1" variant="h5">
          Log In{" "}
        </Typography>{" "}
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="UserName"
                value={formik.values.UserName}
                onChange={formik.handleChange}
                error={
                  formik.touched.UserName && Boolean(formik.errors.UserName)
                }
                helperText={formik.touched.UserName && formik.errors.UserName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="Password"
                label="Password"
                type="password"
                id="password"
                value={formik.values.Password}
                onChange={formik.handleChange}
                error={
                  formik.touched.Password && Boolean(formik.errors.Password)
                }
                helperText={formik.touched.Password && formik.errors.Password}
              />
            </Grid>{" "}
          </Grid>{" "}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login{" "}
          </Button>{" "}
          <Link to="/register" className="link" >
            Don't have an account? Sign Up
          </Link>
        </form>{" "}
      </div>{" "}
      <Box mt={5}>
        <Copyright />
      </Box>{" "}
      {success && firstTime ? <Redirect to="/createChannel" /> : ""}
      {success && !firstTime ? <Redirect to="/" />: ""}
    </Container>
  );
}
