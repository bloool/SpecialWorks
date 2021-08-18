let colors  = require("libs/colors");
let status  = require("libs/statusEffects")
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

const vulpes = extend(UnitType, "vulpes", {
    type: "flying",

	accel: 0.1,
	range: 150,
	speed: 4,
	drag: 0.1,
	rotateSpeed: 20,
	hitSize: 20,

	payloadCapacity : 128,

	health: 800,
	commandLimit: 8,

	flying: true,
	engineOffset : 8,
});
vulpes.constructor = () => extend(PayloadUnit, {});

const magneticBomb = extend(BasicBulletType, {
    width : 10,
    height : 18,
    speed : 5, // dummy stat, doesnt actually change the speed
    lifetime : 60,
    damage : 60,

    shootEffect : Fx.none,
    backColor : colors.magnetiteMid,

    magRadius : 14,
    despawnEffect : new MultiEffect(die(18), dynamic.wave(10, 30, colors.magnetiteLight)),
    magStrength : 0.05,
    magCap : 1.25,

    init(b){
        if(!b) return;
        this.super$init(b);
        b.fdata = -9341256; //random number
    },
    update(b){
        this.super$update(b);
        let vel = 1 + Mathf.absin(Time.time, 2, 3);
        b.vel.setLength(vel);

        Groups.bullet.intersect(b.x - this.magRadius, b.y - this.magRadius, this.magRadius*2, this.magRadius*2, cons(other => {
            if(other != null && other.team != b.team && other.fdata != -9341256 && other.vel.len() > this.magCap && Mathf.dst(b.x, b.y, other.x, other.y) <= this.fieldRange && other.type.hittable){
                other.vel.setLength(other.vel.len() - other.vel.len() * this.magStrength);
                dynamic.wave(2, 20, colors.magnetiteLight, true).at(other.x, other.y)
            }
        }));
    },
    draw(b){
        this.super$draw(b);
        Draw.z(95);
        Draw.color(colors.magnetiteMid);
        Draw.alpha(0.12);
        Fill.circle(b.x, b.y, this.magRadius);
    }
});

const vulpesCannon = extend(Weapon, {
    name : "vulpes-cannon",
    shootSound : Sounds.shootSnap,
    top : true,
    rotate : false,
    mirror : false,
    shootY : 0,
    x : 0,
    y : 0,
    reload : 25,
    bullet : magneticBomb
});

vulpes.weapons.add(vulpesCannon);

// const bladeRight = extend(BasicBulletType, {
//     width : 64,
//     height : 128,
//     speed : 5,
//     lifetime : 60, //dont
//     damage : 60,
//     pierce : true,

//     // init(b){
//     //     if(!b)return
//     //     this.super$init(b);
//     // },
//     draw(b){
//         Draw.z(Layer.effect + 5);
//         Draw.rect(Core.atlas.find("spec-lagopus-blade-right"), b.x, b.y, b.rotation() - 90);
//         //this.super$draw(b)
//     },
//     update(b){
//         let u = b.owner;
//         b.time = 0;
//         if(u.dead)b.remove()
//         b.rotation(u.rotation)
//         b.x = u.x + Angles.trnsx(u.rotation - 50, 30);
//         b.y = u.y + Angles.trnsy(u.rotation - 50, 30);
//     }
// })

const windParticle = new Effect(20, e => {
    Draw.color(Color.valueOf("ffffff80"))
    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 5 * e.fout(), 50, e.rotation + 90 * i + 90)
    }
})

const slashRight = extend(BasicBulletType, {
    width : 48,
    height : 18,
    speed : 10,
    lifetime : 60,
    damage : 60,

    shootEffect : Fx.none,

    pierce: true,
    status : status.slashed,

    draw(b){
        Draw.z(Layer.bullet);
        Draw.color(Color.valueOf("ffffff80"))

        for(let i of Mathf.signs){
            Drawf.tri(b.x, b.y, 16, 80, b.rotation() + 240 * i - 30); 
        }
    },
    update(b){
        this.super$update(b);
        // particles, doing it here so it doesnt keeps going when the game is paused unlike draw
        windParticle.at(b.x + Mathf.range(20), b.y + Mathf.range(20), b.rotation())
    }
});

