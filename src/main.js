;(function(exports) {
    var Game = function() {
        var self = this;

        this.timer = Timer();
        this.c = new Coquette(this, "canvas", config.Game.Width, config.Game.Height);
        this.resourcer = new Resourcer(config.Game.Resources);
        this.scener = new Scener(this, config.Game.Scenes);
        this.sequencer = ButtonSequencer(this);
//      this.layerer = new Layerer(this, config.Game.Drawables, config.Game.Canvases);
        console.log(this.layerer);

        this.scener.start("Load");

        this.update = function(delta) { 
            this.timer.add(delta);
            this.sequencer.update(delta, this.c.inputter.getEvents());
            this.scener.update(delta);
//          this.layerer.update(delta);
        }
    };
    exports.Game = Game;
}(this));
