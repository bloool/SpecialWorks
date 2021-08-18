//its fucking stealing code time lets go
const hyperMender = extend(MendProjector, "hyper-mender", {
    size : 3,
    reload : 30,
    range : 100,
    healPercent : 2,
    phaseBoost : 15,
    health : 80 * 3 * 3,
    update: true,
})
hyperMender.consumes.item(Items.phaseFabric).boost();
hyperMender.consumes.power(1.5);
hyperMender.buildType = () => extend(MendProjector.MendBuild, hyperMender, {
    timerH : 0,
    wasHealed : false,
    healPercent : 2,
    healRange : 100,
    healReload: 30, //dont know why but some fucking reason it reads shit like this.reload and undefiened so I have to make it here :)
    updateTile(){
        this.super$updateTile();

        this.timerH += Time.delta;

        if(this.timerH >= this.healReload){
            print("attempted reload!")
            this.wasHealed = false;

            Units.nearby(this.team, this.x, this.y, this.healRange, cons(unit => {
                if(unit.damaged()){
                    Fx.heal.at(unit);
                    this.wasHealed = true;
                }
                unit.heal(this.healPercent);
                print("attempted heal!")
            }));

            if(this.wasHealed){
                Fx.healWaveDynamic.at(this, this.healRange);
            };

            this.timerH = 0;
        };
    }
})
hyperMender.setupRequirements(Category.effect, ItemStack.with(
    Items.copper, 1,
));