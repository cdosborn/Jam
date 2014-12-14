(function(exports){
    var player_resources = [
        {
            name: "Boost_Legs_R",
            url: "images/Robot/Boost/124x106/Boot_legs_R.png",
        },
        {
            name: "Boost_Legs_L", 
            url: "images/Robot/Boost/124x106/Boot_legs_L.png", 
        },
        {
            name: "Boost_Top_R",
            url: "images/Robot/Boost/124x106/Boost_Top_R.png",
        },
        {
            name: "Boost_Top_L",
            url: "images/Robot/Boost/124x106/Boost_Top_L.png",
        },
        { 
            name: "Boost_Slash_L",
            url: "images/Robot/Boost/162x106/Boost_slash_top_L.png",
        },   
        { 
            name: "Boost_Slash_R",
            url: "images/Robot/Boost/162x106/Boost_slash_top_R.png",
        },
        {
            name: "Boost_Laser_L",
            url: "images/Robot/Boost/124x106/Boost_laser_L.png",
        },
        {
            name: "Boost_Laser_R",
            url: "images/Robot/Boost/124x106/Boost_laser_R.png",
        },
        {
            name: "Jump_L",
            url: "images/Robot/Jump/90x112/Jump_Left.png",
        },
        {
            name: "Jump_R",
            url: "images/Robot/Jump/90x112/Jump_Right.png",
        },
        {
            name: "Crouch_Laser_L",
            url: "images/Robot/Crouch/Crouch_80x62/Crouch_Laser_L.png",
        },
        {
            name: "Crouch_Laser_R",
            url: "images/Robot/Crouch/Crouch_80x62/Crouch_Laser_R.png",
        },
        {
            name: "Crouch_L",
            url: "images/Robot/Crouch/Passive_80x62/Crouch_Passive_L.png",
        },
        {
            name: "Crouch_R",
            url: "images/Robot/Crouch/Passive_80x62/Crouch_Passive_R.png",
        },
        { 
            name: "Crouch_Stab_L",
            url: "images/Robot/Crouch/Stab_134x62/Crouch_Stab_L.png",
        },
        { 
            name: "Crouch_Stab_R",
            url: "images/Robot/Crouch/Stab_134x62/Crouch_Stab_R.png",
        },
        {
            name: "Walk_L", 
            url: "images/Robot/Walk/Walk_L_90x106.png",
        },
        {
            name: "Walk_R", 
            url: "images/Robot/Walk/Walk_R_90x106.png",
        },
        {
            name: "Walk_Slash_Swing_R",
            url: "images/Robot/Walk/186x106/Walk_Slash_Swing_R.png",
        },
        {
            name: "Walk_Slash_Swing_L",
            url: "images/Robot/Walk/186x106/Walk_Slash_Swing_L.png",
        },
        {
            name: "Walk_Slash_Charge_R",
            url: "images/Robot/Walk/192x106/Walk_slash_charge_R.png",
        },
        {
            name: "Walk_Slash_Charge_L",
            url: "images/Robot/Walk/192x106/Walk_slash_charge_L.png",
        },
        {
            name: "Walk_Slash_Release_R",
            url: "images/Robot/Walk/192x106/Walk_slash_release_R.png",
        },
        {
            name: "Walk_Slash_Release_L",
            url: "images/Robot/Walk/192x106/Walk_slash_release_L.png",
        },
        {
            name: "Stand_R",
            url: "images/Robot/Stand/76x104/Stand_R.png",
        },
        {
            name: "Stand_L",
            url: "images/Robot/Stand/76x104/Stand_L.png",
        },
        {
            name: "Falling_Top_L",
            url: "images/Robot/Fall/62x126/Falling_Body_L.png",
        },
        {
            name: "Falling_Top_R",
            url: "images/Robot/Fall/62x126/Falling_Body_R.png",
        },
        {
            name: "Falling_Legs_L",
            url: "images/Robot/Fall/62x126/Falling_Legs_L.png",
        },
        {
            name: "Falling_Legs_R",
            url: "images/Robot/Fall/62x126/Falling_Legs_R.png",
        },
        {
            name: "Falling_Slash_L",
            url: "images/Robot/Fall/166x130/Falling_Slash_L.png",
        },
        {
            name: "Falling_Slash_R",
            url: "images/Robot/Fall/166x130/Falling_Slash_R.png",
        },
        {
            name: "Falling_Laser_Top_L",
            url: "images/Robot/Fall/558x126/Falling_Laser_Body_L.png",
        },
        {
            name: "Falling_Laser_Top_R",
            url: "images/Robot/Fall/558x126/Falling_Laser_Body_R.png",
        },
        {
            name: "Falling_Laser_Legs_L",
            url: "images/Robot/Fall/558x126/Falling_Laser_Legs_L.png",
        },
        {
            name: "Falling_Laser_Legs_R",
            url: "images/Robot/Fall/558x126/Falling_Laser_Legs_R.png",
        },
        {
            name: "PFX_Boost_L",
            url: "images/Robot/PFX/48x14/Boost_pfx_L.png",
        },
        {
            name: "PFX_Boost_R",
            url: "images/Robot/PFX/48x14/Boost_pfx_R.png",
        },
        {
            name: "PFX_Boost_Slash_L",
            url: "images/Robot/PFX/250x50/Boost_slash_pfx_L.png",
        },
        {
            name: "PFX_Boost_Slash_R",
            url: "images/Robot/PFX/250x50/Boost_slash_pfx_R.png",
        },
        {
            name: "PFX_Laser_Boost_R",
            url: "images/Robot/PFX/362x20/Laser_PFX_R.png",
        },
        {
            name: "PFX_Laser_Boost_L",
            url: "images/Robot/PFX/362x20/Laser_PFX_L.png",
        },
        {
            name: "PFX_Laser_Fall_R",
            url: "images/Robot/PFX/362x20/Laser_PFX_R.png",
        },
        {
            name: "PFX_Laser_Fall_L",
            url: "images/Robot/PFX/362x20/Laser_PFX_L.png",
        },
        {
            name: "PFX_Laser_Crouch_R",
            url: "images/Robot/PFX/362x20/Laser_PFX_R.png",
        },
        {
            name: "PFX_Laser_Crouch_L",
            url: "images/Robot/PFX/362x20/Laser_PFX_L.png",
        },
   ];
    var game_resources = [ 
        {
            name: "clouds7",
            url: "images/World/clouds7.png",
        },
        {
            name: "clouds6",
            url: "images/World/clouds6.png",
        },
        {
            name: "clouds5",
            url: "images/World/clouds5.png",
        },
        {
            name: "mount4",
            url: "images/World/mount4.png",
        },
        {
            name: "mount3",
            url: "images/World/mount3.png",
        },
        {
            name: "ground2",
            url: "images/World/ground2.png",
        },
        {
            name: "ground1",
            url: "images/World/ground1.png",
        },

    ];

    var player_anims = [
        {
            name: "Boost_Legs_R",
            frames: 7
        },
        {
            name: "Boost_Legs_L", 
            frames: 7
        },
        {
            name: "Boost_Top_R",
            frames: 7
        },
        {
            name: "Boost_Top_L",
            frames: 7
        },
        { 
            name: "Boost_Slash_L",
            frames: 7,
            sizex: 162,
            sizey: 106,
            offsetx:-28,
            offsety:0,
            fps:10
        },   
        { 
            name: "Boost_Slash_R",
            frames: 7,
            sizex: 162,
            sizey: 106,
            offsetx:28,
            offsety:0,
            fps:10
        },
        {
            name: "Boost_Laser_L",
            frames: 7,
            sizex: 124,
            sizey: 106
        },
        {
            name: "Boost_Laser_R",
            frames: 7,
            sizex: 124,
            sizey: 106
        },
        {
            name: "Jump_L",
            frames: 7,
            sizex: 90,
            sizey: 112,
        },
        {
            name: "Jump_R",
            frames: 7,
            sizex: 90,
            sizey: 112,
        },
        {
            name: "Crouch_Laser_L",
            frames: 8,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Crouch_Laser_R",
            frames: 8,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Crouch_L",
            frames: 6,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Crouch_R",
            frames: 6,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        { 
            name: "Crouch_Stab_L",
            frames: 12,
            fps: 20,
            sizex: 134,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        { 
            name: "Crouch_Stab_R",
            frames: 12,
            fps: 20,
            sizex: 134,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Walk_L", 
            frames: 7,
            sizex: 90,
            sizey: 106,
        },
        {
            name: "Walk_R", 
            frames: 7,
            sizex: 90,
            sizey: 106,
        },
        {
            name: "Walk_Slash_Swing_R",
            frames: [13,12,11,10,9,8,7,6,5,4,3,2,1,0],
            fps:20,
            sizex: 186,
            sizey: 106
        },
        {
            name: "Walk_Slash_Swing_L",
            frames: [13,12,11,10,9,8,7,6,5,4,3,2,1,0],
            fps:20,
            sizex: 186,
            sizey: 106
        },
        {
            name: "Walk_Slash_Charge_R",
            frames: 29,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Charge_L",
            frames: 29,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Release_R",
            frames: 8,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Release_L",
            frames: 8,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Stand_R",
            frames: 26,
            sizex: 76,
            sizey: 104,
            offsetx:0,
            offsety:3
        },
        {
            name: "Stand_L",
            frames: 26,
            sizex: 76,
            sizey: 104,
            offsetx:0,
            offsety:3
        },
        {
            name: "Falling_Top_L",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Top_R",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Legs_L",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Legs_R",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Slash_L",
            frames: 16,
            fps:20,
            sizex: 166,
            sizey: 130
        },
        {
            name: "Falling_Slash_R",
            frames: 16,
            fps:20,
            sizex: 166,
            sizey: 130
        },
        {
            name: "Falling_Laser_Top_L",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Laser_Top_R",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Laser_Legs_L",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Laser_Legs_R",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "PFX_Boost_L",
            frames: 5,
            sizex: 48,
            sizey: 14,
            offsetx:10,
            offsety:-18
        },
        {
            name: "PFX_Boost_R",
            frames: 5,
            sizex: 48,
            sizey: 14,
            offsetx:-10,
            offsety:-18
        },
        {
            name: "PFX_Boost_Slash_L",
            frames: 8,
            sizex: 250,
            sizey: 50,
            fps:20
        },
        {
            name: "PFX_Boost_Slash_R",
            frames: 8,
            sizex: 250,
            sizey: 50,
            fps:20
        },
        {
            name: "PFX_Laser_Boost_R",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:210,
            offsety:-40
        },
        {
            name: "PFX_Laser_Boost_L",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:-220,
            offsety:-40
        },
        {
            name: "PFX_Laser_Fall_R",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:180,
            offsety:-25
        },
        {
            name: "PFX_Laser_Fall_L",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:-185,
            offsety:-25
        },
        {
            name: "PFX_Laser_Crouch_R",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:173,
            offsety:3
        },
        {
            name: "PFX_Laser_Crouch_L",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:-179,
            offsety:3
        }
    ];


    var player_constants = { 
        HEALTH: 100,
        HOVER: 100,
        FRIC: 0.5, 
        GRAV: 0.5, 
        BOOST_X: 20, 
        BOOST_Y: 15, 
        WALK_X : 5,

        // After BOOST_CAST actions no longer combined
        // with BOOST

        BOOST_CAST: 200,           

        // BOOST_MELEE_CAST duration where a different
        // action could be applied to the boost

        BOOST_MELEE_BCKSWNG: 400,
        BOOST_MELEE_CAST: 300,

        // BOOST_BCKSWNG duration following
        // the cast, where the player is vulnerable
        // and cannot change animation

        BOOST_BCKSWNG: 500,   //700 totoal

        // The duration where the melee can be cancelled
        // while walking

        MELEE_CAST: 300,

        // The duration of vulnerability following the
        // cast point

        MELEE_BCKSWNG: 400,    //550 total

        WALK_MELEE_CHARGE_WAIT: 200,
        RELEASE_BACKSWNG  : 350,
        BLIP_CAST         : 100,
        BLIP_BCKSWNG      : 500,
        CHARGE_CAST       : 500,
        MAX_CHARGE        : 1400,
        MIN_CHARGE_DUR    : 200,
        FALL_MELEE_CAST   : 100,
        FALL_MELEE_BCKSWNG: 500,
        LASER_CAST        : 100,
        LASER_BCKSWNG     : 600,
        HOVER             : 100,
        HOVER_INCREMENT   : 1,
        DIV               : 17,
        DEBUG             : false,
    };
    var player_motions = { 
        WALK:        0,
        STAND:       1, 
        JUMP:        2, 
        CROUCH:      3,
        HOVER:       4,
        FALLING:     5, 
        BOOST_DOWN:  6,
        BOOST_LEFT:  7,
        BOOST_RIGHT: 8
    };
    var player_facing = { 
        LEFT:  0,
        RIGHT: 1 
    };
    var player_status = { 
        BUSY: 0,
        FREE: 1
    };    

    var player_actions = { 
        BLIP:      0,
        MELEE:     1,
        MELEE_RVS: 2,
        RANGE:     3, 
        PASSIVE:   4, 
        STAGGER:   5, 
        CHARGE:    6,
        SWING:     7
    };
    var LoadingBox = function(game) {
        var innerBox = {
            center: { x:0, y:0 },
            size: { x:0, y: 30 }
        }

        this.fgColor = "#aaa";
        this.bgColor = "#333";

        this.center = game.c.renderer.getViewCenter();
        this.size = { x:1000, y:40 };
        this.notify = function(index, total) {
            var percent = index / total;
            innerBox.size.x = percent * this.size.x;
            innerBox.center.x = this.center.x - this.size.x/2 + innerBox.size.x/2  + 5;
            innerBox.center.y = this.center.y;
        };
        this.draw = function(ctx) {
            ctx.fillStyle = this.bgColor;
            ctx.fillRect(this.center.x - this.size.x/2
                       , this.center.y - this.size.y/2
                       , this.size.x
                       , this.size.y);

            ctx.fillStyle = this.fgColor;
            ctx.fillRect(innerBox.center.x - innerBox.size.x/2
                       , innerBox.center.y - innerBox.size.y/2
                       , innerBox.size.x
                       , innerBox.size.y);
        }; 
    }

    var game_scenes = [
        {
            name: "Load",
            init: function(game) {
                var box;
                game.c.renderer.setBackground("#000");;
                box = game.c.entities.create(LoadingBox);
                game.resourcer.load( function(name, counter, total) { 
                    box.notify(counter, total);
                });
            },
            active:function(game, time) {
                return !game.resourcer.isReady();
            },
            exit: function(game, time) {
                game.scener.start("Main");
            }
        },
        {
            name: "Main",
            init: function(game) {
                var p = game.c.entities.create(Player, { 
                    center: { x:400, y:290 },
                    size:   { x:124, y:106 }
                });

                game.c.entities.create(Enemy, { 
                    center: { x:10, y:110 },
                    size:   { x:60, y:100 },
                    spawnPoint: { x:10, y:110 }
                });

                game.c.entities.create(Enemy, { 
                    center: { x:1200, y:110 },
                    size:   { x:60, y:100 },
                    spawnPoint: { x:1200, y:110 }
                });

                // MUST BE SET BEFORE LAYERS ARE MADE :.<
                game.c.renderer.setViewCenter({x: p.center.x, y: p.center.y - 90}); 

                for (var i = 0; i < config.Game.Layers.length; i++) {
                    yo = game.c.entities.create(Layer, config.Game.Layers[i]); 
                }

              //for (var i = 0; i < 10; i++) {
                    game.c.entities.create(Platform, {
                        size:   { x: 4324, y: 30 },
                        center: { x: 4324/2, y: p.center.y + 53 + 15 }
                      //center: { x: 400 + i * 1000, y: 400 }
                    });
              //}

                game.c.renderer.setBackground("#c5e8ef");
              //  game.layerer.include(["blck","mountains"], "bg_canvas");
              //    game.c.renderer.follow(p.center);


            },
            draw: function(game) {
                game.scener.background.draw();
                if (game.scener.isPaused()) {
                    game.scener.foreground.draw();
                }
            },
        }
    ];

    var game_layers = [
        {
            rsc: "clouds7",
            delta:                  { x:     -1, y: -634 / 536.4 },
            y: 400 - 742 - 738,
            width: 4324,
            height: 742,
            zindex: -7,
            update: function(view) {
                if (view.center.y < -336.4) {
                    this.delta.y =  -429 / 357.6;
                } else {
                    this.delta.y = -634 / 536.4;
                }
            }
        },
        {
            rsc: "clouds6",
            delta:                  { x:     -1, y: -643 / 536.4 },
            y: 400 - 614 - 802,
            width: 4324,
            height: 614,
            zindex: -6,
            update: function(view) {
                if (view.center.y < -336.4) {
                    this.delta.y =  -378 / 357.6;
                } else {
                    this.delta.y = -643 / 536.4;
                }
            }
        },
        {
            rsc: "clouds5",
            delta:                  { x:     -1, y: -503 / 536.4 },
            y: 400 - 370 - 924,
            width: 4324,
            height: 370,
            zindex: -5,
            update: function(view) {
                if (view.center.y < -336.4) {
                    this.delta.y =  -390 / 357.6;
                } else {
                    this.delta.y = -503 / 536.4;
                }
            }

        },
        {
            rsc: "mount4", 
            delta:                  { x:     -1, y: -462 / 536.4 },
            y: 400 - 524 + 57 ,
            width: 4324,
            height: 524,
            zindex: -4,
        },
        {
            rsc: "mount3",
            delta:                  { x:     -1, y: -367 / 536.4 },
            y: 400 - 448 + 82,
            width: 4324,
            height: 448,
            zindex: -3,
        },
        {
            rsc: "ground2",
            delta:                  { x:     -1, y: -248 / 536.4 },
            y: 400 - 690 + 57,
            width: 4324,
            height: 690,
            zindex: -2,
        },
        {
            rsc: "ground1",
            delta:                  { x:     -1, y: -144 / 536.4 },
            y: 400 - 128,
            width: 4324,
            height: 128,
            zindex: -1,
        },
    ]

    var config = {
        Player: {
            Animations: player_anims,
            Constants: player_constants,
            Motions: player_motions,
            Actions: player_actions,
            Status: player_status,
            Facing: player_facing,
        },
        Game: {
            Scenes: game_scenes,
            Layers: game_layers,
            Resources: game_resources.concat(player_resources),
            Width: 800,
            Height: 400
        }
    };
    exports.config = config;

})(this)
