;(function(exports) {
    var Game = function() {
        var self = this;

        this.timer = Timer();
        this.c = new Coquette(this, "canvas", 1280, 500);
        this.resourcer = new Resourcer(config.Player.Resources);
        this.scener = new Scener(this, config.Game.Scenes);
        this.sequencer = ButtonSequencer(this);

        this.scener.start("Load");

        this.update = function(delta) { 
            this.timer.add(delta);
            this.sequencer.update(delta, this.c.inputter.getEvents());
            this.scener.update(delta);
        }
    };

    exports.Game = Game;
}(this));

//      this.parallaxer = new Parallaxer(this, "bg_canvas", config.Game.Layers);
//      this.parallaxer.push("LayerName");
//      this.parallaxer.clear();
//      parallaxer 
//      
