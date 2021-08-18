let colors = require("libs/colors");
let items  = require("libs/items");

const sharp = extend(ShrapnelBulletType, {
    damage: 15,
    length: 80,
    width : 14,
    serrations: 0,
    toColor : colors.azuriteLight,
    shootEffect : Fx.none,
    smokeEffect : Fx.none,
});

const multiSharp = extend(ShrapnelBulletType, {
    damage: 20,
    length: (sharp.length / 3) * 5,
    width : 18,
    toColor : colors.azuriteDark,
    shootEffect : Fx.none,
    smokeEffect : Fx.none,
    serrations: 12,

    init(b){
        if(!b)return;
        this.super$init(b)
        sharp.create(b, b.x, b.y, b.rotation() + 22, 1, 1);
        sharp.create(b, b.x, b.y, b.rotation() - 22, 1, 1);
    },
});

const trident = extend(ItemTurret, "trident", {
    size : 4,
    health : 8000,

    reloadTime : 20,
	range : 100,
    recoilAmount : 0,

    targetAir : true,
	targetGround : true,

    shootLength : 0,
    shootCone : 360,
    inaccuracy : 0,
    rotateSpeed: 0,

    shootSound : Sounds.shootBig,
    shootShake: 4,   
});

trident.buildType = () => extend(ItemTurret.ItemTurretBuild, trident, {
    shoot(bullet){
        for(let i = 0; i < 4; i++){
            bullet.create(this, this.team, this.x + Angles.trnsx(i * 90, 15), this.y + Angles.trnsy(i * 90, 15), i * 90)
            this.effects();
            this.useAmmo();
        }
    }
})

trident.setupRequirements(Category.turret, ItemStack.with(
    Items.surgeAlloy,        120,
    Items.silicon,      300,
    items.azurite,      200,
    Items.plastanium,   180,
));

trident.ammo(
    items.azurite, multiSharp
);

const spike = extend(BasicBulletType, {
    width : 12,
    height: 20,

    damage: 5,
    speed: 5,

    backColor : colors.azuriteLight,

    draw(b){
        Draw.color(colors.azuriteLight)
        Drawf.tri(b.x, b.y, 6, 16, b.rotation())
        Drawf.tri(b.x, b.y, 6, 3, b.rotation() - 180)
    }
})

const multiSpike = extend(BasicBulletType, {
    width : spike.width,
    height: spike.height + 4,

    damage: spike.damage,
    speed: spike.speed,

    backColor : spike.backColor,

    shootEffect : spike.shootEffect,

    dst : 4,

    draw(b){
        Draw.color(colors.azuriteLight)
        Drawf.tri(b.x, b.y, 6, 16, b.rotation())
        Drawf.tri(b.x, b.y, 6, 3, b.rotation() - 180)
    },
    init(b){
        if(!b)return;
        this.super$init(b)

        spike.create(b,
        b.x + Angles.trnsx(b.rotation() + 90, this.dst),
        b.y + Angles.trnsy(b.rotation() + 90, this.dst),
        b.rotation(), 1, 1
        );
        spike.create(b,
        b.x + Angles.trnsx(b.rotation() - 90, this.dst),
        b.y + Angles.trnsy(b.rotation() - 90, this.dst),
        b.rotation(), 1, 1
        );
    },
})

const tine = extend(ItemTurret, "tine", {
    size : 3,
    health : 2000,

    reloadTime : 30,
	range : 200,

    targetAir : true,
	targetGround : true,

    burstSpacing : 3,
    shots : 4,

    shootSound : Sounds.shootBig,
    shootShake: 0.5,   
});

tine.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon,      120,
    items.azurite,      80,
));

tine.ammo(
    items.azurite, multiSpike
);

