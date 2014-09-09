;(function(exports) {
    var Game = function() {

        this.c = new Coquette(this, "canvas", 1280, 500, "#000");

        this.images = {
            dinosaur_stand: new Image(),
            dinosaur_walk: new Image(),
        };

        this.images['dinosaur_stand'].src = 'images/trex-stand2X.png';
        this.images['dinosaur_walk'].src =  'images/trex-walk2X.png';

        // Should be encapsulated, so that it cannot be set!
        this.totalTime = 0;
        this.sequencer = ButtonSequencer(this);


        this.c.entities.create(Player, { 
            center: { x:10, y:110 },
            size: { x:212, y:122 }
        });
        this.c.entities.create(Platform, {
            size:   { x: 1280, y: 30 },
            center: { x: 640, y: 400 }
        });

        var logger = 0,
            count = 0,
            player = this.c.entities.all(Player)[0];

        this.update = function(interval) { 
            if (count > 100) {
                logger = count = 0;
            }
            count += 1;
            logger += interval;
            this.totalTime += interval;
            // if (count % 30 === 0) {
            //     console.log(count/logger * 1000 );
            // }

            this.sequencer.update(interval, this.c.inputter.getEvents());
            //console.log(player);
            this.c.renderer.setViewCenter(player.center);
        }
    };

    exports.Game = Game;
}(this));
