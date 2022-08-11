import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import makeStyles from "@mui/styles/makeStyles";
import { toLower } from "lodash";
import React, { useEffect } from "react";
import { ajax } from "rxjs/ajax";
import { loadConditions } from "../../../../services/ConditionService";
import { loadSpells } from "../../../../services/SpellService";
import AddSpell from "../../AddSpell";
import Button from "@mui/material/Button";
import { Editor, EditorState } from "draft-js";
import { draft } from "draft-js/dist/Draft.css";
import ReactDOM from "react-dom";
import { Monster } from "../../../templates/monster";
import Divider from "@mui/material/Divider";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
  },
  root: {
    flexGrow: 1,
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
  padding16: {
    padding: "16px",
  },
  divider: {
    paddingTop: "16px",
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

export default function MonsterForm(props) {
  const onClose = props.onClose;
  const [monName, setMonName] = React.useState("");
  const [monType, setMonType] = React.useState("");
  const [monSubType, setMonSubType] = React.useState([]);
  const [monSize, setMonSize] = React.useState([]);
  const [monAlignment, setMonAlignment] = React.useState([]);
  const [monCR, setMonCR] = React.useState("");
  const [monXP, setMonXP] = React.useState("");
  const [monAC, setMonAC] = React.useState("");
  const [monAvgHP, setMonAvgHP] = React.useState("");
  const [monHitDieCount, setMonHitDieCount] = React.useState();
  const [monHitDie, setMonHitDie] = React.useState([]);
  const [monSpeed, setMonSpeed] = React.useState("");
  const [monStr, setMonStr] = React.useState("");
  const [monDex, setMonDex] = React.useState("");
  const [monCon, setMonCon] = React.useState("");
  const [monInt, setMonInt] = React.useState("");
  const [monWis, setMonWis] = React.useState("");
  const [monCha, setMonCha] = React.useState("");
  const [monSavingThrows, setMonSavingThrows] = React.useState([]);
  const [monSkills, setMonSkills] = React.useState("");
  const [monSenses, setMonSenses] = React.useState("");
  const [monLanguages, setMonLanguages] = React.useState("");
  const [damageImmunities, setDamageImmunities] = React.useState([]);
  const [damageVulnerabilties, setDamageVulnerabilties] = React.useState([]);
  const [damageResistances, setDamageResistances] = React.useState([]);
  const [condidtionImmunities, setCondidtionImmunities] = React.useState([]);
  const [monSpecialTraits, setMonSpecialTraits] = React.useState([]);
  const [monActions, setMonActions] = React.useState([]);
  const [monReactions, setMonReactions] = React.useState([]);
  const [monLegendaryActions, setMonLegendaryActions] = React.useState([]);
  const [monLairActions, setMonLairActions] = React.useState("");
  const [monSource, setMonSource] = React.useState("Custom");

  const [damageTypes, setDamageTypes] = React.useState([]);
  const [conditions, setConditions] = React.useState([]);
  const [spells, setSpells] = React.useState([]);
  const [selectedList, setSelectedList] = React.useState([]);
  const [selectedSpells, setSelectedSpells] = React.useState([]);
  const [isSpellCaster, setIsSpellCaster] = React.useState(false);
  const [isLegendary, setIsLegendary] = React.useState(false);
  const [hasLair, setHasLair] = React.useState(false);

  const classes = useStyles();

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  let monsterTypes = [];
  let monsterSubtypes = [];
  let monsterSizes = [];
  let monsterAlignments = [];
  let monsterCRs = [];
  let monsterHitDiceValues = ["d4", "d6", "d8", "d10", "d12", "d20"];
  let monsterStatTypes = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  props.monsterList.forEach((element) => {
    if (!monsterTypes.includes(element.type.toLowerCase()))
      monsterTypes.push(element.type.toLowerCase());
    if (
      !monsterSubtypes.includes(element.subtype[0]) &&
      element.subtype[0] !== null
    )
      if (element.subtype[0] !== undefined)
        monsterSubtypes.push(element.subtype[0]);
    if (!monsterSizes.includes(element.size) && element.size !== null && element.size !== "")
      monsterSizes.push(element.size);
    if (
      !monsterAlignments.includes(element.alignment) &&
      element.alignment.length > 0
    )
      monsterAlignments.push(element.alignment);
  });

  useEffect(() => {
    ajax
      .getJSON("https://www.dnd5eapi.co/api/damage-types")
      .subscribe((types) => {
        setDamageTypes(types.results.map((item) => toLower(item.name)));
      });
    loadConditions().subscribe((conditions) => {
      setConditions(conditions.results.map((item) => item.name));
    });
    loadSpells().subscribe((spells) => {
      setSpells(spells.results);
    });
    if (props.selectedMon) {
      if (props.selectedMon.spell_casting.spells.length > 0) {
        setIsSpellCaster(true);
      }
      setMonName(props.selectedMon.name);
      setMonType(props.selectedMon.type);
      setMonSubType(props.selectedMon.subtype);
      setMonSize(props.selectedMon.size);
      setMonAlignment(props.selectedMon.alignment);
      setMonCR(props.selectedMon.challenge_rating);
      setMonXP(props.selectedMon.xp);
      setMonAC(props.selectedMon.armor_class);
      setMonAvgHP(props.selectedMon.hit_points);
      setMonHitDieCount(props.selectedMon.hit_dice_count);
      setMonHitDie(props.selectedMon.hit_die);
      setMonSpeed(props.selectedMon.speed);
      setMonStr(props.selectedMon.stats.strength);
      setMonDex(props.selectedMon.stats.dexterity);
      setMonCon(props.selectedMon.stats.constitution);
      setMonInt(props.selectedMon.stats.intelligence);
      setMonWis(props.selectedMon.stats.wisdom);
      setMonCha(props.selectedMon.stats.charisma);
      setMonSavingThrows(props.selectedMon.saving_throws);
      var skillText = "";
      props.selectedMon.proficiencies.forEach((prof, index) => {
        skillText += prof.name + " +" + prof.value;
        if (props.selectedMon.proficiencies.length != index + 1) {
          skillText += ",";
        }
      });
      setMonSkills(skillText);
      setMonSenses(props.selectedMon.senses);
      setMonLanguages(props.selectedMon.languages);
      setDamageImmunities(props.selectedMon.damage_immunities);
      setDamageVulnerabilties(props.selectedMon.damage_vulnerabilities);
      setDamageResistances(props.selectedMon.damage_resistances);
      setCondidtionImmunities(props.selectedMon.condition_immunities);
      setMonSpecialTraits(convertToText(props.selectedMon.special_abilities));
      setSelectedSpells(props.selectedMon.spell_casting.spells);
      setMonActions(convertToText(props.selectedMon.actions));
      setMonReactions(convertToText(props.selectedMon.reactions));
      setMonLegendaryActions(
        convertToText(props.selectedMon.legendary_actions.actions)
      );
      setMonLairActions(props.selectedMon.lair_actions);
      setMonSource(props.selectedMon.source);
    }
  }, [props.selectedMon]);

  const handleClose = () => {
    onClose();
  };

  const handleNameChange = (e) => {
    setMonName(e.target.value);
    props.handleFormDirty(true);
  };

  const handleTypeChange = (e, value) => {
    if (e.target.value) {
      setMonType(e.target.value);
    } else {
      setMonType(value);
    }
    props.handleFormDirty(true);
  };

  const handleSubTypeChange = (e, value) => {
    setMonSubType(value);
    props.handleFormDirty(true);
  };

  const handleMonSizeChange = (e, value) => {
    if (e.target.value) {
      setMonSize(e.target.value);
    } else {
      setMonSize(value);
    }
    props.handleFormDirty(true);
  };

  const handleMonAlignmentChange = (e, value) => {
    if (e.target.value) {
      setMonAlignment(e.target.value);
    } else {
      setMonAlignment(value);
    }
    props.handleFormDirty(true);
  };

  const handleMonCRChange = (e) => {
    setMonCR(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonXPChange = (e) => {
    setMonXP(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonACChange = (e) => {
    setMonAC(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonAvgHPChange = (e) => {
    setMonAvgHP(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonHitDiceCountChange = (e) => {
    setMonHitDieCount(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonHitDieChange = (e, value) => {
    setMonHitDie(value);
    props.handleFormDirty(true);
  };

  const handleMonSpeedChange = (e) => {
    setMonSpeed(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonStrChange = (e) => {
    setMonStr(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonDexChange = (e) => {
    setMonDex(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonConChange = (e) => {
    setMonCon(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonIntChange = (e) => {
    setMonInt(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonWisChange = (e) => {
    setMonWis(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonChaChange = (e) => {
    setMonCha(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonSavingThrowChange = (e, value) => {
    setMonSavingThrows(value);
    props.handleFormDirty(true);
  };

  const handleMonSkillsChange = (e) => {
    setMonSkills(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonSensesChange = (e) => {
    setMonSenses(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonLanguagesChange = (e) => {
    setMonLanguages(e.target.value);
    props.handleFormDirty(true);
  };

  const handleDamageImmunSelected = (e, value) => {
    setDamageImmunities(value);
    props.handleFormDirty(true);
  };

  const handleDamageVulnSelected = (e, value) => {
    setDamageVulnerabilties(value);
    props.handleFormDirty(true);
  };

  const handleDamageResSelected = (e, value) => {
    setDamageResistances(value);
    props.handleFormDirty(true);
  };

  const handleConditionImmunSelected = (e, value) => {
    setCondidtionImmunities(value);
    props.handleFormDirty(true);
  };

  const handleMonSpecialTraitsChange = (e, value) => {
    setMonSpecialTraits(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonActionsChange = (e, value) => {
    setMonActions(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonReactionsChange = (e, value) => {
    setMonReactions(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonLegendaryActionsChange = (e, value) => {
    setMonLegendaryActions(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonLairActionsChange = (e, value) => {
    setMonLairActions(e.target.value);
    props.handleFormDirty(true);
  };

  const handleMonSourceChange = (e, value) => {
    setMonSource(e.target.value);
    props.handleFormDirty(true);
  };

  const handleCreateMonsterClicked = (e) => {
    document.getElementById("submitButton").click();
  };

  const handleSpellCheckbox = (e) => {
    setIsSpellCaster(e.target.checked);
  };

  const handleLegendaryCheckbox = (e) => {
    setIsLegendary(e.target.checked);
  };

  const handleLairCheckbox = (e) => {
    setHasLair(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let tempMonster = new Monster();
    tempMonster.name = monName.toString();
    tempMonster.index = toLower(monName.toString());
    tempMonster.type = monType.toString();
    tempMonster.subtype = monSubType;
    tempMonster.size = monSize.toString();
    tempMonster.alignment = monAlignment.toString();
    tempMonster.challenge_rating = monCR;
    tempMonster.armor_class = monAC;
    tempMonster.hit_points = monAvgHP;
    tempMonster.hit_dice_count = monHitDieCount;
    tempMonster.hit_die = monHitDie;
    tempMonster.speed = monSpeed;
    tempMonster.stats.strength = monStr;
    tempMonster.stats.dexterity = monDex;
    tempMonster.stats.constitution = monCon;
    tempMonster.stats.intelligence = monInt;
    tempMonster.stats.wisdom = monWis;
    tempMonster.stats.charisma = monCha;
    tempMonster.saving_throws = monSavingThrows;
    tempMonster.proficiencies = parseSkillsDescription(monSkills);
    tempMonster.senses = monSenses;
    tempMonster.languages = monLanguages;
    tempMonster.damage_immunities = damageImmunities;
    tempMonster.damage_vulnerabilities = damageVulnerabilties;
    tempMonster.damage_resistances = damageResistances;
    tempMonster.condition_immunities = condidtionImmunities;
    tempMonster.special_abilities = parseTextDescription(monSpecialTraits);
    tempMonster.actions = parseTextDescription(monActions);
    tempMonster.reactions = parseTextDescription(monReactions);
    tempMonster.legendary_actions.actions =
      parseTextDescription(monLegendaryActions);
    tempMonster.lair_actions = monLairActions;
    tempMonster.spell_casting.spells = selectedSpells;
    tempMonster.source = monSource;

    let newMonList = JSON.parse(JSON.stringify(props.monsterList));
    if (props.selectedMon) {
      tempMonster.user_created = props.selectedMon.user_created;
      newMonList.forEach((mon, index) => {
        if (mon.index === props.selectedMon.index) {
          newMonList[index] = tempMonster;
        }
      });
    } else {
      tempMonster.user_created = true;
      newMonList.push(tempMonster);
    }

    props.updateMonsterList(newMonList, tempMonster);
    props.handleFormDirty(false);
    handleClose();
  };

  function convertToText(array) {
    if (array == undefined || array.length == 0) {
      return "";
    }
    var text = "";
    array.forEach((action, index) => {
      text += action.name + ". " + action.desc;
      if (array.length !== index + 1) text += "\n\n";
    });
    return text;
  }

  function parseTextDescription(text) {
    if (text == undefined || text == "") {
      return [];
    }
    text = text.trim();
    let sections = text.split(/[\r\n]+/);
    let parsedSections = [];
    sections.forEach((section) => {
      let sectionObject = {
        name: "",
        desc: "",
      };
      sectionObject.name = section.substring(0, section.indexOf("."));
      sectionObject.desc = section.substring(section.indexOf(".") + 1).trim();
      parsedSections.push(sectionObject);
    });
    return parsedSections;
  }

  function parseSkillsDescription(text) {
    if (text == undefined || text == "") {
      return [];
    }
    let sections = text.split(",");
    let parsedSections = [];
    sections.forEach((section) => {
      section = section.trim();
      let sectionObject = {
        name: "",
        value: "",
      };
      sectionObject.name = section.substring(0, section.indexOf(" "));
      sectionObject.value = section.substring(section.indexOf(" ") + 2);
      parsedSections.push(sectionObject);
    });
    return parsedSections;
  }

  function getNumberWithOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return (
    <div>
      <Card>
        <form onSubmit={handleSubmit} id="my-form">
          <Box
            className={classes.padding16}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  name="name"
                  onChange={handleNameChange}
                  value={monName || ""}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  id="combo-box-demo"
                  options={monsterTypes}
                  getOptionLabel={(option) => option}
                  onChange={handleTypeChange}
                  value={monType || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type"
                      variant="outlined"
                      name="type"
                      onChange={handleTypeChange}
                      value={monType || ""}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  id="combo-box-demo"
                  multiple
                  disableCloseOnSelect
                  options={monsterSubtypes}
                  getOptionLabel={(option) => option}
                  onChange={handleSubTypeChange}
                  value={monSubType}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Sub-Type(s)"
                      name="sub_types"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  id="combo-box-demo"
                  options={monsterAlignments}
                  getOptionLabel={(option) => option}
                  onChange={handleMonAlignmentChange}
                  value={monAlignment}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Alignment"
                      variant="outlined"
                      name="alignment"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  id="combo-box-demo"
                  options={monsterSizes}
                  getOptionLabel={(option) => option}
                  onChange={handleMonSizeChange}
                  value={monSize}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Size"
                      variant="outlined"
                      name="size"
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Source"
                  variant="outlined"
                  name="source"
                  onChange={handleMonSourceChange}
                  value={monSource || "Custom"}
                  required
                />
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid className={classes.divider} container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Armor Class"
                  variant="outlined"
                  name="armor_class"
                  onChange={handleMonACChange}
                  value={monAC || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Average HP"
                  variant="outlined"
                  name="hit_points"
                  onChange={handleMonAvgHPChange}
                  value={monAvgHP || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="HP Die Count"
                  variant="outlined"
                  name="hit_dice_count"
                  onChange={handleMonHitDiceCountChange}
                  value={monHitDieCount || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  id="combo-box-demo"
                  options={monsterHitDiceValues}
                  getOptionLabel={(option) => option}
                  onChange={handleMonHitDieChange}
                  value={monHitDie}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="HP Die Value"
                      variant="outlined"
                      name="hit_dice_value"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Speed"
                  variant="outlined"
                  name="speed"
                  onChange={handleMonSpeedChange}
                  value={monSpeed || ""}
                  required
                />
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid className={classes.divider} container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="STR Score"
                  variant="outlined"
                  name="strength"
                  onChange={handleMonStrChange}
                  value={monStr || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="DEX Score"
                  variant="outlined"
                  name="dexterity"
                  onChange={handleMonDexChange}
                  value={monDex || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="CON Score"
                  variant="outlined"
                  name="constitution"
                  onChange={handleMonConChange}
                  value={monCon || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="INT Score"
                  variant="outlined"
                  name="intelligence"
                  onChange={handleMonIntChange}
                  value={monInt || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="WIS Score"
                  variant="outlined"
                  name="wisdom"
                  onChange={handleMonWisChange}
                  value={monWis || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="CHA Score"
                  variant="outlined"
                  name="charisma"
                  onChange={handleMonChaChange}
                  value={monCha || ""}
                  required
                />
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid className={classes.divider} container spacing={3}>
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  disableCloseOnSelect
                  options={monsterStatTypes}
                  getOptionLabel={(option) => option}
                  onChange={handleMonSavingThrowChange}
                  value={monSavingThrows}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Saving Throws"
                      name="saving_throws"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Skills"
                  variant="outlined"
                  name="skills"
                  onChange={handleMonSkillsChange}
                  value={monSkills || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={damageTypes}
                  getOptionLabel={(option) => option}
                  onChange={handleDamageImmunSelected}
                  value={damageImmunities}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Damage Immun."
                      name="damage_immunities"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={damageTypes}
                  getOptionLabel={(option) => option}
                  onChange={handleDamageVulnSelected}
                  value={damageVulnerabilties}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Damage Vuln."
                      name="damage_vulnerabilities"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={damageTypes}
                  getOptionLabel={(option) => option}
                  onChange={handleDamageResSelected}
                  value={damageResistances}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Damage Res."
                      name="damage_resistances"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={conditions}
                  getOptionLabel={(option) => option}
                  onChange={handleConditionImmunSelected}
                  value={condidtionImmunities}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Condition Immun."
                      name="condition_immunities"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Senses"
                  variant="outlined"
                  name="senses"
                  onChange={handleMonSensesChange}
                  value={monSenses || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Languages"
                  variant="outlined"
                  name="languages"
                  onChange={handleMonLanguagesChange}
                  value={monLanguages || ""}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Challenge Rating"
                  variant="outlined"
                  name="challenge_rating"
                  onChange={handleMonCRChange}
                  value={monCR || ""}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="XP"
                  variant="outlined"
                  name="xp"
                  onChange={handleMonXPChange}
                  value={monXP || ""}
                />
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={3} className={classes.divider}>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  id="outlined-multiline-static"
                  label="SPECIAL TRAITS DESCRIPTION"
                  multiline
                  rows={6}
                  variant="outlined"
                  name="special_traits_description"
                  onChange={handleMonSpecialTraitsChange}
                  value={monSpecialTraits || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <AddSpell
                      handleFormDirty={props.handleFormDirty}
                      setSelectedSpells={setSelectedSpells}
                      selectedSpells={selectedSpells}
                      spells={spells}
                    ></AddSpell>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  id="outlined-multiline-static"
                  label="ACTIONS DESCRIPTION"
                  multiline
                  rows={6}
                  variant="outlined"
                  name="actions_description"
                  onChange={handleMonActionsChange}
                  value={monActions || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  id="outlined-multiline-static"
                  label="REACTIONS DESCRIPTION"
                  multiline
                  rows={6}
                  variant="outlined"
                  name="reactions_description"
                  onChange={handleMonReactionsChange}
                  value={monReactions || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  id="outlined-multiline-static"
                  label="LEGENDARY ACTIONS DESCRIPTION"
                  multiline
                  rows={6}
                  variant="outlined"
                  name="legendary_actions_description"
                  onChange={handleMonLegendaryActionsChange}
                  value={monLegendaryActions || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  id="outlined-multiline-static"
                  label="LAIR ACTIONS DESCRIPTION"
                  multiline
                  rows={6}
                  variant="outlined"
                  name="lair_actions_description"
                  onChange={handleMonLairActionsChange}
                  value={monLairActions || ""}
                ></TextField>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Card>
    </div>
  );
}
