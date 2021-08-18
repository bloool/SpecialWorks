let colors = require("libs/colors")
let dynamic= require("libs/dynamicEffects")

const starBoom = new Effect(40, 100, e => {
    Draw.color(colors.starLight);
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, 4 + e.finpow() * 20);

    Draw.color(colors.starLight);
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, 6, 40 * e.fout(), i*90);
    }

    Draw.color();
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, 3, 12 * e.fout(), i*90);
    }
});

const rotatingShine = new Effect(40, 100, e => {
    let size = 20

    e.rotation = 30 * e.fout();

    Draw.color(colors.starLight);
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, size/8, size * e.fout(), e.rotation + i*90);
    }

    Draw.color();
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, size/8/2, size/2 * e.fout(), e.rotation + i*90);
    }
});

const starBomb = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 16,
    height : 24,
    speed : 0.5,
    lifetime : 80,
    drag : -0.05,

    splashDamage : 60,
    splashDamageRadius : 20,

    homingPower : 0.3,
	homingRange : 80,
    homingDelay : 10,

    shootEffect: rotatingShine,
    hitEffect : Fx.railHit,
	despawnEffect : starBoom,
    backColor : colors.starLight,

    weaveScale : 3,
    weaveMag : 3,
    shrinkY : 0,

    speedCap : 6.5,

    chargeDelay : 8,

    init(b){
        if(!b)return;
        b.data = new Trail(7);
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);

        if(b.vel.len() > this.speedCap)b.vel.setLength(this.speedCap)
    },
    draw(b){
        b.data.draw(colors.starLight, 3);
        this.super$draw(b);
    }
});

const polaris = extend(PowerTurret, "polaris", {
    size : 3,
    health : 600,

    reloadTime : 10,
	range : 180,
    inaccuracy : 27,
    xRand : 2,
    recoilAmount : 2,
    rotateSpeed: 6,
    powerUse : 8,
    shootCone : 180,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.laser,
    shootShake : 2,

    shootType : starBomb,
    shootLength: 5,
});

polaris.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 180,
    Items.copper, 300,
    Items.titanium, 120,
));

const bigLaser = extend(ContinuousLaserBulletType, {
    type : "ContinuousLaserBulletType",
    damage : 120,
    length : 200,
    width : 8,
    lifetime : 40,
    drawSize : 100,
    lightColor : Color.white,
    hitColor : Color.white,
    colors: [colors.starLight, colors.starMid, Color.white]
})

const laser = extend(LaserBulletType, {
    colors : [colors.starLight, colors.starMid, Color.white],
    hitEffect : Fx.absorb,
    despawnEffect : Fx.none,
    damage: 80,
    hitSize : 16,
    lifetime : 36,
    length : 180,
    width : 10,
});

const antares = extend(PowerTurret, "antares", {
	size : 4,
	health : 2050,
	reloadTime : 220,
	range : 200,

	shootSound : Sounds.plasmaboom,
	shootDuration : 40,
	shootShake : 6,

	recoilAmount : 4,
	shootLength : 0,
	powerUse : 24,

	targetAir : true, 
	targetGround : true,

	shootType : bigLaser
});

antares.buildType = () => extend(PowerTurret.PowerTurretBuild, antares, {
    creload : 0,
    shootVar : 1,
    updateTile(){
        this.super$updateTile();
        let rx = this.x + Mathf.range(15);
        let ry = this.y + Mathf.range(15);

        this.creload += Time.delta;

        if(this.isShooting() && this.power.status > 0.5 && this.hasAmmo() && this.creload > 10){
            this.creload = 0;
            laser.create(this, this.team, rx, ry, this.rotation);
            Fx.absorb.at(rx, ry);
            Sounds.sap.at(this);
        }
    },
    draw(){
        this.super$draw();

        this.shootVar = Mathf.lerpDelta(this.shootVar, this.isShooting() ? 3 : 1, 0.06);

        let size = this.power.status <= 0 ? 0 : 16 + Mathf.absin(Time.time, 12, 6) * this.shootVar * this.power.status;

        Draw.z(Layer.effect);

        Draw.color(colors.starLight);
        for(let i = 0; i < 4; i++){
            Drawf.tri(this.x, this.y, size/4, size, this.rotation + Mathf.absin(Time.time, 11, 7) + i*90 + 43);
        }

        Draw.color(Color.white);
        for(let i = 0; i < 4; i++){
            Drawf.tri(this.x, this.y, size/4/2, size/2, this.rotation + Mathf.absin(Time.time, 11, 7) + i*90 + 43);
        }
    }
});

antares.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 800,
    Items.surgeAlloy, 300,
    Items.thorium, 1200,
));



const rotatingShineBig = new Effect(40, 100, e => {
    e.rotation = 30 * e.fin();

    Draw.color(colors.starLight);
    for(let i = 0; i < 3; i++){
        Drawf.tri(e.x, e.y, 10, 40 * e.fout(), e.rotation + i*120);
    }

    Draw.color();
    for(let i = 0; i < 3; i++){
        Drawf.tri(e.x, e.y, 5, 20 * e.fout(), e.rotation + i*120);
    }
});

