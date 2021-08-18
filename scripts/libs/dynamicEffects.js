function dynamicCircleBoom(rad, points, color, lifetime) {
    let life = lifetime == null ? 50 : lifetime
    const boomCircle = new Effect(life, 100, e => {
        e.scaled(7, b => {
            Draw.color(color, b.fout());
            Fill.circle(e.x, e.y, rad);
        });
    
        Draw.color(color);
        Lines.stroke(e.fout() * 3);
        Lines.circle(e.x, e.y, rad);
    
        let offset = Mathf.randomSeed(e.id, 360);
        for(let i = 0; i < points; i++){
            let angle = i* 360 / points + offset;
            Drawf.tri(e.x + Angles.trnsx(angle, rad), e.y + Angles.trnsy(angle, rad), 6, 50 * e.fout(), angle);
        }
    
        Fill.circle(e.x, e.y, 12 * e.fout());
        Draw.color();
        Fill.circle(e.x, e.y, 6 * e.fout());
        Drawf.light(e.x, e.y, rad * 1.6, color, e.fout());
    });
    
    return boomCircle;
};

function dynamicShine(size, color1, color2){
    const shine = new Effect(40, 100, e => {
        Draw.color(color1);
        for(let i = 0; i < 4; i++){
            Drawf.tri(e.x, e.y, size/8, size * e.fout(), i*90);
        }
        
        let c = color2 == null? Color.valueOf("ffffffff") : color2

        Draw.color(c);
        for(let i = 0; i < 4; i++){
            Drawf.tri(e.x, e.y, size/8/2, size/2 * e.fout(), i*90);
        }
    });

    return shine;
}

function dynamicWave(size, lifetime, color, implode){
    const wave = new Effect(lifetime, 100, e => {
        let fade = implode == false || implode == null ? e.fin() : e.fout()

        Draw.color(color, fade);
        Lines.stroke(e.fout() * 3);
        Lines.circle(e.x, e.y, fade * size);
    });

    return wave;
}

module.exports = {
    circleBoom : dynamicCircleBoom,
    shine      : dynamicShine,
    wave       : dynamicWave,
}