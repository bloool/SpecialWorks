let colors  = require("libs/colors");
let status  = require("libs/statusEffects")
let dynamic = require("libs/dynamicEffects")

const esse = extend(UnitType, "esse", {
    type: "flying",

	accel: 0.1,
	range: 150,
	speed: 4,
	drag: 0.1,
	rotateSpeed: 20,
	hitSize: 20,

	health: 420,
	commandLimit: 8,

	flying: true,
	engineOffset : 8,

    immunities : ObjectSet.with(status.malachiteEffect),

    update(u){
        this.super$update(u)

        Units.nearby(u.team, u.x, u.y, u.hitSize*2, cons(other => {
            other.apply(status.malachiteHeal, 3600);
        }))

        const healRange = new Effect(2, e => {
            Draw.color(Color.valueOf("9cc5a180")); //malachiteLight but with 50% opacity
            Lines.stroke(e.fout());
            Lines.circle(e.x, e.y, u.hitSize*2);
        });

        healRange.at(u.x, u.y)
    }
});
esse.constructor = () => extend(PayloadUnit, {});
esse.defaultController = () => extend(BuilderAI, {});

const laser = extend(LaserBulletType, {
    length : 180,
    width : 12,

    damage: 20,
    hitSize : 16,
    lifetime : 36,

    healPercent : 5,
    collidesTeam : true,

    status : status.malachiteEffect,
    statusDuration : 3600,

    colors : [colors.malachiteDark, colors.malachiteMid, colors.malachiteLight],
    despawnEffect : Fx.none,
});

const laserGun = extend(Weapon, {
    shootSound : Sounds.sap,
    top : false,
    mirror : false,
    shootY : 0,
    x : 0,
    y : 0,
    reload : 25,
    recoil : 0,
    bullet : laser
});

esse.weapons.add(laserGun);

const civorus = extend(UnitType, "civorus", {
    speed : 0.52,
    accel : 0.04,
    drag : 0.04,
    rotateSpeed : 1,
    flying : true,
    lowAltitude : true,
    health : 21000,
    engineOffset : 38,
    engineSize : 7.3,
    hitSize : 58,
    destructibleWreck : false,
    armor : 13,
    targetFlag : BlockFlag.reactor,
    immunities : ObjectSet.with(status.malachiteEffect),
})
civorus.constructor = () => extend(UnitEntity, {});

const malachiteTrail = new Effect(15, 100, e => {
    Draw.color(colors.malachiteMid);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, e.finpow() * 2);
});

const rotatingShine = new Effect(40, 100, e => {
    let size = 160

    Draw.color(colors.malachiteLight);
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, size/8 * e.fout(), size, e.rotation + i*90 + 80 * e.fout());
    }

    Draw.color();
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, size/8/2 * e.fout(), size/2, e.rotation + i*90 + 80 * e.fout());
    }
});

const chargedHit = new Effect(18, 200, e => {
    Draw.color(colors.malachiteLight);

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 10 * e.fout(), 60, e.rotation + 140 * i);
    }
});

const bomb = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 24,
    height : 24,
    speed : 5,
    lifetime : 60,
    drag : 0.008,

    pierce: true,
    pierceCap: 2,
    pierceBuilding : true,

    splashDamage : 60,
    splashDamageRadius : 20,

    homingPower : 0.3,
	homingRange : 200,
    homingDelay : 18,

    hitEffect : dynamic.circleBoom(20, 4, colors.malachiteLight),
	despawnEffect : dynamic.shine(40, colors.malachiteLight),
    backColor : colors.malachiteMid,

    weaveScale : 3,
    weaveMag : 3,
    shrinkY : 0,

    status : status.malachiteEffect,
    statusDuration : 3600,

    init(b){
        if(!b)return;
        b.data = new Trail(8);
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);
        malachiteTrail.at(b.x + Mathf.range(5), b.y + Mathf.range(5))
    },
    draw(b){
        b.data.draw(colors.malachiteMid, 4);
        this.super$draw(b);
    }
});

const chargedBomb = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 28,
    height : 28,
    speed : 7,
    lifetime : 80,
    recoil: 5,

    splashDamage : 1200,
    splashDamageRadius : 80,

    hitEffect : dynamic.shine(200, colors.malachiteLight),
	despawnEffect : dynamic.circleBoom(80, 0, colors.malachiteLight, 100),
    shootEffect: rotatingShine,
    backColor : colors.malachiteMid,

    shrinkY : 0,

    status : status.malachiteEffect,
    statusDuration : 12000,

    spacing : 5,
    timer : 0,
    delay : 20,
    bombAmount: 16,

    init(b){
        if(!b)return;
        b.data = this.bombAmount;
    },
    update(b){
        this.super$update(b);

        this.timer += Time.delta;

        dynamic.shine(40, colors.malachiteLight).at(b.x + Mathf.range(15), b.y + Mathf.range(15), Mathf.random(0, 360))

        if(this.timer >= this.spacing && b.time > this.delay && b.data > 0){
            for(let i of Mathf.signs){
                bomb.create(b, b.x, b.y, b.rotation() + 140 * i , 1, 1)
            }
            chargedHit.at(b.x, b.y, b.rotation)
            this.timer = 0
            b.data -= 2
        }
    },
    despawned(b){
        this.super$despawned(b);
        for(let i = 0; i < b.data; i++){
            bomb.create(b, b.x, b.y, Mathf.random(0, 360), 1, 1)
        }
    }
});

const booba = extend(Weapon, {
    shootSound : Sounds.laser,
    top : false,
    mirror : false,
    shootY : 0,
    x : 0,
    y : 0,
    reload : 180,
    cooldownTime : 180,
    recoil : 0,
    bullet : chargedBomb
});

civorus.weapons.add(booba)