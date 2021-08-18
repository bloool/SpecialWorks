const malachite = extend(Item, "malachite", {
    color: Color.valueOf("216869")
});
const azurite = extend(Item, "azurite", {
    color: Color.valueOf("5368d4")
});
const goethite = extend(Item, "goethite", {
    color: Color.valueOf("686b7b")
});
const magnetite = extend(Item, "magnetite",{
    color: Color.valueOf("7685aa")
});

module.exports = {
    malachite: malachite,
    azurite  : azurite,
    goethite : goethite,
    magnetite: magnetite,
}