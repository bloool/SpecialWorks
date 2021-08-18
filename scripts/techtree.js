//stolen from spec-js wich is stolen from Gdeft/substructure :) -b

/**
 * Node for the research tech tree.
 *
 * @property {UnlockableContent}    parent          - The parent of the current node.
 * @property {UnlockableContent}    contentType     - The unlockable content that the current node contains.
 * @property {ItemStack}            requirements    - The research requirements required to unlock this node, will use the default if set to null.
 * @property {Seq}                  objectives      - A sequence of Objectives required to unlock this node. Can be null.
 */
const node = (parent, contentType, requirements, objectives) => {
    if(parent != null && contentType != null){
        const tnode = new TechTree.TechNode(TechTree.get(parent), contentType, requirements != null ? requirements : contentType.researchRequirements());
        let used = new ObjectSet();
      
        if(objectives != null) tnode.objectives.addAll(objectives);
    }else{
        print("dumbass");
    }
};

const block = name => Vars.content.getByName(ContentType.block, "spec-" + name);
const item  = name => Vars.content.getByName(ContentType.item,  "spec-" + name);
const unit  = name => Vars.content.getByName(ContentType.unit,  "spec-" + name);

//node(h, h, null, null);

// greens

node(Blocks.lancer, block("revolve"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.windsweptIslands)));
node(block("revolve"), block("scour"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.tarFields)));

// red

node(Blocks.salvo, block("backfire"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.windsweptIslands)));
node(block("backfire"), block("sternflak"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.tarFields)));

// blues

node(Blocks.scatter, block("tine"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.windsweptIslands)));
node(block("tine"), block("trident"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.tarFields), new Objectives.Research(Blocks.fuse)));

// star

node(Blocks.lancer, block("polaris"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.saltFlats)));
node(block("polaris"), block("antares"), null, Seq.with(new Objectives.SectorComplete(SectorPresets.impact0078)));
node(block("polaris"), block(), null, null);

// walls

node(Blocks.thoriumWallLarge, block("small-blast-wall"), null, Seq.with(new Objectives.Research(Items.blastCompound)));
node(block("small-blast-wall"), block("blast-wall"), null, null);

node(Blocks.thoriumWallLarge, block("small-laminated-wall"), null, Seq.with(new Objectives.Research(Items.metaglass)));
node(block("small-laminated-wall"), block("laminated-wall"), null, null);

node(Blocks.thoriumWallLarge, block("small-magnetite-wall"), null, Seq.with(new Objectives.Research(item("magnetite"))));
node(block("small-magnetite-wall"), block("magnetite-wall"), null, null);


