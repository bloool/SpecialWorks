let dynamic = require("libs/dynamicEffects");

const electricBullet = extend(BasicBulletType, {
    width : 16,
    height : 24,
    speed : 4,
    lifetime : 60,
    pierce : true,

    damage : 2.5,

    connectRange : 80,
    backColor : Pal.lancerLaser,

    hitEffect : dynamic.wave(2, 20, Pal.lancerLaser, true),

    init(b){
        if(!b)return;
        b.fdata = -218374; //random number
    },
    update(b){
        this.super$update(b);

        if(Mathf.chance(0.2)) Lightning.create(b.team, Pal.lancerLaser, 1, b.x, b.y, b.rotation() + Mathf.range(180), 4);
        
        Groups.bullet.intersect(b.x - this.connectRange, b.y - this.connectRange, this.connectRange*2, this.connectRange*2, cons(e => {
            if(e != null && e.team == b.team && e.fdata == -218374){
                Damage.collideLine(b, b.team, this.hitEffect, b.x, b.y, Angles.angle(b.x, b.y, e.x, e.y), Mathf.dst(b.x, b.y, e.x, e.y), true);
            }
        }));
    },
    draw(b){
        this.super$draw(b);
        Groups.bullet.intersect(b.x - this.connectRange, b.y - this.connectRange, this.connectRange*2, this.connectRange*2, cons(e => {
            if(e != null && e.team == b.team && e.fdata == -218374){
                Draw.z(Layer.effect);
                Lines.stroke(2, Pal.lancerLaser)
                Lines.line(b.x, b.y, e.x, e.y)
            }
        }));
    }
});

const electron = extend(PowerTurret, "electron",{
    size : 3,
    health : 600,

    reloadTime : 30,
    shots : 1,
	range : 180,
    inaccuracy : 30,
    recoilAmount : 2,
    rotateSpeed: 6,
    powerUse : 8,
    shootCone : 80,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.laser,
    shootShake : 2,

    shootType : electricBullet,
    shootLength: 5,
});

electron.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 260,
    Items.lead, 180,
    Items.titanium, 90,
));

const lightTrail = new Effect(15, e => {
    Draw.color();
    Lines.stroke(6 * e.fout());
    Lines.lineAngle(e.x, e.y, e.rotation, 25);
});

const lightShine = new Effect(30, e => {
    let size = 80
    e.rotation = Mathf.randomSeed(e.id, -80, 80) * e.fout();

    Draw.color();
    for(let i = 0; i < 4; i++){ //rotating shine
        Drawf.tri(e.x, e.y, size/8 * e.fout(), size, e.rotation + i*90);
    }
});

const lightShoot = new Effect(15, e => {
    Draw.color();
    for(let i of Mathf.signs){ //rotating shine
        Drawf.tri(e.x, e.y, 8 * e.fout(), 40, e.rotation + i*120);
    }
})

const lightBeam = extend(PointBulletType, {
    shootEffect : lightShoot,
    hitEffect : lightShine,
    smokeEffect : Fx.none,
    trailEffect : lightTrail,
    despawnEffect : Fx.none,
    trailSpacing : 20,
    splashDamage : 100,
    splashDamageRadius : 30,
    buildingDamageMultiplier : 0.25,
    speed : 240,
    hitShake : 6,
    ammoMultiplier : 1,
});

const photon = extend(PowerTurret, "photon", {
    size : 4,
    health : 6000,

    reloadTime : 300,
    shots : 1,
	range : 220,
    inaccuracy : 2,
    xRand : 8,
    velocityInaccuracy : 0.2,
    recoilAmount : 2,
    rotateSpeed: 6,
    powerUse : 8,
    shootCone : 80,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.laser,
    shootShake : 2,

    shootType : lightBeam,

    update : true,
});

photon.buildType = () => extend(PowerTurret.PowerTurretBuild, photon, {
    reload2 : 0,
    timer2 : 1,
    acc : 0.05,
    reloadCap : 10,
    updateTile(){
        this.super$updateTile();
        const liquid = this.liquids.current()

        if(this.isShooting() && this.power.status > 0.5){
            this.timer2 += Time.delta;
            if(this.reload2 > this.reloadCap / (liquid.heatCapacity + 1)){
                this.reload2 -= this.acc * (liquid.heatCapacity + 1);
            };
            if(this.timer2 > this.reload2){
                let type = this.peekAmmo();
                this.shoot(type);

                this.liquids.remove(liquid, 0.2);

                print(this.reload2);
                print(liquid.heatCapacity);

                this.timer2 = 0;
            }
        }else{
            this.reload2 = 60
        }
    }
});

photon.setupRequirements(Category.turret, ItemStack.with(
    Items.silicon, 400,
    Items.lead, 300,
    Items.plastanium, 170,
    Items.titanium, 120,
));