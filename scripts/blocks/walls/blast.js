const explosion = extend(BombBulletType, {
    hitEffect: Fx.massiveExplosion,
    lifetime: 10,
    speed: 1,
    splashDamageRadius: 24,
    splashDamage: 100, 
    instantDisappear: true,
    hittable: false,
    collidesAir: true,
    hitShake: 2,
});

const smolExplosion = extend(BombBulletType, {
    hitEffect: Fx.flakExplosion,
    lifetime: 10,
    speed: 1,
    splashDamageRadius: 20,
    splashDamage: 25, 
    instantDisappear: true,
    hittable: false,
    knockback: 2.5,
    collidesAir: true,
    hitShake: 0.5,
});

const blast = extend(Wall, "blast-wall", {
    health : 4000,
    size : 2,
    update: true
});
blast.buildType = () => extend(Wall.WallBuild, blast, {
    onDestroyed(){
        this.super$onDestroyed();
        explosion.create(this, Team.derelict, this.x, this.y, 0);
    }
});
blast.setupRequirements(Category.defense, ItemStack.with(
    Items.copper, 1,
));


const smolBlast = extend(Wall, "small-blast-wall", {
    health : 4000 / 4,
    size : 1,
    update: true
});
smolBlast.buildType = () => extend(Wall.WallBuild, smolBlast, {
    onDestroyed(){
        this.super$onDestroyed();
        smolExplosion.create(this, Team.derelict, this.x, this.y, 0);
    }
});
smolBlast.setupRequirements(Category.defense, ItemStack.with(
    Items.copper, 1,
));