function damage(damage){
    const sharp = extend(ShrapnelBulletType, {
        damage: damage,
        length: 48,
        width : 0,
        serrations: 0,
        shootEffect : Fx.none,
        smokeEffect : Fx.none,
    });
    return sharp
}

const excalibur = extend(PowerTurret, "excalibur", {
    size : 4,
    health : 8000,

    reloadTime : 3,
	range : 48,
    recoilAmount : 0,

    targetAir : true,
	targetGround : true,

    shootLength : 0,
    shootCone : 360,
    inaccuracy : 0,
    rotateSpeed: 0,

    powerUse : 12,
    shootSound : Sounds.none,
    shootShake: 0.1,   
    shootType : damage(0)
});

excalibur.buildType = () => extend(PowerTurret.PowerTurretBuild, excalibur, {
    _rotateVel : 1,
    _activated : false,
    _damage : 0,
    _alpha : 0,
    rotateHighCap : 60,
    rotateVelSpeed : 0.03,

    draw(){
        this.super$draw();
        Draw.z(Layer.effect);
        
        this._alpha = this._rotateVel / this.rotateHighCap - 0.3

        //blade
        for(let i = 0; i < 4; i++){
            Draw.alpha(this._rotateVel / 5 - 0.4 - this._alpha)
            Draw.rect(Core.atlas.find("spec-excalibur-blade"),
                this.x + Angles.trnsx(this.rotation + i * 90, 30),
                this.y + Angles.trnsy(this.rotation + i * 90, 30),
                this.rotation - 90 + i * 90
            );
        }

        //welcome to hell
        if(this._alpha > 0.4) this._alpha = 0.4
        print(this.alpha)

        Draw.blend(Blending.additive);
        Draw.z(Layer.effect + 1);

        Draw.alpha(this._alpha * 0.4)
        Lines.stroke(24)
        Lines.circle(this.x + Mathf.range(0.5), this.y + Mathf.range(0.5), 32) //outer circle

        Draw.alpha(this._alpha * 0.4)
        Lines.stroke(16)
        Lines.circle(this.x + Mathf.range(0.5), this.y + Mathf.range(0.5), 32) //inner circle

        Draw.alpha(this._alpha * 1 + Mathf.range(0.3))
        Draw.rect(Core.atlas.find("spec-excalibur-swing"), this.x, this.y, 96 + Mathf.range(16), 96 + Mathf.range(16), this.rotation + Mathf.range(180)); //circle h

        Draw.blend();
        Draw.reset();
    },
    updateTile(){
        if(!this.isShooting() && this._rotateVel > 1)this._rotateVel -= Time.delta * 0.3
        this.rotation += this._rotateVel * Time.delta;

        if(this._activated)this.shoot(this.peekAmmo())

        //dont deal damage with little speed
        if(this._rotateVel / 5 > 1){
            this._activated = true
        }
        else{
            this._activated = false
        }

        this.super$updateTile();
    },
    updateShooting(){
        const liquid = this.liquids.current();
        this._reload2 += Time.delta * this.peekAmmo().reloadMultiplier * this.baseReloadSpeed();
        if(this._rotateVel <= this.rotateHighCap * (1 + liquid.heatCapacity)) this._rotateVel += this.rotateVelSpeed * this.baseReloadSpeed() * (1 + liquid.heatCapacity * 16) * Time.delta; this.liquids.remove(liquid, 1);
    },
    shoot(bullet){
        if(this._rotateVel < 15){
            for(let i = 0; i < 4; i++){
                damage(this._rotateVel * 0.3).create(this, this.team, this.x + Angles.trnsx(this.rotation + i * 90, 15), this.y + Angles.trnsy(this.rotation + i * 90, 15), this.rotation + i * 90)
                this.effects();
                this.useAmmo();
            }
        }else{
            for(let i = 0; i < 8; i++){
                damage(this._rotateVel * 0.3).create(this, this.team, this.x + Angles.trnsx(this.rotation + i * 45, 15), this.y + Angles.trnsy(this.rotation + i * 45, 15), this.rotation + i * 45)
                this.effects();
                this.useAmmo();
            }
        }
    }
})

excalibur.setupRequirements(Category.turret, ItemStack.with(
    Items.surgeAlloy,   120,
    Items.silicon,      300,
    Items.plastanium,   180,
));