function newSentry (obj) {
    let base = extend(BulletType, {
        collides : false, //dont change it to true
        lifetime : 15 * 60,
        width : 0,
        height: 0,
        speed : 5,
        drag : 0.1,
        layer : Layer.groundUnit, //dont draw on the bullet layer so no bloom
        inaccuracy : 360, //not the sentry's inaccuracy!
        keepVelocity : false,
        hitColor : Color.clear,
        lightColor : Color.clear,

        reflectable : false,
        hittable : true,
        absorbable : false,

        hitEffect: Fx.none,
        despawnEffect: Fx.flakExplosion,
        despawnSound: Sounds.boom,
        smokeEffect: Fx.none,
        shootEffect: Fx.none,

        /** What bullet the sentry will shoot */
        shootType : Bullets.standardCopper,
        /** How much health the setry has, they can only be hit by point defense */
        damage : 1020,
        /** If the sentry will have bigger circle shadow and different base*/
        isBig : false,
        /** The Sentry's range */
        sentryRange : 160,
        /** The base sprite that will be displayed bellow the actual rotating gun */
        baseSprite : "sentry-base",
        /** The gun sprite that will show up on top of the base, rotates */
        gunSprite : "sentry-gun",
        /** Gun reload time */
        reloadTime : 30,
        /** Gun shoot cone */
        shootCone : 40,
        /** How many bullets it shoots at once */
        shots : 1,
        /** The sound it makes when it shoots */
        shootSound : Sounds.shoot,
        /** The gun's rotate speed, self explanatory but I just want the comments to look consistent */
        rotateSpeed : 4,
        /** Gun inaccuracy */
        gunInaccuracy : 0, // gun before it so it doesnt conflict with the vanilla inaccuracy for bullets
        /** Velocity innacuracy */
        velocityInaccuracy : 0,
        /** How far from the sentry's center that the gun will be rendered, usefull if you want  ｌ ｏ ｎ ｇ  barrels */
        gunLength : 0,
        /** How far from the sentry's center that the bullet will come out */
        shootLength : 0,
        /** The recoil, like in turrets, for the sentry gun */
        recoilAmount : 2,
        /** The delay before the gun starts shooting and aiming at enemies */
        armDelay : 50,
        /** How tall the sentry gun is, only changes visually */
        elevation : 2,
        /** Changes how big the circle shadow appears below it */
        shadowSize : 20,
        
        init(b){
            if(!b)return;
            b.data = {
                reload : 0,
                recoil : 0,
            };
            if(this.isBig){
                this.shadowSize = 30;
                this.baseSprite = "sentry-base-big";
                this.despawnEffect = Fx.massiveExplosion;
                this.damage = 4080;
            };
        },
        draw(b){
            Draw.reset(); //dont remove or else blinks when it hits something for some fucking reason

            //draw base
            Draw.rect(Core.atlas.find("spec-" + this.baseSprite), b.x, b.y, 0);

            let tx = b.x + Angles.trnsx(b.rotation(), -b.data.recoil)
            let ty = b.y + Angles.trnsy(b.rotation(), -b.data.recoil)

            //draw gun
            Drawf.shadow(Core.atlas.find("spec-" + this.gunSprite), tx - this.elevation, ty - this.elevation, b.rotation() - 90);
            //gun shadow
            Draw.rect(Core.atlas.find("spec-" + this.gunSprite), tx, ty, b.rotation() - 90)

            //circle shadow uderneath the whole thing
            Draw.z(this.layer - 0.001)
            Draw.color(Color.black);
            Draw.alpha(0.6);
            Draw.rect(Core.atlas.find("circle-shadow"), b.x, b.y, this.shadowSize, this.shadowSize, 0);
        },
        update(b){
            let bullet = this.shootType;
            let target;
            if(bullet.healPercent > 0){
                target = Units.closestTarget(null, b.x, b.y, this.sentryRange,
                    e => e.team != b.team,
                    t => (t.team != b.team || t.damaged()));
            }else{
                target = Units.closestTarget(b.team, b.x, b.y, this.sentryRange);
            }
            if(target != null){
                let targetPos = new Vec2();          

                // predict
                targetPos.set(Predict.intercept(b, target, bullet.speed <= 0.01 ? 99999999 : bullet.speed));
                if(targetPos.isZero()){
                    targetPos.set(target);
                }

                //rotate
                let targetRot = b.angleTo(targetPos);
                if(b.time > this.armDelay)b.rotation(Angles.moveToward(b.rotation(), targetRot, this.rotateSpeed * Time.delta));

                if(Number.isNaN(b.rotation())){
                    b.rotation(0)
                }

                //update shooting
                if(Angles.angleDist(b.rotation(), targetRot) < this.shootCone && b.time > this.armDelay){
                    b.data.reload += Time.delta * bullet.reloadMultiplier;

                    //shoot
                    if(b.data.reload >= this.reloadTime){
                        let tx = b.x + Angles.trnsx(b.rotation(), this.shootLength)
                        let ty = b.y + Angles.trnsy(b.rotation(), this.shootLength)
            
                        for(let i = 0; i < this.shots; i++){
                            bullet.create(b, tx, ty, targetRot + Mathf.range(this.gunInaccuracy + bullet.inaccuracy), 1 + Mathf.range(this.velocityInaccuracy), 1);
                            this.shootSound.at(b);
                        }
        
                        b.data.reload %= this.reloadTime;
                        b.data.recoil = this.recoilAmount
                    }
                }
            }
            b.data.recoil = Mathf.lerpDelta(b.data.recoil, 0, 0.2);
        },
    });
    return Object.assign(base, obj)
};

module.exports = {
    newSentry : newSentry
}