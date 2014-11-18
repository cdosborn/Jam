;(function(exports) {
    var Game = function() {
        var self = this;

        // Main coquette modules
        this.c = new Coquette(this, "canvas", config.Game.Width, config.Game.Height);

        // Project specific modules
        this.timer     = Timer();
        this.resourcer = new Resourcer(config.Game.Resources);
        this.scener    = new Scener(this, config.Game.Scenes);
        this.sequencer = ButtonSequencer(this);
        this.layerer   = new Layerer(this, config.Game.Drawables, config.Game.Canvases);

        this.update = function(delta) { 
            this.timer.add(delta);
            this.sequencer.update(delta, this.c.inputter.getEvents());
            this.scener.update(delta);
            this.layerer.update(delta);
        }

        this.scener.start("Load");

    };
    exports.Game = Game;
}(this));
