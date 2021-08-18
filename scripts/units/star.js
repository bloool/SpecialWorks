let colors = require("libs/colors");

const magnum = extend(UnitType, "magnum", {
    drag : 0.1,
    speed : 0.6,
    hitSize : 23,
    health : 8000,
    armor : 6,

    rotateSpeed : 10,

    legCount : 4,
    legMoveSpace : 1,
    legPairOffset : 3,
    legLength : 15,
    legExtension : -15,
    legBaseOffset : 10,
    landShake : 1,
    legLengthScl : 0.96,
    rippleScale : 2,
    legSpeed : 0.2,
    buildSpeed : 1,

    hovering : true,
    allowLegStep : true,
    visualElevation : 0.65,
    groundLayer : Layer.legUnit,

    load(){
        this.super$load();
        this.blade = Core.atlas.find(this.name + "-blade");
    },

    draw(u){
        this.super$draw(u);
        Draw.z(Layer.effect);

        //blade
        Draw.rect(this.blade, u.x + Angles.trnsx(u.rotation, 8), u.y + Angles.trnsy(u.rotation, 8), u.rotation - 90);

        //glowing ball
        let size = 7 + Mathf.absin(Time.time, 11, 5);

        Draw.color(colors.starLight);
        Fill.circle(u.x + Angles.trnsx(u.rotation, 2), u.y + Angles.trnsy(u.rotation, 2), size * 0.5);

        Draw.color();
        Fill.circle(u.x + Angles.trnsx(u.rotation, 2), u.y + Angles.trnsy(u.rotation, 2), size * 0.25);
    },
});
magnum.constructor = () => extend(LegsUnit, {});

const rotatingShine = new Effect(40, 100, e => {
    let size = 80

    Draw.color(colors.starLight);
    Drawf.tri(e.x, e.y, size/8 * 2, size * 2 * e.fout(), e.rotation + 180); // back big triangle
    for(let i = 0; i < 4; i++){ //rotating shine
        Drawf.tri(e.x, e.y, size/8 * e.fout(), size, 30 * e.fout() + i*90);
    }
    
    //same thing but smaller and white for the center
    Draw.color();
    Drawf.tri(e.x, e.y, size/8/2 * 2, size/2 * 2 * e.fout(), e.rotation + 180);
    for(let i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, size/8/2 * e.fout(), size/2, 30 * e.fout() + i*90);
    }
});

const slash = new Effect(30, e => {
    Draw.color(colors.starLight);

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 18 * e.fout(), 40, e.rotation + 90 * i + Mathf.randomSeed(e.id, 360));
    }
});

const trailUpdate = new Effect(30, e => {
    Draw.color(colors.starLight);

    for(let i of Mathf.signs){
        Drawf.tri(e.x, e.y, 20 * e.fout(), 20, e.rotation + 90 + 90 * i);
    }
});

const damage = extend(RailBulletType, {
    shootEffect : Fx.none,
    smokeEffect : Fx.none,
    length : 150,
    updateEffectSeg : 20,
    pierceEffect : slash,
    updateEffect : trailUpdate,
    hitEffect : Fx.none,
    damage : 125,
    pierceDamageFactor : 0,
    recoil: -20,
    init(b){ //manually spawning it like this so it doesnt follow with the unit
        if(!b)return;
        this.super$init(b);
        rotatingShine.at(b.x, b.y, b.rotation());
    }
});

const dash = extend(Weapon, {
    shootSound : Sounds.release,
    top : false,
    mirror : false,
    shootY : 0,
    x : 0,
    y : 0,
    reload : 25,
    bullet : damage
});

magnum.weapons.add(dash);


const pavorus = extend(UnitType, "pavorus", {
    drag : 0.1,
    speed : 1,
    health : 900,
    armor : 6,

    rotateSpeed : 10,

    legCount : 4,
    legLength : 10,
    legTrns : 0.6,
    legMoveSpace : 1.5,
    legBaseOffset : 2,

    hovering : true,
    allowLegStep : true,
    visualElevation : 0.50,
    groundLayer : Layer.legUnit,

    dashRange : 20, // how close a bullet needs to be for the unit to dash
    dashDodge : 500, // how far it will dash

    _timer : 0,
    _shouldDash : true,
    dashReload : 25,

    draw(u){
        this.super$draw(u);
        Draw.z(Layer.effect);

        //glowing ball
        let size = 4 + Mathf.absin(Time.time, 8, 4);

        Draw.color(colors.starLight);
        Fill.circle(u.x + Angles.trnsx(u.rotation, -2), u.y + Angles.trnsy(u.rotation, -2), size * 0.5);

        Draw.color();
        Fill.circle(u.x + Angles.trnsx(u.rotation, -2), u.y + Angles.trnsy(u.rotation, -2), size * 0.25);

    },
    update(u){
        this.super$update(u);

        this._timer += Time.delta;

        Groups.bullet.intersect(u.x - this.dashRange, u.y - this.dashRange, this.dashRange*2, this.dashRange*2, cons(b => {
            if(b != null && b.team != u.team && this._shouldDash){
                let randomSide = Mathf.randomSeed(b.id, 1) > 0.5 ? -1 : 1
                let pos = new Vec2(
                    Angles.trnsx(b.rotation() + 90 * randomSide, this.dashDodge),
                    Angles.trnsy(b.rotation() + 90 * randomSide, this.dashDodge)
                );
                u.impulse(pos);
                this._shouldDash = false;
                this._timer = 0;
            }
        }));
        if(this._timer > this.dashReload){
            this._shouldDash = true;
            this._timer = 0;
        }
    }
});
pavorus.constructor = () => extend(LegsUnit, {});

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

const star = extend(BasicBulletType, {
    sprite : "large-bomb",
    width : 16,
    height : 24,
    speed : 6,
    lifetime : 30,

    damage: 80,

    pierce : true,

    shootEffect: Fx.none,
    hitEffect : rotatingShineBig,
	despawnEffect : Fx.railHit,
    backColor : colors.starLight,

    shrinkY : 0,
    searchRange : 300,

    draw(b){
        triTrail.at(b.x, b.y, b.rotation())
        this.super$draw(b);
    }
});

const starShooter = extend(Weapon, {
    //shootSound : Sounds.release,
    top : false,
    mirror : false,
    shootY : 0,
    x : 0,
    y : 0,
    reload : 20,
    bullet : star
});

pavorus.weapons.add(starShooter);


