//import items and colors
let items  = require("libs/items");
let colors = require("libs/colors");
let status = require("libs/statusEffects");

//plague turret
const malachiteTrail = new Effect(15, 100, e => {
    Draw.color(colors.malachiteMid);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, e.finpow() * 2);
});

const malachiteTrail2 = new Effect(15, 100, e => {
    Draw.color(colors.malachiteDark);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, e.finpow() * 2);
});

const malachiteHit = new Effect(16, e => {
    Draw.color(colors.malachiteMid);

    Drawf.tri(e.x, e.y, 18 * e.fout(), 64, e.rotation); //middle big triangle

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 18 * e.fout(), 32, e.rotation - 140 * i); //side triangles
    }
});

//both of the side projectiles use these, easier to change
let globalWeaveScale = 6;
let globalWeaveMag = 3;

const malachiteSwivel1 = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 20,
    height : 20,

    damage : 25,
    speed  : 5,

    backColor : colors.malachiteDark,
    frontColor : colors.malachiteMid,
    shrinkY : 0,

    homingPower : 0.2,
    homingRange : 50,

    hitSound : Sounds.plasmaboom,

    ejectEffect : Fx.none,
    despawnShake : 4,
    lifetime : 60,

    despawnEffect : malachiteHit,
    hitEffect : Fx.massiveExplosion,
    spin : 2,

    weaveScale2 : globalWeaveScale,
    weaveMag2 : globalWeaveMag,
    init(b){
        if(!b)return;
        b.data = new Trail(5);
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);

        //literally just the vanilla weave code but without the random weave side
        b.vel.rotate(Mathf.sin(b.time + Mathf.PI * this.weaveScale2/2, this.weaveScale2, this.weaveMag2 * 1) * Time.delta)
    },
    draw(b){
        b.data.draw(colors.malachiteMid, 4);
        this.super$draw(b);
    },
});

const malachiteSwivel2 = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 20,
    height : 20,

    damage : 25,
    speed  : 5,

    backColor : colors.malachiteDark,
    frontColor : colors.malachiteMid,
    shrinkY : 0,

    homingPower : 0.2,
    homingRange : 50,

    hitSound : Sounds.plasmaboom,

    ejectEffect : Fx.none,
    despawnShake : 4,
    lifetime : 60,

    despawnEffect : malachiteHit,
    hitEffect : Fx.massiveExplosion,
    spin : 2,

    weaveScale2 : 0 - globalWeaveScale,
    weaveMag2 : globalWeaveMag,

    init(b){
        if(!b)return;
        b.data = new Trail(5);
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);

        b.vel.rotate(Mathf.sin(b.time + Mathf.PI * this.weaveScale2/2, this.weaveScale2, this.weaveMag2 * -1) * Time.delta)
    },
    draw(b){
        this.super$draw(b);
        b.data.draw(colors.malachiteMid, 4);
    },
});

const malachiteBullet = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 28,
    height : 28,

    damage : 50,
    speed  : 5,

    backColor : colors.malachiteDark,
    frontColor : colors.malachiteMid,
    shrinkY : 0,

    hitSound : Sounds.plasmaboom,

    status : status.malachiteEffect,
    statusDuration : 3600,

    ejectEffect : Fx.none,
    despawnShake : 4,
    lifetime : 60,

    despawnEffect : malachiteHit,
    hitEffect : Fx.massiveExplosion,
    spin : 8,
    
    init(b){
        if(!b)return;
        malachiteSwivel1.create(b, b.x, b.y, b.rotation(), 1, 1);
        malachiteSwivel2.create(b, b.x, b.y, b.rotation(), 1, 1);
    },
    update(b){
        this.super$update(b);
        malachiteTrail.at(b.x + Mathf.range(5), b.y + Mathf.range(5))
        malachiteTrail2.at(b.x + Mathf.range(5), b.y + Mathf.range(5))
    },
});

const scour = extend(ItemTurret, "scour", {
    size : 4,
    health : 8000,

    reloadTime : 60,
	range : 210,
    inaccuracy : 0,
    recoilAmount : 5,
    rotateSpeed: 10,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.shotgun,
    shootShake: 4,   
	shootLength: 0,
});

scour.setupRequirements(Category.turret, ItemStack.with(
    Items.surgeAlloy, 80,
    Items.plastanium, 180,
    items.malachite, 320,
    Items.lead, 1020,
));

scour.ammo(
    items.malachite, malachiteBullet,
)

//revolve / low
const greenBoom = new Effect(40, 100, e => {
    Draw.color(Pal.heal);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, 4 + e.finpow() * 20);

    Draw.color(Pal.heal);
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, 6, 30 * e.fout(), i*90);
    }

    Draw.color();
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, 3, 8 * e.fout(), i*90);
    }
});

const greenWaveTrail = new Effect(40, 100, e => {
    Draw.color(Pal.heal);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, 12 + e.finpow() * 5);
});


const pew = extend(LaserBoltBulletType, {
    lifetime : 20,
    speed : 5,
    healPercent : 5,
    collidesTeam : true,
    backColor : Pal.heal,
    frontColor : Color.white,
    
    pierce : true,
    pierceCap : 3,
    init(b){
        if(!b)return;
        b.data = new Trail(3);
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);
    },
    draw(b){
        b.data.draw(Pal.heal, 1);
        this.super$draw(b);
    },
})

const pewBomb = extend(ArtilleryBulletType, {
    sprite : "large-bomb",
    width : 30,
    height : 30,

    splashDamage : 200,
    splashDamageRadius : 30,

    homingPower : 0.2,
    homingRange : 150,

    ignoreRotation : true,

    backColor : Pal.heal,
    frontColor : Color.white,
    mixColorTo : Color.white,

    shrinkY : 0.3,
    shrinkX : 0.3,

    hitSound : Sounds.plasmaboom,

    ejectEffect : Fx.none,
    despawnShake : 4,

    lifetime : 240,

    despawnEffect : greenBoom,
    hitEffect : Fx.massiveExplosion,
    spin : 10,

    timer : 0,
    spacing : 10,
    
    init(b){
        if(!b)return;
        b.data = new Trail(20);
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);

        this.timer += Time.delta;

        if(this.timer >= this.spacing){
            for(let i = 0; i < 2; i++){
                pew.create(b, b.x, b.y, b.rotation() + (180 * i) - 90 , 1, 1)
            }
            greenWaveTrail.at(b.x, b.y);
            this.timer = 0
        }
    },
    draw(b){
        b.data.draw(Pal.heal, 3);
        this.super$draw(b); 
    },
    despawned(b){
        this.super$despawned(b);
        for(let i = 0; i < 16; i++){
            pew.create(b, b.x, b.y, b.rotation() + (i * 360 / 16) , 1, 1);
        }
    }
});

const revolve = extend(ItemTurret, "revolve", {
    size : 3,
    health : 2000,

    reloadTime : 110,
	range : 260,
    inaccuracy : 2,
    recoilAmount : 8,
    rotateSpeed: 5,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.plasmaboom,
    shootShake: 4,   
	shootLength: 0,
});

revolve.setupRequirements(Category.turret, ItemStack.with(
    items.malachite, 22,
    Items.lead, 280,
));

revolve.ammo(
    items.malachite, pewBomb,
)