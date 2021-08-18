/*const tineSharp = extend(ShrapnelBulletType, {
    damage: 10,
    length: 5,
    width : 6,
    serrations: 0,
    hitEffect : Fx.none,
    toColor : Pal.bulletYellowBack,
});
const tine = extend(BasicBulletType, {
    width : 8,
    height : 35,
    damage : 30,
    speed : 5,
    lifetime : 40,
    collidesGround : false,

    homingPower : 1,
	homingRange : 25,

    hitEffect : Fx.railHit,
    backColor : Pal.bulletYellowBack,

    init(b){
        if(!b)return;
        b.data = new Trail(8);
    },
    update(b){
        b.data.update(b.x, b.y);
        this.super$update(b);
    },
    draw(b){
        this.super$draw(b);
        b.data.draw(Pal.bulletYellowBack, 2);
    },
    despawned(b){
        this.super$despawned(b);
        for(let i = 0; i < 4; i++){
            tineSharp.create(b, b.x, b.y, b.rotation() + (i * 90) , 1, 1);
        }
    }
});

const fastTurret = extend(ItemTurret, "fastTurret", {
    size : 4,
    health : 8000,

    reloadTime : 20,
	range : 180,
    inaccuracy : 5,
    recoilAmount : 2,
    rotateSpeed: 8,

    targetAir : true, 
	targetGround : true, 

    shootSound : Sounds.shootSnap,
    shootShake: 1,

    reloadIncrease : 1,
    reloadCap : 5,
});

fastTurret.buildType = () => extend(ItemTurret.ItemTurretBuild, fastTurret, {
    setEffs(){
        this.timer = 0;
        this.reloadB = 20;
    },
    updateShooting(){
        let timer = this.timer;
        let reloadB = this.reloadB;

        if(this.timer >= reloadB && this.isShooting() && this.hasAmmo()){
          var bullet = this.peekAmmo();
          this.shoot(bullet);

          timer = 0;
          if(reloadB > reloadCap) reloadB -= this.reloadIncrease;
        }
        else{
            timer += Time.delta;
            reloadB = 20;
        }
    }
})

fastTurret.setupRequirements(Category.turret, ItemStack.with(
    Items.copper, 1,
));

fastTurret.ammo(
    Items.copper, tine
)*/

/*updateShooting(){
    const liquid = this.liquids.current();
    
    if(this.hasAmmo()){
      this._frameSpeed = Mathf.lerpDelta(this._frameSpeed, 1, 0.000125 * this.peekAmmo().reloadMultiplier * liquid.heatCapacity * minigun.coolantMultiplier * this.delta());
      if(this._frameSpeed < 0.95){
        this.liquids.remove(liquid, 0.2);
      }
    }
    if(this._frame == 0 && this._shouldShoot && this._frameSpeed > 0.0166666667){
      var type = this.peekAmmo();
      
      this.shoot(type);
      
      this._shouldShoot = false;
      this._barrelHeat[this._barrel % 4] = 1;
    }
  }*/