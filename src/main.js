;(function(exports) {
    var Game = function() {

        var time = 0, 
            logger = 0,
            count = 0,
            player;

        //this.c = new Coquette(this, "canvas", 1280, 1000, "#444");
          this.c = new Coquette(this, "canvas", 1280, 500, "#444");
        //this.c = new Coquette(this, "canvas", 1280, 500)

      //this.c.renderer._ctx.imageSmoothingEnabled = false;
      //this.c.renderer._ctx.webkitImageSmoothingEnabled = false;
      //this.c.renderer._ctx.mozImageSmoothingEnabled = false;

        this.getTime = function() {
            return time;
        }

        this.resourcer = Resourcer();
        this.resourcer.load(
            [ 'images/Robot/Boost/124x106/Boot_legs_L.png'
            , 'images/Robot/Boost/124x106/Boot_legs_R.png'
            , 'images/Robot/Boost/124x106/Boost_Top_L.png'
            , 'images/Robot/Boost/124x106/Boost_Top_R.png'
            , 'images/Robot/Boost/162x106/Boost_slash_top_L.png'
            , 'images/Robot/Boost/162x106/Boost_slash_top_R.png'
            , 'images/Robot/Boost/124x106/Boost_laser_L.png'
            , 'images/Robot/Boost/124x106/Boost_laser_R.png'
            , 'images/Robot/Jump/90x112/Jump_Left.png'
            , 'images/Robot/Jump/90x112/Jump_Right.png'
            , 'images/Robot/Walk/97x106/Walk_L.png'
            , 'images/Robot/Walk/97x106/Walk_R.png'
            , 'images/Robot/Walk/192x106/Walk_slash_charge_L.png'
            , 'images/Robot/Walk/192x106/Walk_slash_charge_R.png'
            , 'images/Robot/Walk/192x106/Walk_slash_release_L.png'
            , 'images/Robot/Walk/192x106/Walk_slash_release_R.png'
            , 'images/Robot/Walk/192x106/Walk_slash_swing_L.png'
            , 'images/Robot/Walk/192x106/Walk_slash_swing_R.png'
            , 'images/Robot/Stand/76x104/Stand_L.png'
            , 'images/Robot/Stand/76x104/Stand_R.png'
            , 'images/Robot/Fall/166x130/Falling_Slash_L.png'
            , 'images/Robot/Fall/166x130/Falling_Slash_R.png'
            , 'images/Robot/Fall/62x126/Falling_Body_L.png'
            , 'images/Robot/Fall/62x126/Falling_Body_R.png'
            , 'images/Robot/Fall/62x126/Falling_Legs_L.png'
            , 'images/Robot/Fall/62x126/Falling_Legs_R.png'
            , 'images/Robot/Fall/558x126/Falling_Laser_Body_L.png'
            , 'images/Robot/Fall/558x126/Falling_Laser_Body_R.png'
            , 'images/Robot/Fall/558x126/Falling_Laser_Legs_L.png'
            , 'images/Robot/Fall/558x126/Falling_Laser_Legs_R.png'
            , 'images/Robot/Crouch/Crouch_80x62/Crouch_Laser_L.png'
            , 'images/Robot/Crouch/Crouch_80x62/Crouch_Laser_R.png'
            , 'images/Robot/Crouch/Passive_80x62/Crouch_Passive_L.png'
            , 'images/Robot/Crouch/Passive_80x62/Crouch_Passive_R.png'
            , 'images/Robot/Crouch/Stab_134x62/Crouch_Stab_L.png'
            , 'images/Robot/Crouch/Stab_134x62/Crouch_Stab_R.png'
            , 'images/Robot/PFX/48x14/Boost_pfx_L.png'
            , 'images/Robot/PFX/48x14/Boost_pfx_R.png'
            , 'images/Robot/PFX/250x50/Boost_slash_pfx_L.png'
            , 'images/Robot/PFX/250x50/Boost_slash_pfx_R.png'
            , 'images/Robot/PFX/362x20/Laser_PFX_L.png'
            , 'images/Robot/PFX/362x20/Laser_PFX_R.png'
            ], function(url, counter, total){
                var name = /([^\/]*)\.[a-z3]+$/.exec(url)[1];
                console.log("Loaded: " + name + " " + counter + "/" + total);
            }
        );


        this.sequencer = ButtonSequencer(this);

        this.c.entities.create(Player, { 
            center: { x:10, y:110 },
            size:   { x:124, y:106 }
        });

        this.c.entities.create(Enemy, { 
            center: { x:10, y:110 },
            size:   { x:60, y:100 }
        });

        this.c.entities.create(Platform, {
            size:   { x: 1280, y: 30 },
            center: { x: 640, y: 400 }
        });

        player = this.c.entities.all(Player)[0];

//      this.scener.start(this, LoadScene);
        var update = function(interval) { 
            time += interval;
//          this.scener.update(interval);
            this.sequencer.update(interval, this.c.inputter.getEvents());
            this.c.renderer.setViewCenter(player.center); 
        }

        this.update = function(){
            if (game.resourcer.isReady) {
                this.update = update;
            }
        } 
    };

    exports.Game = Game;

}(this));
