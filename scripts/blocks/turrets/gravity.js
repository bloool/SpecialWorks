let status = require("libs/statusEffects")

const disappear = new Effect(40, e => {
    let randomSide = Mathf.randomSeed(e.id, 1) > 0.5 ? -1 : 1
    e.rotation = e.fout() * 30 * randomSide
    Draw.color(Pal.sap);
    Lines.stroke(e.fout() * 4);
    Lines.square(e.x, e.y, 30 * e.fout(), e.rotation + Mathf.randomSeed(e.id, 360));
});
const curseShoot = new Effect(40, e => {
    Draw.color(Pal.sap);
    Draw.alpha(e.fout());
    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 15, 30, e.rotation - (e.fin() * 10 * i))
    }
});

const boobies = extend(PointBulletType, {
    shootEffect : curseShoot,
    hitEffect : disappear,
    despawnEffect : Fx.none,
    splashDamage : 50,
    splashDamageRadius : 30,
    trailEffect : Fx.none,
    status : status.cursed,
    statusDuration : 5,
    despawnHit : true,
    speed : 500,
})

const precursor = extend(PowerTurret, "precursor", {
	size : 3,
	health : 2050,
	reloadTime : 80,
    rotateSpeed : 11,
    shootCone : 2,
	range : 200,

	shootSound : Sounds.release,

	recoilAmount : 4,
	shootLength : 0,
	powerUse : 24,

	targetAir : true, 
	targetGround : true,

	shootType : boobies,

    BuildVisibility : BuildVisibility.sandboxOnly
});

precursor.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 180,
    Items.copper, 300,
    Items.titanium, 120,
));

