const lamina = extend(Wall, "laminated-wall", {
    health : 2800,
    size : 2,
    update: true
});
lamina.buildType = () => extend(Wall.WallBuild, lamina, {
    collision(b){
        this.super$collision(b);
        for(let i = 0; i < b.damage * 0.2; i++){
            Bullets.fragGlassFrag.create(this, this.team, this.x, this.y, b.rotation() + 180 + Mathf.range(10), Mathf.random(0.5, 1.5), Mathf.random(0.5, 1.5));
        }
        b.remove()
        return true // true so it considers the collision
    }
});
lamina.setupRequirements(Category.defense, ItemStack.with(
    Items.copper, 1,
));

const smallLamina = extend(Wall, "small-laminated-wall", {
    health : 2800 / 4,
    size : 1,
    update: true
});
smallLamina.buildType = () => extend(Wall.WallBuild, smallLamina, {
    collision(b){
        this.super$collision(b);
        for(let i = 0; i < b.damage * 0.2; i++){
            Bullets.fragGlassFrag.create(this, this.team, this.x, this.y, b.rotation() + 180 + Mathf.range(10), Mathf.random(0.5, 1.5), Mathf.random(0.5, 1.5));
        }
        b.remove()
        return true // true so it considers the collision
    }
});
smallLamina.setupRequirements(Category.defense, ItemStack.with(
    Items.copper, 1,
));