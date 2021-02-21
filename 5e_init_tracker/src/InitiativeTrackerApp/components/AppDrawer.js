import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import loadFile from "../../services/FileService";
import { loadMonsterData, loadMonsters } from "../../services/MonsterService";
import { loadSpellData, loadSpells } from "../../services/SpellService";
import { ReactComponent as Dragon } from "../assets/dragon.svg";
import InitiativeTracker from "./InitiativeTracker";
import AddCharacter from "./Modals/AddCharacter";
import AddMonster from "./Modals/AddMonster";
import EmptyReminder from "./Modals/EmptyReminder";

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
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
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
  const [openAddCharacter, setOpenAddCharacter] = React.useState(false);
  const [openAddMonster, setOpenAddMonster] = React.useState(false);
  const [openEmptyReminder, setOpenEmptyReminder] = React.useState(false);
  const [characterList, setCharacterList] = React.useState([]);
  const [monsterList, setMonsterList] = React.useState([]);
  const [spellList, setSpellList] = React.useState([]);
  const [initiativeList, setInitiativeList] = React.useState([]);
  const [monsterProgress, setMonsterProgress] = React.useState(0);
  const [spellProgress, setSpellProgress] = React.useState(0);

  useEffect(() => {
    let tasks = [];
    tasks.push(getAllMonster());
    //tasks.push(getAllSpells());
    forkJoin(tasks).subscribe(
      (tasksResult) => {
        forkJoin(tasksResult.flat()).subscribe(
          (data) => {
            let monsterArr = [];
            let spellArr = [];
            data.forEach((item) => {
              if (item.isPlayer === false) {
                monsterArr.push(item);
              } else {
                spellArr.push(item);
              }
            });
            setMonsterList(monsterArr);
            setSpellList(spellArr);
            setLoaded(true);
          },
          (err) => {
            alert(err);
            setLoaded(true);
          }
        );
      },
      (err) => {
       alert("Failed to load monsters from api" + err.message);
       setLoaded(true);
      }
    );
  }, []);

  const getAllMonster = () => {
    return loadMonsters().pipe(
      map((monsterList) => {
        let count = 0;
        return monsterList.results.map((monster) => {
          return loadMonsterData(monster.index).pipe(
            map((monster) => {
              handleIncrementMonsterProgress(monsterList.count, count);
              count++;
              monster.isPlayer = false;
              monster.type = capitalize(monster.type);
              return monster;
            })
          );
        });
      })
    );
  };

  const getAllSpells = () => {
    return loadSpells().pipe(
      map((spellList) => {
        let count = 0;
        return spellList.results.map((spell) => {
          return loadSpellData(spell.index).pipe(
            map((spell) => {
              handleIncrementSpellProgress(spellList.count, count);
              count++;
              return spell;
            })
          );
        });
      })
    );
  };

  const handleAppendMonsterList = (appendList) => {
    let newList = [];
    Object.assign(newList, monsterList);
    newList.push(...appendList);
    setMonsterList(newList);
  };

  const handleAppendCharacterList = (appendList) => {
    let newList = [];
    Object.assign(newList, characterList);
    newList.push(...appendList);
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

  const handleRemove = (character) => {
    const newList = initiativeList.filter((item) => item.id !== character.id);
    setInitiativeList(newList);
  };

  const handleInitAdvance = () => {
    let newList = [];
    Object.assign(newList, initiativeList);
    newList.push(newList.shift());
    setInitiativeList(newList);
  };

  const handleLoadFile = () => {
    loadFile((result) => {
      let monsterArr = [];
      let charArr = [];
      result.forEach((item) => {
        if (item.isPlayer === false) {
          monsterArr.push(item);
        } else {
          charArr.push(item);
        }
      });
      handleAppendMonsterList(monsterArr);
      handleAppendCharacterList(charArr);
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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuOpenIcon style={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="h6" noWrap>
            Initiative Tracker
          </Typography>
        </Toolbar>
      </AppBar>
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
          <IconButton onClick={handleDrawerClose}>
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
            <ListItem button key={text} onClick={handleLoadFile}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <input type="file" id="my_file" style={{ display: "none" }} />
        </List>
        <List>
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

          <ListItem button key={"Add Monster"} onClick={handleAddMonsterClick}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Add Monster"} />
          </ListItem>

          <AddMonster
            openAddMonster={openAddMonster}
            onClose={handleAddMonsterClose}
            setInitiativeList={setInitiativeList}
            initList={initiativeList}
            monList={monsterList}
          />

          <AddCharacter
            openAddCharacter={openAddCharacter}
            onClose={handleAddCharacterClose}
            setInitiativeList={setInitiativeList}
            initList={initiativeList}
            charList={characterList.filter((char) => char.isPlayer === true)}
          />
          <EmptyReminder
            openEmptyReminder={openEmptyReminder}
            onClose={handleEmptyReminderClose}
          />
        </List>
        <Divider />
        <List>
          {["Bestiary"].map((text) => (
            <ListItem button key={text}>
              <ListItemIcon>{<MenuBookIcon />}</ListItemIcon>
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
          <div>
            Loading Monsters...
            <LinearProgressWithLabel value={monsterProgress} />
            Loading Spells...
            <LinearProgressWithLabel value={spellProgress} />
          </div>
        )}
        {appLoaded === true && (
          <div>
            {initiativeList.length !== 0 && (
              <InitiativeTracker
                handleRemove={handleRemove}
                handleInitAdvance={handleInitAdvance}
                charList={initiativeList}
              />
            )}
            {initiativeList.length === 0 && (
              <div className={classes.placeholder}>
                <Grow in={true}>
                  <div>
                    <SvgIcon
                      style={{ width: "65vw", height: "65vh" }}
                      color="action"
                    >
                      <Dragon />
                    </SvgIcon>
                  </div>
                </Grow>
                <div>
                  <p style={{ fontSize: "2em" }}>
                    The inn is empty. Recruit some more adventurers.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}