(function(exports){
    var player_anims = [
        {
            name: "Boost_Legs_R",
            rsc: "images/Robot/Boost/124x106/Boot_legs_R.png",
            frames: 7
        },
        {
            name: "Boost_Legs_L", 
            rsc: "images/Robot/Boost/124x106/Boot_legs_L.png", 
            frames: 7
        },
        {
            name: "Boost_Top_R",
            rsc: "images/Robot/Boost/124x106/Boost_Top_R.png",
            frames: 7
        },
        {
            name: "Boost_Top_L",
            rsc: "images/Robot/Boost/124x106/Boost_Top_L.png",
            frames: 7
        },
        { 
            name: "Boost_Slash_L",
            rsc: "images/Robot/Boost/162x106/Boost_slash_top_L.png",
            frames: 7,
            sizex: 162,
            sizey: 106,
            offsetx:-28,
            offsety:0,
            fps:10
        },   
        { 
            name: "Boost_Slash_R",
            rsc: "images/Robot/Boost/162x106/Boost_slash_top_R.png",
            frames: 7,
            sizex: 162,
            sizey: 106,
            offsetx:28,
            offsety:0,
            fps:10
        },
        {
            name: "Boost_Laser_L",
            rsc: "images/Robot/Boost/124x106/Boost_laser_L.png",
            frames: 7,
            sizex: 124,
            sizey: 106
        },
        {
            name: "Boost_Laser_R",
            rsc: "images/Robot/Boost/124x106/Boost_laser_R.png",
            frames: 7,
            sizex: 124,
            sizey: 106
        },
        {
            name: "Jump_L",
            rsc: "images/Robot/Jump/90x112/Jump_Left.png",
            frames: 7,
            sizex: 90,
            sizey: 112,
        },
        {
            name: "Jump_R",
            rsc: "images/Robot/Jump/90x112/Jump_Right.png",
            frames: 7,
            sizex: 90,
            sizey: 112,
        },
        {
            name: "Crouch_Laser_L",
            rsc: "images/Robot/Crouch/Crouch_80x62/Crouch_Laser_L.png",
            frames: 8,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Crouch_Laser_R",
            rsc: "images/Robot/Crouch/Crouch_80x62/Crouch_Laser_R.png",
            frames: 8,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Crouch_L",
            rsc: "images/Robot/Crouch/Passive_80x62/Crouch_Passive_L.png",
            frames: 6,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Crouch_R",
            rsc: "images/Robot/Crouch/Passive_80x62/Crouch_Passive_R.png",
            frames: 6,
            sizex: 80,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        { 
            name: "Crouch_Stab_L",
            rsc: "images/Robot/Crouch/Stab_134x62/Crouch_Stab_L.png",
            frames: 12,
            fps: 20,
            sizex: 134,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        { 
            name: "Crouch_Stab_R",
            rsc: "images/Robot/Crouch/Stab_134x62/Crouch_Stab_R.png",
            frames: 12,
            fps: 20,
            sizex: 134,
            sizey: 62,
            offsetx:0,
            offsety:22,
        },
        {
            name: "Walk_L", 
            rsc: "images/Robot/Walk/97x106/Walk_L.png",
            frames: 7,
            sizex: 97,
            sizey: 106,
        },
        {
            name: "Walk_R", 
            rsc: "images/Robot/Walk/97x106/Walk_R.png",
            frames: 7,
            sizex: 97,
            sizey: 106,
        },
        {
            name: "Walk_Slash_Swing_R",
            rsc: 'images/Robot/Walk/192x106/Walk_slash_swing_R.png',
            frames: 11,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Swing_L",
            rsc: "images/Robot/Walk/192x106/Walk_slash_swing_L.png",
            frames: 11,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Charge_R",
            rsc: "images/Robot/Walk/192x106/Walk_slash_charge_R.png",
            frames: 29,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Charge_L",
            rsc: "images/Robot/Walk/192x106/Walk_slash_charge_L.png",
            frames: 29,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Release_R",
            rsc: "images/Robot/Walk/192x106/Walk_slash_release_R.png",
            frames: 8,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Walk_Slash_Release_L",
            rsc: "images/Robot/Walk/192x106/Walk_slash_release_L.png",
            frames: 8,
            fps:20,
            sizex: 192,
            sizey: 106
        },
        {
            name: "Stand_R",
            rsc: "images/Robot/Stand/76x104/Stand_R.png",
            frames: 26,
            sizex: 76,
            sizey: 104,
            offsetx:0,
            offsety:2
        },
        {
            name: "Stand_L",
            rsc: "images/Robot/Stand/76x104/Stand_L.png",
            frames: 26,
            sizex: 76,
            sizey: 104,
            offsetx:0,
            offsety:2
        },
        {
            name: "Falling_Top_L",
            rsc: "images/Robot/Fall/62x126/Falling_Body_L.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Top_R",
            rsc: "images/Robot/Fall/62x126/Falling_Body_R.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Legs_L",
            rsc: "images/Robot/Fall/62x126/Falling_Legs_L.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Legs_R",
            rsc: "images/Robot/Fall/62x126/Falling_Legs_R.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Slash_L",
            rsc: "images/Robot/Fall/166x130/Falling_Slash_L.png",
            frames: 16,
            fps:20,
            sizex: 166,
            sizey: 130
        },
        {
            name: "Falling_Slash_R",
            rsc: "images/Robot/Fall/166x130/Falling_Slash_R.png",
            frames: 16,
            fps:20,
            sizex: 166,
            sizey: 130
        },
        {
            name: "Falling_Laser_Top_L",
            rsc: "images/Robot/Fall/558x126/Falling_Laser_Body_L.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Laser_Top_R",
            rsc: "images/Robot/Fall/558x126/Falling_Laser_Body_R.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Laser_Legs_L",
            rsc: "images/Robot/Fall/558x126/Falling_Laser_Legs_L.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "Falling_Laser_Legs_R",
            rsc: "images/Robot/Fall/558x126/Falling_Laser_Legs_R.png",
            frames: 9,
            sizex: 62,
            sizey: 126
        },
        {
            name: "PFX_Boost_L",
            rsc: "images/Robot/PFX/48x14/Boost_pfx_L.png",
            frames: 5,
            sizex: 48,
            sizey: 14,
            offsetx:10,
            offsety:-18
        },
        {
            name: "PFX_Boost_R",
            rsc: "images/Robot/PFX/48x14/Boost_pfx_R.png",
            frames: 5,
            sizex: 48,
            sizey: 14,
            offsetx:-10,
            offsety:-18
        },
        {
            name: "PFX_Boost_Slash_L",
            rsc: "images/Robot/PFX/250x50/Boost_slash_pfx_L.png",
            frames: 8,
            sizex: 250,
            sizey: 50,
            fps:20
        },
        {
            name: "PFX_Boost_Slash_R",
            rsc: "images/Robot/PFX/250x50/Boost_slash_pfx_R.png",
            frames: 8,
            sizex: 250,
            sizey: 50,
            fps:20
        },
        {
            name: "PFX_Laser_Boost_R",
            rsc: "images/Robot/PFX/362x20/Laser_PFX_R.png",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:210,
            offsety:-40
        },
        {
            name: "PFX_Laser_Boost_L",
            rsc: "images/Robot/PFX/362x20/Laser_PFX_L.png",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:-220,
            offsety:-40
        },
        {
            name: "PFX_Laser_Fall_R",
            rsc: "images/Robot/PFX/362x20/Laser_PFX_R.png",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:180,
            offsety:-25
        },
        {
            name: "PFX_Laser_Fall_L",
            rsc: "images/Robot/PFX/362x20/Laser_PFX_L.png",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:-185,
            offsety:-25
        },
        {
            name: "PFX_Laser_Crouch_R",
            rsc: "images/Robot/PFX/362x20/Laser_PFX_R.png",
            frames: 7,
            sizex: 360, 
            sizey: 20,
            offsetx:173,
            offsety:3
        },
        {
            name: "PFX_Laser_Crouch_L",
            rsc: "images/Robot/PFX/362x20/Laser_PFX_L.png",
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

        MELEE_CAST: 200,

        // The duration of vulnerability following the
        // cast point

        MELEE_BCKSWNG: 350,    //550 total

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
    }

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
    }

    var player_facing = { 
        LEFT:  0,
        RIGHT: 1 
    }

    var player_status = { 
        BUSY: 0,
        FREE: 1
    }
    var player_actions = { 
        BLIP:      0,
        MELEE:     1,
        MELEE_RVS: 2,
        RANGE:     3, 
        PASSIVE:   4, 
        STAGGER:   5, 
        CHARGE:    6,
        SWING:     7
    }


    var config = {
        Player: {
            Animations: player_anims,
            Constants: player_constants,
            Motions: player_motions,
            Actions: player_actions,
            Status: player_status,
            Facing: player_facing,
    //      Attacks: {
    //      }
        }
    }

    exports.config = config;

})(this)
