;(function(exports) {
    var Game = function() {

        var time = 0, 
            logger = 0,
            count = 0,
            player;

        this.c = new Coquette(this, "canvas", 1280, 500, "#444");

        this.images = {
            Boost_Top_L:          new Image(),
            Boost_Top_R:          new Image(),
            Boost_Legs_L:         new Image(),
            Boost_Legs_R:         new Image(),
            Boost_Slash_L:        new Image(),
            Boost_Slash_R:        new Image(),
            Boost_Laser_L:        new Image(),
            Boost_Laser_R:        new Image(),
            Walk_L:               new Image(),
            Walk_R:               new Image(),
            Jump_L:               new Image(),
            Jump_R:               new Image(),
        //  Walk_Slash_Charge_L:  new Image(),
            Walk_Slash_Charge_R:  new Image(),
        //  Walk_Slash_Release_L: new Image(),
            Walk_Slash_Release_R: new Image(),
        //  Walk_Slash_Swing_L:   new Image(),
            Walk_Slash_Swing_R:   new Image(),
            Stand_L:              new Image(),
            Stand_R:              new Image(),
            Falling_Slash_L:      new Image(),
            Falling_Slash_R:      new Image(),
            Falling_Laser_Top_L:  new Image(),
            Falling_Laser_Top_R:  new Image(),
            Falling_Laser_Legs_L: new Image(),
            Falling_Laser_Legs_R: new Image(),
            Falling_Top_L:        new Image(),
            Falling_Top_R:        new Image(),
            Falling_Legs_L:       new Image(),
            Falling_Legs_R:       new Image(),
            Falling_Laser_Top_L:  new Image(),
            Falling_Laser_Top_R:  new Image(),
            Falling_Laser_Legs_L: new Image(),
            Falling_Laser_Legs_R: new Image(),
            PFX_Boost_L:          new Image(),
            PFX_Boost_R:          new Image(),
            PFX_Boost_Slash_L:    new Image(),
            PFX_Boost_Slash_R:    new Image(),
//          PFX_Laser_L:          new Image(),
            PFX_Laser_R:          new Image()
       };

        this.getTime = function() {
            return time;
        }

        var boostBaseUrl = 'images/Robot/Boost/';
        var walkBaseUrl = 'images/Robot/Walk/';
        var standBaseUrl = 'images/Robot/Stand/';
        this.images['Boost_Legs_L'].src         = 'images/Robot/Boost/124x106/Boot_legs_L.png';
        this.images['Boost_Legs_R'].src         = 'images/Robot/Boost/124x106/Boot_legs_R.png';
        this.images['Boost_Top_L'].src          = 'images/Robot/Boost/124x106/Boost_Top_L.png';
        this.images['Boost_Top_R'].src          = 'images/Robot/Boost/124x106/Boost_Top_R.png';
        this.images['Boost_Slash_L'].src        = 'images/Robot/Boost/124x106/Boost_slash_L.png';
        this.images['Boost_Slash_R'].src        = 'images/Robot/Boost/124x106/Boost_slash_R.png';
        this.images['Boost_Laser_L'].src        = 'images/Robot/Boost/124x106/Boost_laser_L.png';
        this.images['Boost_Laser_R'].src        = 'images/Robot/Boost/124x106/Boost_laser_R.png';
        this.images['Jump_L'].src               = 'images/Robot/Jump/90x112/Jump_Left.png';
        this.images['Jump_R'].src               = 'images/Robot/Jump/90x112/Jump_Right.png';
        this.images['Walk_L'].src               = 'images/Robot/Walk/97x106/97x106_Walk_L.png';
        this.images['Walk_R'].src               = 'images/Robot/Walk/97x106/97X106_Walk_R.png';
  //    this.images['Walk_Slash_Charge_L'].src  = 'images/Robot/Walk/192x106/Walk_slash_charge_L.png';
        this.images['Walk_Slash_Charge_R'].src  = 'images/Robot/Walk/192x106/Walk_slash_charge_R.png';
  //    this.images['Walk_Slash_Release_L'].src = 'images/Robot/Walk/192x106/Walk_slash_release_L.png';
        this.images['Walk_Slash_Release_R'].src = 'images/Robot/Walk/192x106/Walk_slash_release_R.png';
  //    this.images['Walk_Slash_Swing_L'].src   = 'images/Robot/Walk/192x106/Walk_slash_swing_L.png';
        this.images['Walk_Slash_Swing_R'].src   = 'images/Robot/Walk/192x106/Walk_slash_swing_R.png';
        this.images['Stand_L'].src              = 'images/Robot/Stand/76x104/Stand_L.png';
        this.images['Stand_R'].src              = 'images/Robot/Stand/76x104/Stand_R.png';
        this.images['Falling_Slash_L'].src      = 'images/Robot/Fall/166x130/Falling_Slash_L.png';
        this.images['Falling_Slash_R'].src      = 'images/Robot/Fall/166x130/Falling_Slash_R.png';
        this.images['Falling_Top_L'].src        = 'images/Robot/Fall/62x126/Falling_Body_L.png';
        this.images['Falling_Top_R'].src        = 'images/Robot/Fall/62x126/Falling_Body_R.png';
        this.images['Falling_Legs_L'].src       = 'images/Robot/Fall/62x126/Falling_Legs_L.png';
        this.images['Falling_Legs_R'].src       = 'images/Robot/Fall/62x126/Falling_Legs_R.png';
        this.images['Falling_Laser_Top_L'].src  = 'images/Robot/Fall/558x126/Falling_Laser_Body_L.png';
        this.images['Falling_Laser_Top_R'].src  = 'images/Robot/Fall/558x126/Falling_Laser_Body_R.png';
        this.images['Falling_Laser_Legs_L'].src = 'images/Robot/Fall/558x126/Falling_Laser_Legs_L.png';
        this.images['Falling_Laser_Legs_R'].src = 'images/Robot/Fall/558x126/Falling_Laser_Legs_R.png';
        this.images['PFX_Boost_L'].src          = 'images/Robot/PFX/48x14/Boost_pfx_L.png';
        this.images['PFX_Boost_R'].src          = 'images/Robot/PFX/48x14/Boost_pfx_R.png';
        this.images['PFX_Boost_Slash_L'].src    = 'images/Robot/PFX/250x50/Boost_slash_pfx_L.png';
        this.images['PFX_Boost_Slash_R'].src    = 'images/Robot/PFX/250x50/Boost_slash_pfx_R.png';
//      this.images['PFX_Laser_L'].src          = 'images/Robot/PFX/362x20/Laser_PFX_L.png';
        this.images['PFX_Laser_R'].src          = 'images/Robot/PFX/362x20/Laser_PFX_R.png';

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

//      this.scener.start(this, LoadScene);
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
//          this.scener.update(interval);
            this.sequencer.update(interval, this.c.inputter.getEvents());
            this.c.renderer.setViewCenter(player.center); 
        }



    };

    exports.Game = Game;

}(this));
