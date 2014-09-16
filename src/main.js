;(function(exports) {
    var Game = function() {

        var time = 0, 
            logger = 0,
            count = 0,
            player;

        this.c = new Coquette(this, "canvas", 1280, 500, "#444");

        this.images = {
            Boost_Top_L:   new Image(),
            Boost_Top_R:   new Image(),
            Boost_Legs_L:  new Image(),
            Boost_Legs_R:  new Image(),
            Boost_slash_L: new Image(),
            Boost_slash_R: new Image(),
            Walk_L:        new Image(),
            Walk_R:        new Image(),
            Stand_L:       new Image(),
            Stand_R:       new Image()
       };

        this.getTime = function() {
            return time;
        }

//      this.images['dinosaur_stand'].src = 'images/trex-stand2X.png';
//      this.images['dinosaur_walk'].src =  'images/trex-walk2X.png';
//      this.images['dinosaur_melee'].src = 'images/trex-eat2X.png';

        var boostBaseUrl = 'images/Robot/Boost/';
        var walkBaseUrl = 'images/Robot/Walk/';
        var standBaseUrl = 'images/Robot/Stand/';
        this.images['Boost_Legs_L'].src  = 'images/Robot/Boost/124x106/Boot_legs_L.png';
        this.images['Boost_Legs_R'].src  = 'images/Robot/Boost/124x106/Boot_legs_R.png';
        this.images['Boost_Top_L'].src   = 'images/Robot/Boost/124x106/Boost_Top_L.png';
        this.images['Boost_Top_R'].src   = 'images/Robot/Boost/124x106/Boost_Top_R.png';
        this.images['Boost_slash_L'].src = 'images/Robot/Boost/124x106/Boost_slash_L.png';
        this.images['Boost_slash_R'].src = 'images/Robot/Boost/124x106/Boost_slash_R.png';
        this.images['Walk_L'].src        = 'images/Robot/Walk/97x106/97x106_Walk_L.png';
        this.images['Walk_R'].src        = 'images/Robot/Walk/97x106/97X106_Walk_R.png';
        this.images['Stand_L'].src       = 'images/Robot/Stand/76x104/Stand_L.png';
        this.images['Stand_R'].src       = 'images/Robot/Stand/76x104/Stand_R.png';
//      this.images['Boost_slash_R'].src = boostBaseUrl + 'Boost_Slash/Boost_slash_R.png';
//      this.images['Boost_slash_L'].src = boostBaseUrl + 'Boost_Slash/Boost_slash_L.png';

//      this.images['Walk_Legs_L'].src =  'images/Robot/Walk_Legs/Walk_Legs.png';
//      this.images['Walk_Legs_R'].src =  'images/Robot/Walk_Upper/Walk.png';
//      this.images['Walk_Top_L'].  c =  'images/Robot/Walk_Legs/Walk_Legs.png';
//      this.images['Walk_Top_R'].src =  'images/Robot/Walk_Upper/Walk.png';
//      this.images['player_stand'].src =   'images/Robot/Walk_Legs/Walk_Legs.png';
//      this.images['player_melee'].src =   'images/Robot';


        this.sequencer = ButtonSequencer(this);

        this.c.entities.create(Player, { 
            center: { x:10, y:110 },
            size: { x:124, y:106 }
        });

        this.c.entities.create(Enemy, { 
            center: { x:10, y:110 },
            size: { x:60, y:100 }
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
