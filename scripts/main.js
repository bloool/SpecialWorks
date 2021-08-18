let scripts = [
    "blocks/turrets/greens", "blocks/turrets/blues", "blocks/turrets/reds", "blocks/turrets/star", "blocks/turrets/others", "blocks/turrets/magnetics", "blocks/turrets/electrics",
    "blocks/turrets/spawners", "blocks/turrets/gravity", "blocks/turrets/melee",
    "blocks/envirioment",
    "blocks/production",
    "blocks/effect/effect",
    "units/greens", "units/reds", "units/blues", "units/star", "units/magnetics", "units/spawners",
    "blocks/walls/magnetic", "blocks/walls/blast", "blocks/walls/laminated",

    "techtree", //must be loaded at the bottom or else fucks everything up
];

for(let i of scripts){
    require(i)
}