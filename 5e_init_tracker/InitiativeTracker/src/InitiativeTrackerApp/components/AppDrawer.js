import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PublishIcon from "@mui/icons-material/Publish";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import { isEqual } from "lodash";
import PropTypes from "prop-types";
import { default as React, useEffect } from "react";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { loadCharacterFile, loadMonsterFile } from "../../services/FileService";
import { loadMonsterData, loadMonsters } from "../../services/MonsterService";
import { ReactComponent as Logo } from "../assets/download.svg";
import { ReactComponent as Dragon } from "../assets/dragon.svg";
import {
  characterFileExists,
  readCharacterFile,
  writeCharacterFile,
} from "../utilities/CharacterReader";
import {
  monsterFileExists,
  readMonsterFile,
  translateMonsters,
  writeMonsterFile,
} from "../utilities/MonsterTranslator";
import InitiativeTracker from "./InitiativeTracker";
import AddCharacter from "./Modals/Character/AddCharacter";
import CreateChar from "./Modals/Character/CreateChar";
import EditChar from "./Modals/Character/EditChar";
import EmptyReminder from "./Modals/EmptyReminder";
import AddMonster from "./Modals/Monster/AddMonster";
import CreateMonster from "./Modals/Monster/CreateMonster";
import EditMonster from "./Modals/Monster/EditMonster";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DiceLog from "./Modals/DiceLog";
import BookIcon from '@mui/icons-material/Book';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    background: theme.palette.primary.main,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  bottomAppBar: {
    background: theme.palette.primary.secondary,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    paddingBottom: "3em",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
    justifyContent: "space-around",
  },
  mainToolbar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingBottom: "6em",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    paddingBottom: "6em",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  placeholder: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    height: "80vh",
    "flex-direction": "column",
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [appLoaded, setLoaded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [roundCounter, setRoundCounter] = React.useState(1);
  const [diceLog, setDiceLog] = React.useState("");

  const [openAddCharacter, setOpenAddCharacter] = React.useState(false);
  const [openCreateCharacter, setOpenCreateCharacter] = React.useState(false);
  const [openEditCharacter, setOpenEditCharacter] = React.useState(false);
  const [openEditMonster, setOpenEditMonster] = React.useState(false);
  const [openCreateMonster, setOpenCreateMonster] = React.useState(false);
  const [openAddMonster, setOpenAddMonster] = React.useState(false);
  const [openEmptyReminder, setOpenEmptyReminder] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState({});

  const [characterList, setCharacterList] = React.useState([]);
  const [monsterList, setMonsterList] = React.useState([]);
  const [initialCharacter, setInitialCharacter] = React.useState();
  const [spellList, setSpellList] = React.useState([]);
  const [initiativeList, setInitiativeList] = React.useState([]);
  const [selectedCharacter, setSelectedCharacter] = React.useState({});
  const [monsterProgress, setMonsterProgress] = React.useState(0);
  const [spellProgress, setSpellProgress] = React.useState(0);
  const [showMonsterInfo, setShowMonsterInfo] = React.useState(true);
  const [showDiceLog, setShowDiceLog] = React.useState(false);

  useEffect(() => {
    let tasks = [];
    if (characterFileExists() === true) {
      setCharacterList(readCharacterFile());
    }
    if (monsterFileExists() === false) {
      tasks.push(getAllMonsters());
      forkJoin(tasks).subscribe(
        (tasksResult) => {
          forkJoin(tasksResult.flat()).subscribe(
            (data) => {
              let monsterArr = [];
              let spellArr = [];
              data.forEach((item) => {
                monsterArr.push(item);
              });
              handleAppendMonsterList(translateMonsters(monsterArr));
              setLoaded(true);
              setOpen(true);
            },
            (err) => {
              alert(err);
              setLoaded(true);
              setOpen(true);
            }
          );
        },
        (err) => {
          alert("Failed to load monsters from api" + err.message);
          setLoaded(true);
          setOpen(true);
        }
      );
    } else {
      setMonsterList(readMonsterFile());
      setLoaded(true);
      setOpen(true);
    }
  }, []);

  const getAllMonsters = () => {
    return loadMonsters().pipe(
      map((monsterList) => {
        let count = 0;
        return monsterList.results.map((monster) => {
          return loadMonsterData(monster.index).pipe(
            map((monster) => {
              handleIncrementMonsterProgress(monsterList.count, count);
              count++;
              monster.type = capitalize(monster.type);
              return monster;
            })
          );
        });
      })
    );
  };

  const handleSetInitList = (newList) => {
    setSelectedCharacter(newList[0]);
    setInitialCharacter(newList[0]);
    setRoundCounter(1);
    setInitiativeList(newList);
  };

  const updateMonsterList = (updateList, monster) => {
    writeMonsterFile(updateList);
    setMonsterList(updateList);

    let newList = [];
    Object.assign(newList, initiativeList);
    let newMonster = JSON.parse(JSON.stringify(monster));

    let tempList = newList.filter((mon) => mon.index == monster.index);
    tempList.forEach((tempMon, index) => {
      newMonster.id = tempMon.id;
      newMonster.initiative = tempMon.initiative;
      newMonster.damage = tempMon.damage;
      newMonster.statuses = tempMon.statuses;
      newMonster.name = tempMon.name;
      newList[index] = JSON.parse(JSON.stringify(newMonster));
    });
    if (tempList.length > 0) {
      setInitiativeList(newList);
      setSelectedCharacter(newList[0]);
    }
  };

  const updateCharacterList = (updateList, character) => {
    writeCharacterFile(updateList);
    setCharacterList(updateList);

    let newList = [];
    Object.assign(newList, initiativeList);
    let newChar = JSON.parse(JSON.stringify(character));

    let tempList = newList.filter((char) => char.name === character.name);
    tempList.forEach((tempMon, index) => {
      newChar.id = tempMon.id;
      newChar.initiative = tempMon.initiative;
      newChar.damage = tempMon.damage;
      newChar.statuses = tempMon.statuses;
      newChar.name = tempMon.name;
      newList[index] = JSON.parse(JSON.stringify(newChar));
    });
    if (tempList.length > 0) {
      setInitiativeList(newList);
      setSelectedCharacter(newList[0]);
    }
  };

  const handleAppendMonsterList = (appendList) => {
    let newList = [];
    Object.assign(newList, monsterList);
    appendList.forEach((monster) => {
      if (newList.filter((e) => isEqual(e, monster)).length === 0) {
        newList.push(monster);
      }
    });
    writeMonsterFile(newList);
    setMonsterList(newList);
  };

  const handleAppendCharacterList = (appendList) => {
    let newList = [];
    Object.assign(newList, characterList);
    appendList.forEach((character) => {
      character.initiative = 0;
      if (newList.filter((e) => isEqual(e, character)).length === 0) {
        newList.push(character);
      }
    });
    writeCharacterFile(newList);
    setCharacterList(newList);
  };

  const handleIncrementMonsterProgress = (size, position) => {
    setMonsterProgress((position / size) * 100);
  };

  const handleIncrementSpellProgress = (size, position) => {
    setSpellProgress((position / size) * 100);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAddCharacterClick = () => {
    if (characterList.length === 0) {
      handleEmptyReminderOpen();
    } else {
      handleAddCharacterOpen();
    }
  };

  const handleAddMonsterClick = () => {
    if (monsterList.length === 0) {
      handleEmptyReminderOpen();
    } else {
      handleAddMonsterOpen();
    }
  };

  const handleAddCharacterOpen = () => {
    setOpenAddCharacter(true);
  };

  const handleAddCharacterClose = () => {
    setOpenAddCharacter(false);
  };

  const handleCreateCharacterOpen = () => {
    setOpenCreateCharacter(true);
  };

  const handleCreateCharacterClose = () => {
    setOpenCreateCharacter(false);
  };

  const handleEditCharacterOpen = () => {
    setOpenEditCharacter(true);
  };

  const handleEditCharacterClose = () => {
    setOpenEditCharacter(false);
  };

  const handleCreateMonsterOpen = () => {
    setOpenCreateMonster(true);
  };

  const handleCreateMonsterClose = () => {
    setOpenCreateMonster(false);
  };

  const handleEditMonsterOpen = () => {
    setOpenEditMonster(true);
  };

  const handleEditMonsterClose = () => {
    setOpenEditMonster(false);
  };

  const handleAddMonsterOpen = () => {
    setOpenAddMonster(true);
  };

  const handleAddMonsterClose = () => {
    setOpenAddMonster(false);
  };

  const handleEmptyReminderOpen = () => {
    setOpenEmptyReminder(true);
  };

  const handleEmptyReminderClose = () => {
    setOpenEmptyReminder(false);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowAlert({ open: false, message: "" });
  };

  const handleResetRoundCounter = (event) => {
    setRoundCounter(1);
  };

  const handleResetDiceLog = (event) => {
    setDiceLog("");
  };

  const handleRemove = (character) => {
    const newList = initiativeList.filter((item) => item.id !== character.id);
    setInitiativeList(newList);
    if (character.name === initialCharacter.name) {
      let maxIndex = 0;
      let max = 0;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].initiative > max) {
          maxIndex = i;
          max = newList[i].initiative;
        }
      }
      setInitialCharacter(newList[maxIndex]);
    }
    setSelectedCharacter(newList[0]);
  };

  const handleInitAdvance = () => {
    let newList = [];
    Object.assign(newList, initiativeList);
    newList.push(newList.shift());
    setInitiativeList(newList);
    setSelectedCharacter(newList[0]);
    if (newList[0].name === initialCharacter.name) {
      let tempRound = roundCounter + 1;
      setRoundCounter(tempRound++);
    }
  };

  const handleRollInit = () => {
    let newList = [];
    let tempDiceLog = diceLog;
    initiativeList.map((character) => {
      let mod = 0;
      let d20 = 0;
      if (character.initBonus !== undefined) {
        mod = character.initBonus;
      } else {
        mod = Math.floor((character.stats.dexterity - 10) / 2);
      }
      d20 = Math.floor(Math.random() * 20) + 1;
      character.initiative = d20 + mod;
      tempDiceLog += `${new Date().toLocaleTimeString('en-US')} ${character.name}: ${d20} + ${mod} = ${character.initiative}\n`;

      let tempChar = {};
      Object.assign(tempChar, character);

      newList.push(tempChar);
    });
    newList = sortInitList(newList);
    setDiceLog(tempDiceLog);
    setInitiativeList(newList);
    setSelectedCharacter(newList[0]);
    setInitialCharacter(newList[0]);
    setRoundCounter(1);
  };

  const handleShowMonsterInfo = () => {
    setShowMonsterInfo(!showMonsterInfo);
  };

  const handleShowDiceLog = () => {
    setShowDiceLog(!showDiceLog);
  };

  const sortInitList = (list) => {
    return list.sort(function (a, b) {
      return b.initiative - a.initiative;
    });
  };

  const handleLoadCharacterFile = () => {
    loadCharacterFile((result) => {
      let charArr = [];
      result.forEach((item) => {
        charArr.push(item);
      });
      handleAppendCharacterList(charArr);
    });
  };

  const handleLoadMonsterFile = () => {
    loadMonsterFile((name, result) => {
      let monsterArr = [];
      let monstersExist = true;
      result.forEach((item) => {
        if (item.isPlayer === false) {
          if (monsterList.findIndex((x) => x.name == item.name) == -1) {
            monsterArr.push(item);
            monstersExist = false;
          }
        }
      });
      if (monstersExist) {
        setShowAlert({
          open: true,
          message: "Imported monsters already exist!",
          severity: "warning",
        });
      } else {
        handleAppendMonsterList(monsterArr);
        setShowAlert({
          open: true,
          message: `Successfully imported: ${name}!`,
          severity: "success",
        });
      }
    });
  };

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Button
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
            size="large"
            endIcon={<MenuOpenIcon style={{ fontSize: 40 }} />}
          ></Button>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div className={classes.mainToolbar}>
            <div>
              <Typography variant="h4" noWrap></Typography>
            </div>
            <div>
              <Button
                color="inherit"
                disabled={initiativeList.length == 0}
                onClick={() => {
                  handleRollInit();
                }}
                size="large"
                endIcon={
                  <SvgIcon style={{ fontSize: 40 }}>
                    <Logo />
                  </SvgIcon>
                }
              >
                Roll
              </Button>
              <Button
                color="inherit"
                disabled={initiativeList.length == 0}
                onClick={() => {
                  handleInitAdvance();
                }}
                aria-label="advance"
                size="large"
                endIcon={
                  <ArrowUpwardIcon style={{ fontSize: 40 }}></ArrowUpwardIcon>
                }
              >
                Advance
              </Button>
              <Button
                color="inherit"
                disabled={initiativeList.length == 0}
                onClick={() => {
                  handleShowDiceLog();
                }}
                aria-label="advance"
                size="large"
                endIcon={
                  <BookIcon style={{ fontSize: 40 }}></BookIcon>
                }
              >
                Roll Log
              </Button>
            </div>
          </div>
          <div>
            {!showMonsterInfo && (
              <Button
                onClick={() => {
                  handleShowMonsterInfo();
                }}
                disabled={initiativeList.length == 0}
                style={{ float: "right" }}
                color="inherit"
                endIcon={<ViewSidebarIcon style={{ fontSize: 40 }} />}
              ></Button>
            )}
            {showMonsterInfo && (
              <Button
                onClick={() => {
                  handleShowMonsterInfo();
                }}
                disabled={initiativeList.length == 0}
                style={{ float: "right" }}
                color="inherit"
                endIcon={<ViewSidebarOutlinedIcon style={{ fontSize: 40 }} />}
              ></Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {roundCounter !== undefined && initiativeList.length > 0 && (
        <AppBar
          className={clsx(classes.bottomAppBar, {
            [classes.appBarShift]: open,
          })}
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0 }}
        >
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Button
              color="inherit"
              aria-label="reset round counter"
              onClick={handleResetRoundCounter}
              endIcon={<RestartAltIcon style={{ fontSize: 40 }} />}
            ></Button>
            <Typography variant="h4">Round: {roundCounter}</Typography>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" noWrap>
            Main Menu
          </Typography>
          <IconButton onClick={handleDrawerClose} size="large">
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {["Import Characters"].map((text, index) => (
            <ListItem button key={text} onClick={handleLoadCharacterFile}>
              <ListItemIcon>
                <PublishIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <input
            type="file"
            id="my_character"
            accept=".party"
            style={{ display: "none" }}
          />
        </List>
        <List>
          {["Import Monsters"].map((text, index) => (
            <ListItem button key={text} onClick={handleLoadMonsterFile}>
              <ListItemIcon>
                <PublishIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <input
            type="file"
            multiple
            id="my_monster"
            accept=".book"
            style={{ display: "none" }}
          />
        </List>
        <Divider variant="middle" />
        <List>
          <ListItem
            button
            key={"Create Character"}
            onClick={handleCreateCharacterOpen}
          >
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Create Character"} />
          </ListItem>

          <ListItem
            button
            key={"Edit Character"}
            onClick={handleEditCharacterOpen}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary={"Edit Character"} />
          </ListItem>

          <ListItem
            button
            key={"Add Character"}
            onClick={handleAddCharacterClick}
          >
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Add Character"} />
          </ListItem>
          <Divider variant="middle" />
          <List>
            <ListItem
              button
              key={"Create Monster"}
              onClick={handleCreateMonsterOpen}
            >
              <ListItemIcon>
                <NoteAddIcon />
              </ListItemIcon>
              <ListItemText primary={"Create Monster"} />
            </ListItem>

            <ListItem
              button
              key={"Edit Monster"}
              onClick={handleEditMonsterOpen}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary={"Edit Monster"} />
            </ListItem>

            <ListItem
              button
              key={"Add Monster"}
              onClick={handleAddMonsterClick}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary={"Add Monster"} />
            </ListItem>
          </List>
          <AddMonster
            openAddMonster={openAddMonster}
            onClose={handleAddMonsterClose}
            handleSetInitList={handleSetInitList}
            initList={initiativeList}
            monList={monsterList}
          />

          <AddCharacter
            openAddCharacter={openAddCharacter}
            onClose={handleAddCharacterClose}
            handleSetInitList={handleSetInitList}
            initList={initiativeList}
            charList={characterList.filter((char) => char.isPlayer === true)}
          />

          <EmptyReminder
            openEmptyReminder={openEmptyReminder}
            onClose={handleEmptyReminderClose}
          />
          <CreateChar
            onClose={handleCreateCharacterClose}
            openCreateCharacter={openCreateCharacter}
            handleAppendCharacterList={handleAppendCharacterList}
          />
          <CreateMonster
            onClose={handleCreateMonsterClose}
            openCreateMonster={openCreateMonster}
            updateMonsterList={updateMonsterList}
            monsterList={monsterList}
          />
          <EditMonster
            onClose={handleEditMonsterClose}
            openEditMonster={openEditMonster}
            updateMonsterList={updateMonsterList}
            monsterList={monsterList}
          ></EditMonster>
          <EditChar
            onClose={handleEditCharacterClose}
            openEditCharacter={openEditCharacter}
            updateCharacterList={updateCharacterList}
            characterList={characterList}
          ></EditChar>
          <DiceLog
            onClose={handleShowDiceLog}
            showDiceLog={showDiceLog}
            diceLog={diceLog}
            handleResetDiceLog={handleResetDiceLog}
          ></DiceLog>
        </List>
        <Divider />
        <List>
          {["Bestiary"].map((text) => (
            <ListItem disabled button key={text}>
              <ListItemIcon>{<MenuBookIcon  />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {appLoaded === false && (
          <div className={classes.placeholder}>
            <SvgIcon style={{ width: "65vw", height: "65vh" }} color="action">
              <Dragon />
            </SvgIcon>
            <div style={{ width: "45vw" }}>
              Loading Monsters...
              <LinearProgressWithLabel value={monsterProgress} />
            </div>
          </div>
        )}
        {appLoaded === true && (
          <div>
            {initiativeList.length !== 0 && (
              <Box>
                <InitiativeTracker
                  handleRemove={handleRemove}
                  handleInitAdvance={handleInitAdvance}
                  charList={initiativeList}
                  handleRollInit={handleRollInit}
                  sortInitList={sortInitList}
                  setInitiativeList={setInitiativeList}
                  selectedCharacter={selectedCharacter}
                  setSelectedCharacter={setSelectedCharacter}
                  showMonsterInfo={showMonsterInfo}
                  open={open}
                />
              </Box>
            )}
            {initiativeList.length === 0 && (
              <div className={classes.placeholder}>
                <div>
                  <SvgIcon
                    style={{ width: "65vw", height: "65vh" }}
                    color="action"
                  >
                    <Dragon />
                  </SvgIcon>
                </div>
                <div>
                  <p style={{ fontSize: "2em" }}>
                    The inn is empty. Recruit some more adventurers.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={showAlert.open}
            autoHideDuration={6000}
            onClose={handleAlertClose}
          >
            <Alert
              severity={showAlert.severity}
              sx={{ width: "100%" }}
              onClose={handleAlertClose}
            >
              {showAlert.message}
            </Alert>
          </Snackbar>
        </Stack>
      </main>
    </div>
  );
}
