let items = require("libs/items")

//oxidiser (makes malachite)

const copperOxidiser = extend(GenericCrafter, "copper-oxidiser",{
    localizedName: "Copper Mass Oxideser",
    description: "Uses incredible amounts of water to oxidise copper and get malachite from it.",

    health : 450,
    size: 2,

    itemCapacity: 30,
    craftTime: 120,

    hasPower: true,
    hasItems: true,
    hasLiquids: true,

    outputItem : new ItemStack(items.malachite, 2),
})

copperOxidiser.setupRequirements(Category.crafting, ItemStack.with(
    Items.copper, 100,
    Items.silicon, 150,
    Items.plastanium, 80,
    Items.titanium, 50,
));

copperOxidiser.consumes.items(ItemStack.with(Items.copper, 10));
copperOxidiser.consumes.liquid(Liquids.water, 0.8);
copperOxidiser.consumes.power(5);