import Dialog from "@mui/material/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import React from "react";

import { Card, CardContent } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  dialogSize: {
    minHeight:'65vh'
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function DiceLog(props) {
  const open = props.showDiceLog;
  const onClose = props.onClose;

  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Roll Log
        </DialogTitle>

        <DialogContent  >
          <Card >
            <CardContent  style={{minHeight:"65vh"}}>
              <p style={{ whiteSpace: "break-spaces" }}>{props.diceLog}</p>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={props.handleResetDiceLog}  variant="contained" autoFocus color="primary">
           Clear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
