import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import React from "react";
import { ReactComponent as Demo } from "../../../assets/demo.svg";
import MonsterForm from "./MonsterForm";
import { ResizableBox } from "react-resizable";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
  resizable: {
    "& .react-resizable-handle": {
      position: "absolute",
      width: 20,
      height: 20,
      bottom: 0,
      right: 0,
      background:
        "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
      "background-position": "bottom right",
      padding: "0 3px 3px 0",
      "background-repeat": "no-repeat",
      "background-origin": "content-box",
      "box-sizing": "border-box",
      cursor: "se-resize",
    },
  },
  textField: {
    width: "100%",
  },
  root: {
    flexGrow: 1,
  },
  padding16: {
    padding: "16px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  flex: {
    display: "flex",
    paddingTop: theme.spacing(2),
    justifyContent: "space-between",
  },
  placeholder: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    "flex-direction": "column",
  },
  dialogSize: {},
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

export default function EditMonster(props) {
  const open = props.openEditMonster;
  const onClose = props.onClose;
  const [selectedMon, setSelectedMon] = React.useState();
  const [isDirty, setIsDirty] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [scroll, setScroll] = React.useState("paper");

  const classes = useStyles();

  const handleClose = () => {
    setSelectedMon();
    onClose();
  };

  const handleSelectedMon = (e, val) => {
    if (props.monsterList.includes(val)) {
      let newMon = JSON.parse(JSON.stringify(val));
      setSelectedMon(newMon);
    }
  };

  const handleFormDirty = (isDirty) => {
    setIsDirty(isDirty);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth={maxWidth}
        scroll={scroll}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Edit Monster
        </DialogTitle>
     
          <DialogContent>
            <div>
              <Box>
                <Autocomplete
                  id="combo-box-demo"
                  disableClearable
                  options={props.monsterList.sort((a, b) =>
                    a.name.localeCompare(b.name)
                  )}
                  getOptionLabel={(mon) => mon.name}
                  onChange={handleSelectedMon}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Avatar>
                        <SvgIcon>
                          <Demo />
                        </SvgIcon>
                      </Avatar>
                      <span style={{ padding: "1em" }}>{option.name}</span>
                    </li>
                  )}
                  style={{
                    width: "100%",
                    paddingLeft: "8px",
                    paddingTop: "8px",
                    paddingBottom: "16px",
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Monsters"
                      variant="outlined"
                      InputProps={{ ...params.InputProps, type: "search" }}
                    />
                  )}
                />
              </Box>
              {selectedMon && (
                <MonsterForm
                  monsterList={props.monsterList}
                  updateMonsterList={props.updateMonsterList}
                  selectedMon={selectedMon}
                  onClose={handleClose}
                  handleFormDirty={handleFormDirty}
                ></MonsterForm>
              )}
            </div>
          </DialogContent>
        <DialogActions>
          <Button
            form="my-form"
            type="submit"
            disabled={!isDirty}
            variant="contained"
            autoFocus
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}
