import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import List from '@material-ui/core/List';

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
  },
  link: {
    color: theme.palette.secondary.main,
  },
  cardwidth: {
    width: 'inherit',
  },
  root: {
    flexGrow: 1,
  },
  char: {
    display: 'flex',
    'align-items': 'center',
  },
  charname: {
    padding: '.5em',
    'font-size': '1em',
  },
  col: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    'align-items': 'center',
    display: 'inline-flex',
    'justify-items': 'center',
    'white-space': 'nowrap',
  },
  char_portrait: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    'border-style': 'solid',
    'border-color': 'darkgrey',
    'border-width': '.25em',
  },
  paper_padding: {
    padding: '1em',
  },

  background_blue: {
    'background-color': 'blue',
  },
  headingColor: {
    color: theme.palette.primary.main,
    'font-weight': 'bold',
  },
}));

export default function ActionsReactions(props) {
  const theme = useTheme();
  const classes = useStyles(theme);

  let actions = [];
  let reactions = [];

  if (props.monster) {
    if (props.monster.actions !== undefined) {
      props.monster.actions.forEach(item => {
        actions.push(item);
      });
    }

    if (props.monster.reactions !== undefined) {
      props.monster.reactions.forEach(item => {
        reactions.push(item);
      });
    }
  }

  return (
    <div>
      {actions.length !== 0 &&
        <div>
          <Typography variant="h6">Actions</Typography>
          <List>
            {actions.map((item, index) => (
              <ListItem dense={true}>
                <div>
                  <Typography variant="body1" className={classes.headingColor}>
                    {item.name}:
                  </Typography>
                  <Typography variant="body2"> {item.desc} </Typography>
                </div>
              </ListItem>
            ))}
          </List>
        </div>}

      {reactions.length !== 0 &&
        <div>
          <Typography variant="h6">Reactions</Typography>
          <List>
            {reactions.map((item, index) => (
              <ListItem dense={true}>
                <div>
                  <Typography variant="body1" className={classes.headingColor}>
                    {item.name}:
                  </Typography>
                  <Typography variant="body2"> {item.desc} </Typography>
                </div>
              </ListItem>
            ))}
            <Divider />
          </List>
        </div>}
    </div>
  );
}
