import { CardHeader } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect } from "react";
import MainStats from "./MainStats";
import SpellCasting from "./SpellCasting";
import { readMonsterFile } from "../../utilities/MonsterTranslator";
import ActionsReactions from "./ActionsReactions";
import LegendaryLair from "./LegendaryLair";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  link: {
    color: theme.palette.secondary.main,
  },
  cardwidth: {
    width: "inherit",
    "max-height": "80vh",
    "overflow-y": "auto",
  },
  root: {
    flexGrow: 1,
  },
  char: {
    display: "flex",
    "align-items": "center",
  },
  charname: {
    padding: ".5em",
    "font-size": "1em",
  },
  "MuiCardHeader-root": {},
  cardheader: {
    display: "inline-flex",
    "align-items": "center",
    background: theme.palette.primary.main,
    flexWrap: "wrap",
    width: "100%",
  },
  col: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    "align-items": "center",
    display: "inline-flex",
    "justify-items": "center",
    "white-space": "nowrap",
    flexWrap: "wrap",
  },
  char_portrait: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    "border-style": "solid",
    "border-color": "darkgrey",
    "border-width": ".25em",
  },
  paper_padding: {
    padding: "1em",
  },

  background_blue: {
    "background-color": "blue",
  },
}));

export default function MonsterInfo(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [monster, setMonster] = React.useState(null);

  //helper functions
  const isSubtype = () => {
    let subtype = "";
    if (props.monster) {
      if (props.monster.subtype.length > 0)
        subtype = subtype.concat("(" + props.monster.subtype + ")");
    } else if (monster.subtype > 0) {
      subtype = subtype.concat("(" + monster.subtype + ")");
    }
    return subtype;
  };

  useEffect(() => {
    let monsterList = readMonsterFile();
    if (props.match) {
      setMonster(
        ...monsterList.filter((e) => e.name === props.match.params.id)
      );
    }
  });

  return (
    <div>
      <Card  className={classes.cardwidth}>
        {props.monster && (
          <CardHeader
            className={classes.cardheader}
            title={
              <div className={classes.cardheader}>
                <Typography variant="h4">
                  {/* <SvgIcon
                    style={{ "font-size": "1.5em" }}
                    color="action"
                  >
                    <Monster />
                  </SvgIcon> */}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {props.monster.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  &nbsp;( {props.monster.size} - {props.monster.type}
                  {isSubtype()}, {props.monster.alignment} )
                </Typography>
              </div>
            }
            subheader={
              <Typography variant="subtitle2" gutterBottom>
                Source: {props.monster.source}
              </Typography>
            }
          ></CardHeader>
        )}
        {props.monster && (
          <CardContent>
            <MainStats monster={props.monster} />
            <SpellCasting monster={props.monster} />
            <ActionsReactions monster={props.monster} />
            <LegendaryLair monster={props.monster} />
          </CardContent>
        )}
        {monster && (
          <CardContent>
            <MainStats monster={monster} />
            <SpellCasting monster={monster} />
            <ActionsReactions monster={monster} />
            <LegendaryLair monster={monster} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
