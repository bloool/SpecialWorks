let status = require("libs/statusEffects")

const ichor = extend(UnitType, "ichor", {
    type: "mech",

	speed : 0.45,
	range : 30,
	maxRange : 30,
	aimDst: 30,
	hitSize : 15,
	rotateSpeed : 2.1,
	health : 12000,
	armor : 10,
	canDrown : false,
	mechFrontSway : 1,

	mechStepParticles : true,
	mechStepShake : 0.15,
	singleTarget : false
});

ichor.constructor = () => extend(MechUnit, {});

const sharpTrail = new Effect(16, e => {
    Draw.color(Color.valueOf("c32f2c80"));

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 20 * e.fout(), 24, e.rotation + 90 + 90 * i);
    }
});

const sharpHit = new Effect(16, e => {
    Draw.color(Color.valueOf("c32f2c"));

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 10 * e.fout(), 24, e.rotation + 140 * i);
    }
});

const bladeSharp = extend(RailBulletType, {
    shootEffect : Fx.none,
    smokeEffect : Fx.none,
    length : 50,
    updateEffectSeg : 1,
    pierceEffect : sharpHit,
    updateEffect : sharpTrail,
    hitEffect : Fx.none,
    damage : 125,
    pierceDamageFactor : 0,
    status : status.bombarded,
    recoil: -1,
});

const bladeTop = extend(Weapon, {
    name : "spec-blade-top",
    shootSound : Sounds.release,
    top : true,
    mirror : true,
    shootY : 22,
    x : -23,
    y : 14,
    reload : 20,
    alternate : true,
    recoil : -12,
    bullet : bladeSharp
})

const bladeBottom = extend(Weapon, {
    name : "spec-blade-bottom",
    shootSound : Sounds.release,
    top : false,
    mirror : true,
    shootY : 22,
    x : -14,
    y : 12,
    reload : 18,
    alternate : true,
    recoil : -12,
    bullet : bladeSharp
})

ichor.weapons.add(bladeTop);
ichor.weapons.add(bladeBottom);