let sentry = require("libs/sentry");

const trigger = extend(UnitType, "trigger", {
    type: "flying",

	accel: 0.1,
	range: 50,
	speed: 3,
	drag: 0.1,
	rotateSpeed: 8,
	hitSize: 20,

	mineSpeed: 12,
	mineTier: 3,
	buildSpeed: 1.50,
	payloadCapacity : 128,

	health: 800,
	commandLimit: 8,
    isCounted : false,

	flying: true,
	engineOffset : 8,
});
trigger.constructor = () => extend(PayloadUnit, {});
trigger.defaultController = () => extend(RepairAI, {});

const healUpdate = new Effect(30, e => {
    Draw.color(Pal.heal);
    Draw.rect(Core.atlas.find("circle-shadow"), e.x, e.y, 10 * e.fout(), 10 * e.fout(), 0);
});

const healBolt = extend(BasicBulletType, {
    damage : 10,
    homingPower : 0.08,
    healPercent : 0.8,
    speed : 5,
    collidesTeam : true,
    lifetime : 60,
    trailLength : 6,
    trailColor : Pal.heal,

    update(b){
        healUpdate.at(b.x, b.y);
        this.super$update(b);
    }
})

const healerSentry = sentry.newSentry({
    sentryRange : 200,
    shootType : healBolt,
    reloadTime : 30,
    lifetime : 8.5 * 60,
    shootSound : Sounds.laser,
    gunSprite : "heal-gun",
    shootLength : 10,
});

const sentryDeployer = extend(Weapon, {
    shootSound : Sounds.shootBig,
    top : false,
    mirror : false,
    shootY : 0,
    rotate : true,
    inaccuracy : 360,
    shootCone : 360,
    x : 0,
    y : 0,
    reload : 280,
    recoil : 0,
    bullet : healerSentry
});
trigger.weapons.add(sentryDeployer)


const citadel = extend(UnitType, "citadel", {
    type: "flying",

    armor : 16,
    health : 24000,
    speed : 0.8,
    rotateSpeed : 1,
    accel : 0.04,
    drag : 0.018,
    flying : true,
    engineOffset : 46,
    engineSize : 7.8,
    rotateShooting : false,
    hitSize : 66,
    payloadCapacity : (5.3 * 5.3) * 24,
    buildSpeed : 4,
    drawShields : false,
    commandLimit : 6,
    lowAltitude : true,
    buildBeamOffset : 43,
    ammoCapacity : 1,

});
citadel.constructor = () => extend(PayloadUnit, {});
citadel.defaultController = () => extend(DefenderAI, {});
citadel.abilities.add(new ForceFieldAbility(140, 4, 7000, 60 * 8), new RepairFieldAbility(130, 60 * 2, 140));

const healBoltBig = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 12,
    height : 12,
    backColor : Pal.heal,
    damage : 10,
    homingPower : 0.1,
    healPercent : 2.5,
    speed : 7,
    collidesTeam : true,
    lifetime : 60,
    trailLength : 4,
    trailWidth : 4,
    trailColor : Pal.heal,
})

const healerSentryBig = sentry.newSentry({
    sentryRange : 200,
    shootType : healBoltBig,
    reloadTime : 5,
    speed : 0,
    lifetime : 20 * 60,
    gunInaccuracy : 15,
    shootSound : Sounds.laser,
    gunSprite : "heal-gun-big",
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

const sentryBomb = extend(BulletType, {
    instantDisappear : true,
    init(b){
        if(!b)return;
        for(let i = 0; i < 4; i++){
            phaseSentry.create(b, b.x, b.y, i * 90 + 45)
        }
        healerSentryBig.create(b, b.x, b.y, 0)
        this.super$init(b)
    }
});

const sentryDeployerBig = extend(Weapon, {
    shootSound : Sounds.shootBig,
    top : false,
    mirror : false,
    shootY : 0,
    rotate : true,
    shootCone : 360,
    x : 0,
    y : 0,
    reload : 280,
    recoil : 0,
    bullet : sentryBomb
});
citadel.weapons.add(sentryDeployerBig)