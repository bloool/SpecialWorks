let colors  = require("libs/colors");
let items   = require("libs/items");
let dynamic = require("libs/dynamicEffects")

function die (rad) {
    const die = new Effect(20, e => {
        Draw.z(95);
        Draw.color(colors.magnetiteMid);
        Draw.alpha(0.12);
        Fill.circle(e.x, e.y, rad * e.fout());
    });
    return die
}

const magnetiteSpark = new Effect(30, e => {
    Draw.color(colors.magnetiteLight, e.fin());
    Lines.stroke(e.fout() * 1.2 + 0.6);

    Angles.randLenVectors(e.id + 1, 8, 1 + 23 * e.finpow(), (x, y) => {
        Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 1 + e.fout());
    });
});

const magneticBomb = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 24,
    height : 24,
    speed : 6,
    lifetime : 180,
    drag : 0.1,
    collides : false,

    shootEffect : magnetiteSpark,
    backColor : colors.magnetiteMid,

    weaveScale : 3,
    weaveMag : 3,
    shrinkY : 0,

    magRadius : 18,
    despawnEffect : new MultiEffect(die(18), dynamic.wave(18, 20, colors.magnetiteLight)),
    magStrength : 0.1,

    spin : 1,

    init(b){
        if(!b) return;
        this.super$init(b);
        b.fdata = -9341256; //random number
    },
    update(b){
        this.super$update(b);
        Groups.bullet.intersect(b.x - this.magRadius, b.y - this.magRadius, this.magRadius*2, this.magRadius*2, cons(other => {
            if(other != null && other.team != b.team && Mathf.dst(b.x, b.y, other.x, other.y) <= this.fieldRange && other.type.hittable){
                if(other.fdata != -9341256){
                    other.vel.setAngle(Angles.moveToward(other.rotation(), other.angleTo(b), this.magStrength * Time.delta * 50));
                }
            }
        }));
    },
    draw(b){
        this.super$draw(b);
        Draw.blend(Blending.additive);
        Draw.z(95);
        Draw.color(colors.magnetiteMid);
        Draw.alpha(0.12);
        Fill.circle(b.x, b.y, this.magRadius);
        Draw.blend();
        Draw.reset()
    }
});

const magnes = extend(ItemTurret, "magnes", {
    size : 3,
    health : 80 * 3 * 3,

    reloadTime : 180,
    shots : 3,
	range : 90,
    inaccuracy : 24,
    velocityInaccuracy : 0.2,
    recoilAmount : 6,
    rotateSpeed: 6,
    shootCone : 180,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.shootBig,
    shootShake : 6,
})

magnes.setupRequirements(Category.turret, ItemStack.with(
    items.magnetite, 80,
    Items.copper, 200,
    Items.graphite, 150,
));

magnes.ammo(
    items.magnetite, magneticBomb
);

const magneticLaserBomb = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 30,
    height : 30,
    speed : 6,
    lifetime : 180,
    drag : 0.1,
    collides : false,

    shootEffect : magnetiteSpark,
    backColor : colors.magnetiteMid,

    weaveScale : 3,
    weaveMag : 3,
    shrinkY : 0,

    magRadius : 40,
    despawnEffect : new MultiEffect(die(40), dynamic.wave(40, 20, colors.magnetiteLight)),
    magStrength : 0.1,
    speedCap : 1,
    speedForce: 0.08,
    damage2 : 0.5,

    spin : 3,

    init(b){
        if(!b) return;
        this.super$init(b);
        b.fdata = -9341256; //random number
    },
    update(b){
        this.super$update(b);
        Groups.bullet.intersect(b.x - this.magRadius, b.y - this.magRadius, this.magRadius*2, this.magRadius*2, cons(other => {
            if(other != null && other.team != b.team && Mathf.dst(b.x, b.y, other.x, other.y) <= this.fieldRange && other.type.hittable){
                if(other.fdata != -9341256){ // so it doesnt succ itself
                    other.vel.setAngle(Angles.moveToward(other.rotation(), other.angleTo(b), this.magStrength * Time.delta * 50));
                    dynamic.wave(2, 20, colors.magnetiteLight, true).at(other.x, other.y)
                    if(other.vel.len() > this.speedCap)other.vel.setLength(other.vel.len() - this.speedForce * Time.delta)

                    if(other.damage > this.damage2){
                        other.damage -= this.damage2 * Time.delta;
                    }else{
                        other.remove();
                    }
                }
            }
        }));
    },
    draw(b){
        this.super$draw(b);
        Draw.blend(Blending.additive);
        Draw.z(95);
        Draw.color(colors.magnetiteMid);
        Draw.alpha(0.12);
        Fill.circle(b.x, b.y, this.magRadius);
        Draw.blend();
        Draw.reset();
    },
    despawned(b){
        this.super$despawned(b)
        const die = new Effect(20, e => {
            Draw.z(95);
            Draw.color(colors.magnetiteMid);
            Draw.alpha(0.12);
            Fill.circle(b.x, b.y, this.magRadius * e.fout());
        });
        die.at(b.x, b.y)
    }
});

const current = extend(ItemTurret, "current", {
    size : 4,
    health : 80 * 3 * 3,

    reloadTime : 180,
	range : 110,
    inaccuracy : 10,
    velocityInaccuracy : 0.2,
    recoilAmount : 6,
    rotateSpeed: 6,
    shootCone : 180,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.shootBig,
    shootShake : 6,
})

current.setupRequirements(Category.turret, ItemStack.with(
    items.magnetite, 300,
    Items.copper, 2000,
    Items.graphite, 800,
));

current.ammo(
    items.magnetite, magneticLaserBomb
);