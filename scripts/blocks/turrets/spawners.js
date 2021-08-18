let sentry = require("libs/sentry")

const basicSentry = sentry.newSentry({
    gunInaccuracy : 5,
    reloadMultiplier : 2,
});

const advancedSentry = sentry.newSentry({
    sentryRange : 300,
    shootType : Bullets.standardDense,
    reloadTime : 30,
    lifetime : 30 * 60,
    shootSound : Sounds.shootBig,
    shots : 2,
    gunInaccuracy : 13,
    gunSprite : "titanium-gun",
    shootLength : 6,
});

const quickSentry = sentry.newSentry({
    sentryRange : 140,
    shootType : Bullets.standardHoming,
    reloadTime : 8,
    lifetime : 10 * 60,
    inaccuracy : 17,
    shootLength : 6,
    reloadMultiplier : 1.5,
    gunSprite : "silicon-gun",
})

const spawn = extend(ItemTurret, "spawn", {
    size : 3,
    health : 1200,

    reloadTime : 240,
	range : 110,
    gunInaccuracy : 0,
    velocityInaccuracy : 0.2,
    shootLength : 0,
    shootCone : 360,
    recoilAmount : 0,
    rotateSpeed: 20,

    shots : 1,
    ammoPerShot : 20,
    maxAmmo : 20,

    targetAir : false, 
	targetGround : true,
});

spawn.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 70,
    Items.copper, 120,
    Items.graphite, 60,
));

spawn.ammo(
    Items.copper, basicSentry,
    Items.titanium, advancedSentry,
    Items.silicon, quickSentry
);



const thoriumSentry = sentry.newSentry({
    sentryRange : 300,
    shootType : Bullets.standardThorium,
    reloadTime : 20,
    lifetime : 40 * 60,
    shootSound : Sounds.shootBig,
    shots : 3,
    gunInaccuracy : 10,
    velocityInaccuracy : 0.2,
    gunSprite : "thorium-gun",
    shootLength : 10,
    isBig : true,
});

const laser = extend(LaserBulletType, {
    colors : [Pal.plastaniumBack, Pal.plastaniumFront, Color.white],
    hitEffect : Fx.absorb,
    despawnEffect : Fx.none,
    damage: 60,
    hitSize : 16,
    lifetime : 36,
    length : 180,
    width : 10,
});

const laserSentry = sentry.newSentry({
    sentryRange : 200,
    shootType : laser,
    reloadTime : 30,
    lifetime : 25 * 60,
    shootSound : Sounds.laser,
    gunSprite : "laser-gun",
    shootLength : 10,
    isBig : true,
});

const phaseBullet = extend(BasicBulletType, {
    hitSize : 5,
    width : 8,
    height : 16,
    damage : 30,
    pierce : true,
    pierceCap : 3,
    pierceBuilding : true,
    knockback : -0.3,
    trailLength : 6,
    speed : 6,
});

const phaseSentry = sentry.newSentry({
    sentryRange : 200,
    shootType : phaseBullet,
    reloadTime : 7,
    gunInaccuracy : 5,
    velocityInaccuracy : 0.1,
    lifetime : 15 * 60,
    gunSprite : "phase-gun",
    shootLength : 10,
    isBig : true,
});

const sharp = extend(ShrapnelBulletType, {
    damage: 25,
    length: 90,
    width : 14,
});

const shrapnelSentry = sentry.newSentry({
    sentryRange : 80,
    shootType : sharp,
    reloadTime : 45,
    shots : 4,
    inaccuracy : 180,
    gunInaccuracy : 22,
    lifetime : 60 * 60,
    gunSprite : "shrapnel-gun",
    shootLength : 10,
    isBig : true,
});


const provoker = extend(ItemTurret, "provoker", {
    size : 4,
    health : 1200,

    reloadTime : 240,
	range : 220,
    inaccuracy : 0,
    velocityInaccuracy : 0.2,
    shootLength : 0,
    shootCone : 360,
    recoilAmount : 0,
    rotateSpeed: 20,

    shots : 1,
    ammoPerShot : 80,
    maxAmmo : 80,

    targetAir : true, 
	targetGround : true,
});

provoker.setupRequirements(Category.turret, ItemStack.with(
    Items.surgeAlloy, 200,
    Items.plastanium, 300,
    Items.silicon, 600,
));

provoker.ammo(
    Items.thorium, thoriumSentry,
    Items.plastanium, laserSentry,
    Items.phaseFabric, phaseSentry,
    Items.titanium, shrapnelSentry
);
