let colors = require("libs/colors");

// function getStatus(unit, status){ //stolen from pixelcraft, although I dont think there is any other way to see if a unit has a specific effect than just going through all of them and checking and that I'd arrive at the same awnser if did by myself, but thanks ship, luv u
//     for(let i = 0; i < unit.statuses.size; i++){
//         if(unit.statuses.get(i).effect == status){
//             return unit.statuses.get(i).effect
//         }
//     }
// };

const malachiteBlink = new Effect(15, 100, e => {
    Draw.color(colors.malachiteMid);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, e.finpow() * 2);
});

const malachiteHealing = new Effect(15, 100, e => {
    Draw.color(colors.malachiteLight);
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, 3, 3 * e.fout(), i*90);
    }
});

const malachiteHeal = extend(StatusEffect, "malachitieHeal", {
    color : colors.malachiteLight,
    damage : -0.3,
    healthMultiplier : 1.2,
    effect : malachiteHealing,
    transitionDamage : -8,

    update(u, t){
        this.super$update(u, t);
        if(u.hasEffect(malachiteHeal)){
            u.unapply(malachiteEffect)
        }
    }
})

const malachiteEffect = extend(StatusEffect, "malachiteEffect", {
    color : colors.malachiteMid,
    damage : 0.3,
    healthMultiplier : 0.8,
    effect : malachiteBlink,

    update(unit, time){
        this.super$update(unit, time)

        let infectMax = 1200
        
        var infectRange = unit.hitSize * (time / infectMax)

        //for allies
        Units.nearby(unit.team, unit.x, unit.y, infectRange/2, cons(other => { //divided by 2 because radius
            other.apply(malachiteEffect, time);
        }))
        
        //for enemies
        Units.nearbyEnemies(unit.team, unit.x, unit.y, 2 * infectRange, 2 * infectRange, cons(other => {
            if(Mathf.dst(other.x, other.y, unit.x, unit.y) <= infectRange) other.apply(malachiteEffect, time);
        }))

        //why didnt you made draw() also have the effect's time anuke why
        const rangeDisplay = new Effect(2, e => {
            let rad = infectRange/2
            Draw.z(95);
            Draw.color(colors.malachiteMid);
            Draw.alpha(0.4 * e.fout());
            Fill.circle(e.x, e.y, rad);
            Draw.reset();
        });

        rangeDisplay.at(unit.x, unit.y)
    },
});



function createSlash(owner, team, x, y, angle, width, height, speed, damage){
    const slash = extend(BasicBulletType, {
        width : width,
        height : height,
        speed : speed,
        lifetime : 30,
        damage : damage,
    
        shootEffect : Fx.none,
        despawnEffect : Fx.none,
        hitEffect : Fx.none,
    
        pierce: true,
    
        draw(b){
            Draw.z(Layer.bullet);
            Draw.color(Color.valueOf("ffffff80"));
            for(let i of Mathf.signs){
                Drawf.tri(b.x, b.y, this.width, this.height, b.rotation() + 90 + 90 * i); 
            }
        }
    });

    return slash.create(owner, team, x, y, angle);
};

const windParticle = new Effect(20, e => {
    Draw.color(Color.valueOf("ffffff80"))
    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 5 * e.fout(), 25, e.rotation + 90 * i + 90)
    }
});

const slashed = extend(StatusEffect, "slashed", {
    color : Color.gray,
    damage : 0.3,
    speedMultiplier : 0.8,
    effect : windParticle,

    timer : 0,

    update(unit, time){
        this.super$update(unit, time);

        this.timer += Time.delta;

        if(this.timer >= 5){
            let dongas = new Vec2();
            dongas.rnd(Mathf.range(unit.hitSize * 4));
            createSlash(unit, Team.derelict, unit.x + dongas.x, unit.y + dongas.y, dongas.angle() + 180, unit.hitSize / 6, unit.hitSize, unit.hitSize / 5, unit.hitSize);
            this.timer = 0;
        }
    }
});



const boom = extend(BombBulletType, {
    hitEffect : Fx.blastExplosion,
    lifetime : 10,
    speed : 1,
    splashDamageRadius : 28,
    instantDisappear : true,
    splashDamage : 8,
    hittable : false,
    collidesAir : true,
    knockback : 2,
    sprite : "clear",
});

const bigBoom = extend(BombBulletType, {
    hitEffect : Fx.massiveExplosion,
    lifetime : 10,
    speed : 1,
    splashDamageRadius : 45,
    instantDisappear : true,
    splashDamage : 45,
    hittable : false,
    collidesAir : true,
    knockback : 15,
    sprite : "clear",
});

const bombarded = extend(StatusEffect, "bombarded", {
    color : Pal.lightOrange,

    healthMultiplier : 0.7,
    transitionDamage : -150,

    timer : 0,

    update(unit, time){
        this.super$update(unit, time);

        this.timer += Time.delta;

        if(unit.hitSize <= 21){
            if(this.timer >= 10){
                boom.create(unit, Team.derelict, unit.x + Mathf.range(unit.hitSize / 2), unit.y + Mathf.range(unit.hitSize / 2), 0);
                this.timer = 0;
            }
        }
        else{
            if(this.timer >= 6){
                bigBoom.create(unit, Team.derelict, unit.x + Mathf.range(unit.hitSize / 2), unit.y + Mathf.range(unit.hitSize / 2), 0);
                this.timer = 0;
            }
        }
    }
});


const cursed = extend(StatusEffect, "cursed", {
    color : Pal.sap,
    update(unit, time){
        this.super$update(unit, time);
        if(unit.maxHealth < 500){
            unit.kill();
        }
    }
});

module.exports = {
    cursed : cursed,
    malachiteEffect : malachiteEffect,
    malachiteHeal : malachiteHeal,
    bombarded : bombarded,
    slashed : slashed,
}