const slashLeft = extend(BasicBulletType, {
    width : slashRight.width,
    height : slashRight.height,
    speed : slashRight.speed,
    lifetime : slashRight.lifetime,
    damage : slashRight.damage,

    shootEffect : slashRight.shootEffect,

    pierce : slashRight.pierce,
    status : slashRight.status,

    draw(b){
        Draw.z(Layer.bullet);
        Draw.color(Color.valueOf("ffffff80"))

        for(let i of Mathf.signs){
            Drawf.tri(b.x, b.y, 16, 80, b.rotation() + 240 * i + 30); 
        }
    },
    update(b){
        this.super$update(b);
        // particles, doing it here so it doesnt keeps going when the game is paused unlike draw
        windParticle.at(b.x + Mathf.range(20), b.y + Mathf.range(20), b.rotation())
    }
});

const bladeRight = extend(Weapon, {
    name : "spec-lagopus-blade-right",
    shootSound : Sounds.release,
    top : true,
    rotate : false,
    mirror : false,
    shootY : 0,
    x : 25,
    y : 16,
    reload : 30,
    recoil : -12,
    bullet : slashRight
});

const bladeLeft = extend(Weapon, {
    name : "spec-lagopus-blade-left",
    shootSound : Sounds.release,
    top : true,
    rotate : false,
    mirror : false,
    shootY : 0,
    x : -25,
    y : 16,
    reload : 30,
    recoil : -12,
    bullet : slashLeft
});

const lagopus = extend(UnitType, "lagopus", {
    type: "flying",

    armor : 16,
    health : 24000,
    speed : 0.8,
    rotateSpeed : 1,
    accel : 0.04,
    drag : 0.018,
    flying : true,
    engineOffset : 28,
    engineSize : 7.8,
    hitSize : 46,
    lowAltitude : true,

    fieldRange : 150,
    speedCap : 1,
    speedGoodCap : 7,
    speedForce : 0.1,
    homingPowerCap : 0.2,
    homingRangeCap : 50,
    homingPowerForce : 0.01,
    homingRangeForce : 1,

    // init(){
    //     this.super$init();
    //     this._shouldCreate = true;
    // },
    // update(u){
    //     this.super$update(u);
    //     if(this._shouldCreate) bladeRight.create(u, u.x, u.y, u.rotation); this._shouldCreate = false
    // }
});
lagopus.constructor = () => extend(UnitEntity, {});

lagopus.weapons.add(bladeRight);
lagopus.weapons.add(bladeLeft);

    // draw(u){
    //     this.super$draw(u);
    //     Draw.z(95);
    //     Draw.color(colors.magnetiteMid);
    //     Draw.alpha(0.12);
    //     Fill.circle(u.x, u.y, this.fieldRange);
    //     Draw.reset();
    // },

// Groups.bullet.intersect(u.x - this.fieldRange, u.y - this.fieldRange, this.fieldRange*2, this.fieldRange*2, cons(b => {
        //     if(b != null && Mathf.dst(b.x, b.y, u.x, u.y) <= this.fieldRange){
        //         if(b.team != u.team){
        //             if(b.type.hittable){
        //                 dynamic.wave(2, 20, colors.magnetiteLight, true).at(b.x, b.y);
        //                 if(b.vel.len() > this.speedCap){
        //                     b.vel.setLength(b.vel.len() - this.speedForce * Time.delta);
        //                 }else{
        //                     b.team = u.team;
        //                     b.time = 0;
        //                     b.rotation(Angles.angle(b.x, b.y, u.x, u.y) + 180);
        //                 }
        //             }
        //         }else{
        //             dynamic.wave(2, 20, colors.magnetiteDark, true).at(b.x, b.y);
        //             if(b.vel.len() < this.speedGoodCap)b.vel.setLength(b.vel.len() + this.speedForce);
        //         }
        //     }
        // }));