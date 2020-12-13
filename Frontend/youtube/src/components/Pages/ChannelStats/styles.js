import { makeStyles } from "@material-ui/core";




export const useStyles = makeStyles((theme) =>{
    table: {
      minWidth: 650,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  });