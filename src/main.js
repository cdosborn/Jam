;(function(exports) {
    var Game = function() {

        this.c = new Coquette(this, "canvas", 1280, 500, "#000");

        this.totalTime = 0;
        this.sequencer = ButtonSequencer(this);

        this.c.entities.create(Player);
        this.c.entities.create(Platform, {
            size:   { x: 720, y: 10 },
            center: { x: 360, y: 350 }
        });


        this.update = function(interval) { 
            this.totalTime += interval;
            this.sequencer.update(interval, this.c.inputter.getEvents());
            //this.sequencer.reset();
        }
    };

    exports.Game = Game;
}(this));
