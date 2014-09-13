;(function(exports) {
    var Game = function() {

        var time = 0, 
            logger = 0,
            count = 0,
            player;

        this.c = new Coquette(this, "canvas", 1280, 500, "#000");


        var ctx = document.getElementById("canvas").getContext('2d');

        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;


        this.images = {
            dinosaur_stand: new Image(),
            dinosaur_walk: new Image(),
            dinosaur_melee: new Image(),
            player_walk_right_bottom: new Image(),
            player_walk_right_top: new Image()
        };

        this.getTime = function() {
            return time;
        }

        this.images['dinosaur_stand'].src = 'images/trex-stand2X.png';
        this.images['dinosaur_walk'].src =  'images/trex-walk2X.png';
        this.images['dinosaur_melee'].src = 'images/trex-eat2X.png';
//      this.images['player_stand'].src =   'images/Robot/Walk_Legs/Walk_Legs.png';
        this.images['player_walk_right_bottom'].src = 'images/Robot/Walk_Legs/Walk_Legs.png';
        this.images['player_walk_right_top'].src =    'images/Robot/Walk_Upper/Walk.png';
//      this.images['player_melee'].src =   'images/Robot';


        this.sequencer = ButtonSequencer(this);

        this.c.entities.create(Player, { 
            center: { x:10, y:110 },
            size: { x:50, y:100 }
        });


        this.c.entities.create(Platform, {
            size:   { x: 1280, y: 30 },
            center: { x: 640, y: 400 }
        });

        player = this.c.entities.all(Player)[0];

        this.update = function(interval) { 
            if (count > 100) { 
                logger = count = 0;
            }
            count += 1;
            logger += interval;
            time += interval;
            // if (count % 30 === 0) {
            // //     console.log(count/logger * 1000 );
            // // }
            //
            this.sequencer.update(interval, this.c.inputter.getEvents());
            this.c.renderer.setViewCenter(player.center); 
        }



    };

    exports.Game = Game;

}(this));