const triTrail = new Effect(25, 100, e => {
    Draw.color(colors.starLight, e.fout());
    Lines.stroke(e.fout() * 3);
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, 6, 14, e.rotation + i * 90);
    }
});

const chargedStar = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 16,
    height : 24,
    speed : 7,
    lifetime : 70,

    damage: 80,

    pierce : true,

    shootEffect: Fx.none,
    hitEffect : rotatingShineBig,
	despawnEffect : Fx.railHit,
    backColor : colors.starLight,

    shrinkY : 0,
    searchRange : 300,

    init(b){
        if(!b)return;
        this.super$init(b);
        let target = Units.closestTarget(b.team, b.x, b.y, this.searchRange); //get unit
        let targetPos = new Vec2();

        if(target == null) return;

        targetPos.set(Predict.intercept(b, target, this.speed)); //predict where it will be
        if(targetPos.isZero()){
            targetPos.set(target);
        }

        if(target !== null)b.vel.setAngle(b.angleTo(targetPos.x, targetPos.y)); //go towards prediction
    },
    draw(b){
        triTrail.at(b.x, b.y, b.rotation())
        this.super$draw(b);
    }
});

const preCharged = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 16,
    height : 16,
    speed : 4,
    lifetime : 30,
    drag : 0.1,

    collides : false,

    shootEffect: Fx.railHit,
	despawnEffect : rotatingShine,
    backColor : colors.starDark,

    shrinkY : 0,

    trailChance : 1,

    fragBullet : chargedStar,
    fragCone : 1,
    fragBullets : 1,
    fragLifeMin : 1,
    fragVelocityMax: 1,
    fragVelocityMin: 1,
});

const majoris = extend(PowerTurret, "majoris", {
	size : 4,
	health : 2050,
	reloadTime : 100,
	range : 200,

	shootSound : Sounds.plasmaboom,

    velocityInaccuracy: 0.6,

    shots: 5,
	burstSpacing: 2,
	shootShake: 2,

	shootCone: 360,
	inaccuracy: 180,
	rotateSpeed: 0,
	shootLength: 0,
	powerUse : 24,

	targetAir : true, 
	targetGround : true,

	shootType : preCharged,
});

majoris.buildType = () => extend(PowerTurret.PowerTurretBuild, majoris, {
    shootVar : 1,
    draw(){
        this.super$draw();

        this.shootVar = Mathf.lerpDelta(this.shootVar, this.isShooting() ? 3 : 1, 0.06);

        let size = this.power.status <= 0 ? 0 : 16 + Mathf.absin(Time.time, 12, 6) * this.shootVar * this.power.status;

        Draw.z(Layer.effect);

        Draw.color(colors.starLight);
        for(let i = 0; i < 4; i++){
            Drawf.tri(this.x, this.y, size/4, size, this.rotation + Mathf.absin(Time.time, 11, 7) + i*90 + 43);
        }

        Draw.color(Color.white);
        for(let i = 0; i < 4; i++){
            Drawf.tri(this.x, this.y, size/4/2, size/2, this.rotation + Mathf.absin(Time.time, 11, 7) + i*90 + 43);
        }
    }
});

majoris.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 1200,
    Items.surgeAlloy, 300,
    Items.thorium, 400,
));




const spoingas = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 16,
    height : 24,
    speed : 0.5,
    lifetime : 185,
    drag : -0.05,

    damage: 25,

    homingPower : 0.4,
	homingRange : 150,
    homingDelay : 30,

    pierce : true,

    shootEffect: rotatingShine,
    hitEffect : Fx.railHit,
	despawnEffect : starBoom,
    backColor : colors.starLight,

    weaveScale : 3,
    weaveMag : 3,
    shrinkY : 0,

    speedCap : 6.5,
    chargeDelay : 8,
    distanceMax : 100,
    returnForce : 0.3,
    followDelay : 1,

    init(b){
        if(!b)return;
        b.data = new Trail(5);
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);

        if(b.vel.len() > this.speedCap)b.vel.setLength(this.speedCap); //speed cap
        
        if(Mathf.dst(b.x, b.y, b.owner.x, b.owner.y) > this.distanceMax){ //comes back if away from turret
            b.vel.setAngle(Angles.moveToward(b.rotation(), b.angleTo(b.owner), this.returnForce * Time.delta * 50));
        };
    },
    draw(b){
        b.data.draw(colors.starLight, 3.5);
        dynamic.wave(2, 20, colors.starLight, true).at(b.x, b.y)
        this.super$draw(b);
    }
});

const vega = extend(PowerTurret, "vega", {
	size : 3,
	health : 2050,
	reloadTime : 80,
	range : spoingas.distanceMax, //to change this change the distance max on the bullet above

	shootSound : Sounds.plasmaboom,

    shots: 3,
	shootShake: 2,

	shootCone: 360,
	inaccuracy: 180,
	rotateSpeed: 0,
	shootLength: 0,
	powerUse : 24,

	targetAir : true, 
	targetGround : true,

	shootType : spoingas,
});

vega.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 120,
    Items.copper, 300,
    Items.titanium, 320,
));