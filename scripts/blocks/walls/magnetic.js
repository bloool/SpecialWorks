let colors = require("libs/colors");

const magneticWall = extend(Wall, "magnetite-wall", {
    health : 3200,
    size : 2,
    update: true
});

magneticWall.buildType = () => extend(Wall.WallBuild, magneticWall, {
    magStrength : 1,
    magRadius : 40, //for some reason if I dont declare them here they decide to just not fucking work
    updateTile(){
        this.super$updateTile();
        Groups.bullet.intersect(this.x - this.magRadius, this.y - this.magRadius, this.magRadius*2, this.magRadius*2, cons(b => {
            if(b != this.team){
                let randomSide = Mathf.randomSeed(b.id, 1) > 0.5 ? -1 : 1
                b.rotation(b.rotation() + this.magStrength * randomSide + Mathf.range(0.5))
            }
        }));
    },
    draw(){
        this.super$draw();

        Draw.z(95);
        Draw.color(colors.magnetiteLight);
        Draw.alpha(0.4);
        Fill.rect(this.x, this.y, this.magRadius, this.magRadius);
    },
})

magneticWall.setupRequirements(Category.defense, ItemStack.with(
    Items.copper, 1,
));


const smallMagneticWall = extend(Wall, "small-magnetite-wall", {
    health : 3200 / 4,
    size : 1,
    update: true
});

smallMagneticWall.buildType = () => extend(Wall.WallBuild, smallMagneticWall, {
    magStrength : 0.25,
    magRadius : 10,
    updateTile(){
        this.super$updateTile();
        Groups.bullet.intersect(this.x - this.magRadius, this.y - this.magRadius, this.magRadius*2, this.magRadius*2, cons(b => {
            if(b != this.team){
                let randomSide = Mathf.randomSeed(b.id, 1) > 0.5 ? -1 : 1
                b.rotation(b.rotation() + this.magStrength * randomSide + Mathf.range(0.5))
            }
        }));
    },
    draw(){
        this.super$draw();

        Draw.z(95);
        Draw.color(colors.magnetiteLight);
        Draw.alpha(0.4);
        Fill.rect(this.x, this.y, this.magRadius, this.magRadius);
    },
})

smallMagneticWall.setupRequirements(Category.defense, ItemStack.with(
    Items.copper, 1,
));

