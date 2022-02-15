export class Monster {
    name = "";
    size = "";
    type = "";
    subtype = "";
    alignment = "";
    armor_class = 0;
    hit_points = 0;
    hit_dice = 0;
    speed = "";
    stats = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
    };
    saving_throws = [];
    proficiencies = [];
    damage_resistances = [];
    damage_immunities = [];
    damage_vulnerabilities = [];
    condition_immunities = [];
    senses = "";
    languages = "";
    challenge_rating = 0;
    xp = 0;
    special_abilities = [];
    spell_casting = {
        spells: [],
        slots: []
    };
    actions = [];
    reactions = [];
    legendary_actions = {
        actions_per_turn: ["X", "X", "X"],
        actions: []
    };
    lair_actions = [];
    bg_color = ""
}