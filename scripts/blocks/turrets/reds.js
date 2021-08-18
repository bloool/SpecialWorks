let status = require("libs/statusEffects");

const fireTrail = new Effect(15, 100, e => {
    Draw.color(Pal.lightOrange);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, e.finpow() * 2);
});

const backfireBulletb = extend(BasicBulletType, {
    width : 18,
    height: 24,

    damage : 8,
    speed : 5,
    lifetime : 30,

    pierce : true,
    pierceCap : 2,

    status : StatusEffects.burning,
    frontColor : Pal.lightishOrange,
    backColor : Pal.lightOrange,
    makeFire : true,
    trailEffect : Fx.incendTrail,
    trailChance : 0.5,

    update(b){
        this.super$update(b);
        fireTrail.at(b.x + Mathf.range(5), b.y + Mathf.range(5))
    }    
});

const backfireBullet = extend(BasicBulletType, {
    width : 18,
    height: 24,

    damage : 8,
    speed : 5,
    lifetime : 30,

    pierce : true,
    pierceCap : 2,

    status : StatusEffects.burning,
    frontColor : Pal.lightishOrange,
    backColor : Pal.lightOrange,
    makeFire : true,
    trailEffect : Fx.incendTrail,
    trailChance : 0.5,
    
    update(b){
        this.super$update(b);
        fireTrail.at(b.x + Mathf.range(5), b.y + Mathf.range(5))
    },
    despawned(b){
        this.super$despawned(b);
        backfireBulletb.create(b, b.x, b.y, b.rotation() + 180 + Mathf.range(5), 1, 1);
    }
});

const backfire = extend(ItemTurret, "backfire", {
    size : 3,
    health : 1200,

    reloadTime : 10,
	range : 110,
    inaccuracy : 5,
    recoilAmount : 3,
    rotateSpeed: 7,

    shots : 2,
    spread : 8,
    alternate : true,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.flame,
    shootShake: 1,
    shootEffect : Fx.shootPyraFlame,
});

backfire.setupRequirements(Category.turret, ItemStack.with(
    Items.graphite, 50,
    Items.copper, 150,
    Items.lead, 100,
));

backfire.ammo(
    Items.coal, backfireBullet,
);

const boomShrapnel = extend(ShrapnelBulletType, {
    length : 100,
    damage : 120,
    width : 17,
    lifetime : 15,
    toColor : Color.valueOf("ff3936"),
    status : status.bombarded,
    statusDuration : 240,
    knockback : 75,
});

const sternflak = extend(ItemTurret, "sternflak", {
    size : 4,
    health : 3000,

    reloadTime : 300,
	range : 80,
    inaccuracy : 8,
    recoilAmount : 10,
    rotateSpeed: 6,

    shots : 4,
    spread : 4,
    shootLength : 1,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.release,
    shootShake: 10,
    shootEffect : Fx.shootPyraFlame,
});

sternflak.setupRequirements(Category.turret, ItemStack.with(
    Items.graphite, 300,
    Items.copper, 900,
    Items.titanium, 700,
    Items.thorium, 600,
));

sternflak.ammo(
    Items.coal, boomShrapnel,
);
