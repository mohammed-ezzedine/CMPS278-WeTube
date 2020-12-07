import React, { useState } from "react";
//Material UI
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import { useStyles } from "./styles.js";
//Formik
import { useFormik } from "formik";
import Copyright from "./Copyright.js";
import * as yup from "yup";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";



function RegisterForm() {
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [FirstName, setFirstName] = useState( "");
  const [LastName, setLastName] = useState("");
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const validationSchema = yup.object({
    FirstName: yup
      .string()
      .min(2, "First Name must contain at least 2 characters")
      .required("First Name is required"),
    LastName: yup
      .string()
      .min(1, "Last Name must contain at least 1 character")
      .required("Last Name is required"),
    UserName: yup
      .string()
      .min(2, "Username must contain at least 2 characters")
      .required("Username is required"),
    Password: yup
      .string()
      .min(8, "Password must contain at least 8 characters")
      .required("Enter your password")
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      FirstName: FirstName || "",
      LastName: LastName || "",
      UserName: UserName || "",
      Password: Password || ""
        },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        await setTimeout(async() => {
        try {
        let response = await fetch(
          "https://youtube278.azurewebsites.net/api/identity/signup",
          {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(values)
          }
        );
        response.ok && response.status === 200
          ? (()=>{ 
          setSuccess(true);
          setOpen(true);
          seterrorMessage("You have been registered successfully");})() : (
              async() => {
                response = await response.text();
                setSuccess(false);
                setOpen(true);
                seterrorMessage(response);


              }
          )();
      } catch (error) {
        seterrorMessage(error.message);
        setOpen(true);
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
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="FirstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={formik.values.FirstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.FirstName && Boolean(formik.errors.FirstName)
                }
                helperText={formik.touched.FirstName && formik.errors.FirstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="LastName"
                value={formik.values.LastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.LastName && Boolean(formik.errors.LastName)
                }
                helperText={formik.touched.LastName && formik.errors.LastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="UserName"
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
                id="Password"
                value={formik.values.Password}
                onChange={formik.handleChange}
                error={
                  formik.touched.Password && Boolean(formik.errors.Password)
                }
                helperText={formik.touched.Password && formik.errors.Password}
              />
            </Grid>
            
          </Grid>
          <Button
          fullWidth
          type="submit"
          variant="contained"
          className={classes.submit}
          color="primary"
          >
              Register
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default RegisterForm;
