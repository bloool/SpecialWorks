const fang = extend(UnitType, "fang", {
    type: "legs",

	hitSize : 29,
	health : 18000,
	armor : 9,
	landShake : 1.5,
	rotateSpeed : 1.5,

	legCount : 4,
	legLength : 14,
	legBaseOffset : 11,
	legMoveSpace : 1.5,
	legTrns : 0.58,
	hovering : true,
	visualElevation : 0.2,
	allowLegStep : true,
	groundLayer : 75
});

fang.constructor = () => extend(LegsUnit, {});

const sharp = extend(ShrapnelBulletType, {
    damage: 12,
    length: 24,
    lifetime: 2,
    width : 20,
    serrations: 0,
    hitEffect : Fx.none,
    toColor : Color.valueOf("5368d4"),
});

const sharpLong = extend(ShrapnelBulletType, {
    damage: 10,
    length: 24,
    lifetime: 10,
    width : 20,
    serrations: 0,
    hitEffect : Fx.none,
    toColor : Color.valueOf("5368d4"),
});

const die = new Effect(16, e => {
    Draw.color(Color.valueOf("5368d4"));

    Drawf.tri(e.x, e.y, 18 * e.fout(), 64, e.rotation); //middle big triangle

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 18 * e.fout(), 32, e.rotation - 140 * i); //side triangles
    }
});

const fangShoot = new Effect(16, e => {
    Draw.color(Color.valueOf("5368d4"));

    Drawf.tri(e.x, e.y, 10 * e.fout(), 40, e.rotation); //middle big triangle

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 10 * e.fout(), 24, e.rotation - 140 * i); //side triangles
    }
});

const fangHit = new Effect(16, e => {
    Draw.color(Color.valueOf("5368d4"));

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 10 * e.fout(), 24, e.rotation + 140 * i);
    }
});

const fangBullet = extend(BasicBulletType, {
    width : 24,
    height: 30,
    sprite: "large-bomb",

    damage: 50,
    lifetime : 30,
    speed : 7,
    knockback : -4,
    pierce: true,

    backColor : Color.valueOf("5368d4"),
    shootEffect: fangShoot,
    hitEffect : fangHit,

    bounceDelay : 10,
    bounceRange : 80,

    init(b){
        if(!b)return;
        this.super$init(b)
        b.data = true
    },
    update(b){
        this.super$update(b);
        sharp.create(b, b.x, b.y, b.rotation(), 1, 1);
    
        let target = Units.closestTarget(b.team, b.x, b.y, this.bounceRange);
    
        if(b.time >= this.bounceDelay && b.data){
            if(target !== null){b.vel.setAngle(b.angleTo(target.x, target.y))};
            b.data = false;
        }
    }
});

const fangHarpoon = extend(BasicBulletType, {
    width : 18,
    height: 28,
    sprite: "large-bomb",

    damage : 800,
    speed : 5,
    lifetime : 15,
    pierce : true,

    knockback : 40,
    recoil: 5,

    despawnEffect : die,

    mixColorTo : Color.valueOf("ffffff"),
    frontColor : Color.valueOf("ffffff"),
    backColor  : Color.valueOf("5368d4"),

    update(b){
        sharp.create(b, b.x, b.y, b.rotation(), 1, 1);
        sharp.create(b, b.x, b.y, b.rotation() + 180, 1, 1);
        sharp.create(b, b.x, b.y, b.rotation() + 200, 1, 1);
        sharp.create(b, b.x, b.y, b.rotation() - 200, 1, 1);
    }
});

const harpoonGun = extend(Weapon, {
    shootSound : Sounds.release,
    top : false,
    mirror : false,
    shootY : 0,
    x : 0,
    y : 10,
    reload : 120,
    recoil : 0,
    bullet : fangHarpoon,
    shootEffect : die,
    shootCone : 90,
});

const fangGun = extend(Weapon, {
    name : "spec-fang-gun",
    shootSound : Sounds.shootBig,
    top : false,
    mirror : true,
    shootY : 14,
    inaccuracy : 5,
    x : 18,
    y : 14,
    reload : 8,
    alternate : true,
    recoil : 6,
    bullet : fangBullet
});

fang.weapons.add(fangGun)
fang.weapons.add(harpoonGun)
