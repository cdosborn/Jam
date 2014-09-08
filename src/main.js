;(function(exports) {
    var Game = function() {

        this.c = new Coquette(this, "canvas", 1280, 500, "#000");

        // Should be encapsulated, so that it cannot be set!
        this.totalTime = 0;
        this.sequencer = ButtonSequencer(this);

        this.c.entities.create(Player);
        this.c.entities.create(Platform, {
            size:   { x: 720, y: 10 },
            center: { x: 360, y: 350 }
        });

        var logger = 0,
            count = 0;

        count = 0;
        this.update = function(interval) { 
            if (count > 100) {
                logger = count = 0;
            }
            count += 1;
            logger += interval;
            this.totalTime += interval;
          //console.log(logger/count);
            this.sequencer.update(interval, this.c.inputter.getEvents());
        }
    };

    exports.Game = Game;
}(this));
