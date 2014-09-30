var FRIC = 0.1,
    GRAV = 0.3,
    BOOST_X = 20,
    BOOST_Y = 15,
    WALK_X  = 5; 

    // After BOOST_CAST actions no longer combined
    // with BOOST

    BOOST_CAST = 200,           

    // BOOST_MELEE_CAST duration where a different
    // action could be applied to the boost

    BOOST_MELEE_BCKSWNG = 400,
    BOOST_MELEE_CAST = 300,

    // BOOST_BCKSWNG duration following
    // the cast, where the player is vulnerable
    // and cannot change animation

    BOOST_BCKSWNG = 500,   //700 totoal

    // The duration where the melee can be cancelled
    // while walking

    MELEE_CAST = 200,

    // The duration of vulnerability following the
    // cast point

    MELEE_BCKSWNG = 350,    //550 total

    WALK_MELEE_CHARGE_WAIT = 200,
    RELEASE_BACKSWNG   = 350,
    BLIP_CAST          = 100,
    BLIP_BCKSWNG       = 500,
    CHARGE_CAST        = 500,
    MAX_CHARGE         = 1400,
    MIN_CHARGE_DUR     = 200,
    FALL_MELEE_CAST    = 100,
    FALL_MELEE_BCKSWNG = 500,
    LASER_CAST         = 100,
    LASER_BCKSWNG      = 600,
    HOVER              = 100,
    HOVER_INCREMENT    = 1,
    DIV                = 17,
//  DEBUG              = true;
    DEBUG              = false;

;(function(exports) {
    exports.Player = function(game, settings) {
        var self = this,
            C = game.c;
        for (var i in settings) {
          this[i] = settings[i];
        }

        // Enumerate state
        var motions = { WALK:        0
                      , STAND:       1 
                      , JUMP:        2 
                      , CROUCH:      3
                      , HOVER:       4
                      , FALLING:     5 
                      , BOOST_UP:    6
                      , BOOST_DOWN:  7
                      , BOOST_LEFT:  8
                      , BOOST_RIGHT: 9
                      }

        this.interval = 0;

        var facing = { LEFT:  0
                     , RIGHT: 1 }

        var actions = { BLIP:      0
                      , MELEE:     1
                      , MELEE_RVS: 2
                      , RANGE:     3 
                      , PASSIVE:   4 
                      , STAGGER:   5 
                      , CHARGE:    6
                      , SWING:     7 }

        var status =  { FREE: 0
                      , BUSY: 1 } 

        this.state = { action: actions.PASSIVE
                     , motion: motions.STAND 
                     , facing: facing.RIGHT 
                     , status: status.FREE } 

        this.resources = { boost:  100
                         , hover:  HOVER
                         , health: 100 }

        this.vel = { x:0, y:0 }

        this.attackBox = { size: {x:10,y:50}
                         , center: this.center
                         , name: "attack"
                         }

        C.entities._entities.push(this.attackBox);

        this.animator = Animator(this);
        this.animator.register("Boost_Legs_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/124x106/Boot_legs_R.png'),
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Legs_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/124x106/Boot_legs_L.png'),
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Top_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/124x106/Boost_Top_R.png'),  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Top_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/124x106/Boost_Top_L.png'),  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Slash_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/162x106/Boost_slash_top_L.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:162, y:106},
            offset: {x:-28, y:0},
            fps:10
        }));
        this.animator.register("Boost_Slash_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/162x106/Boost_slash_top_R.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:162, y:106},
            offset: {x:28, y:0},
            fps:10
        }));
        this.animator.register("Boost_Laser_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/124x106/Boost_laser_L.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:124,y:106}
        }));
        this.animator.register("Boost_Laser_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Boost/124x106/Boost_laser_R.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:124,y:106}
        }));
        this.animator.register("Jump_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Jump/90x112/Jump_Left.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:90,y:112},
        }));
        this.animator.register("Jump_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Jump/90x112/Jump_Right.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:90,y:112},
        }));
        this.animator.register("Crouch_Laser_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Crouch/Crouch_80x62/Crouch_Laser_L.png'),  
            frames: [0,1,2,3,4,5,6,7],
            size: {x:80,y:62},
            offset: {x:0,y:22},
        }));
        this.animator.register("Crouch_Laser_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Crouch/Crouch_80x62/Crouch_Laser_R.png'),  
            frames: [0,1,2,3,4,5,6,7],
            size: {x:80,y:62},
            offset: {x:0,y:22},
        }));
        this.animator.register("Crouch_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Crouch/Passive_80x62/Crouch_Passive_L.png'),  
            frames: [0,1,2,3,4,5],
            size: {x:80,y:62},
            offset: {x:0,y:22},
        }));
        this.animator.register("Crouch_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Crouch/Passive_80x62/Crouch_Passive_R.png'),  
            frames: [0,1,2,3,4,5],
            size: {x:80,y:62},
            offset: {x:0,y:22},
        }));
        this.animator.register("Crouch_Stab_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Crouch/Stab_134x62/Crouch_Stab_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11],
            fps: 20,
            size: {x:134,y:62},
            offset: {x:0,y:22},
        }));
        this.animator.register("Crouch_Stab_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Crouch/Stab_134x62/Crouch_Stab_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11],
            fps: 20,
            size: {x:134,y:62},
            offset: {x:0,y:22},
        }));
        this.animator.register("Walk_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/97x106/Walk_L.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:97,y:106},
        }));
        this.animator.register("Walk_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/97x106/Walk_R.png'),  

            frames: [0,1,2,3,4,5,6],
            size: {x:97,y:106},
        }));
        this.animator.register("Walk_Slash_Swing_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/192x106/Walk_slash_swing_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10],
            fps:20,
            size: {x:192,y:106}
        }));
        this.animator.register("Walk_Slash_Swing_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/192x106/Walk_slash_swing_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10],
            fps:20,
            size: {x:192,y:106}
        }));
        this.animator.register("Walk_Slash_Charge_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/192x106/Walk_slash_charge_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
            fps:20,
            size: {x:192,y:106}
        }));
        this.animator.register("Walk_Slash_Charge_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/192x106/Walk_slash_charge_L.png'),
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
            fps:20,
            size: {x:192,y:106}
        }));
        this.animator.register("Walk_Slash_Release_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/192x106/Walk_slash_release_R.png'),  
            frames: [0,1,2,3,4,5,6,7],
            fps:20,
            size: {x:192,y:106}
        }));
        this.animator.register("Walk_Slash_Release_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Walk/192x106/Walk_slash_release_L.png'),  
            frames: [0,1,2,3,4,5,6,7],
            fps:20,
            size: {x:192,y:106}
        }));
        this.animator.register("Stand_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Stand/76x104/Stand_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
            size: {x:76,y:104},
            offset: {x:0, y:2}
        }));
        this.animator.register("Stand_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Stand/76x104/Stand_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
            size: {x:76,y:104},
            offset: {x:0, y:2}
        }));
        this.animator.register("Falling_Top_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/62x126/Falling_Body_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Top_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/62x126/Falling_Body_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Legs_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/62x126/Falling_Legs_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Legs_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/62x126/Falling_Legs_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Slash_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/166x130/Falling_Slash_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            fps:20,
            size: {x:166,y:130}
        }));
        this.animator.register("Falling_Slash_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/166x130/Falling_Slash_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            fps:20,
            size: {x:166,y:130}
        }));
        this.animator.register("Falling_Laser_Top_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/558x126/Falling_Laser_Body_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Laser_Top_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/558x126/Falling_Laser_Body_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Laser_Legs_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/558x126/Falling_Laser_Legs_L.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Laser_Legs_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/Fall/558x126/Falling_Laser_Legs_R.png'),  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("PFX_Boost_L", Animation(this, {
            img: game.resourcer.get('images/Robot/PFX/48x14/Boost_pfx_L.png'),  
            frames: [0,1,2,3,4],
            size: {x:48,y:14},
            offset: {x:10, y:-18}
        }));
        this.animator.register("PFX_Boost_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/PFX/48x14/Boost_pfx_R.png'),  
            frames: [0,1,2,3,4],
            size: {x:48,y:14},
            offset: {x:-10, y:-18}
        }));

        var slashPFXObj = { center: {x:0,y:0}, size: {x:250,y:50} };
        this.animator.register("PFX_Boost_Slash_L", Animation(this, {//slashPFXObj, { 
            img: game.resourcer.get('images/Robot/PFX/250x50/Boost_slash_pfx_L.png'),  
            frames: [0,1,2,3,4,5,6,7],
            size: {x:250,y:50},
            fps:20
        }));
        this.animator.register("PFX_Boost_Slash_R", Animation(this,{ //slashPFXObj, {
            img: game.resourcer.get('images/Robot/PFX/250x50/Boost_slash_pfx_R.png'),  
            frames: [0,1,2,3,4,5,6,7],
            size: {x:250,y:50},
            fps:20
        }));
        this.animator.register("PFX_Laser_Boost_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/PFX/362x20/Laser_PFX_R.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:360, y:20},
            offset: {x:210,y:-40}
        }));
        this.animator.register("PFX_Laser_Boost_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/PFX/362x20/Laser_PFX_L.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:360, y:20},
            offset: {x:-220,y:-40}
        }));
        this.animator.register("PFX_Laser_Fall_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/PFX/362x20/Laser_PFX_R.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:360, y:20},
            offset: {x:180,y:-25}
        }));
        this.animator.register("PFX_Laser_Fall_L", Animation(this, {
            img: game.resourcer.get('images/Robot/PFX/362x20/Laser_PFX_L.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:360, y:20},
            offset: {x:-185,y:-25}
        }));
        this.animator.register("PFX_Laser_Crouch_R", Animation(this, { 
            img: game.resourcer.get('images/Robot/PFX/362x20/Laser_PFX_R.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:360, y:20},
            offset: {x:173,y:3}
        }));
        this.animator.register("PFX_Laser_Crouch_L", Animation(this, { 
            img: game.resourcer.get('images/Robot/PFX/362x20/Laser_PFX_L.png'),  
            frames: [0,1,2,3,4,5,6],
            size: {x:360, y:20},
            offset: {x:-179,y:3}
        }));


        game.sequencer.bind("BOOST_UP", [C.inputter.W, -C.inputter.W, C.inputter.W]);
        game.sequencer.bind("BOOST_DOWN", [C.inputter.S, -C.inputter.S, C.inputter.S]);
        game.sequencer.bind("BOOST_RIGHT", [C.inputter.D, -C.inputter.D, C.inputter.D]); 
        game.sequencer.bind("BOOST_LEFT", [C.inputter.A, -C.inputter.A, C.inputter.A]);

        this.stater = Stater({ 
            init: function() { 
                self.state.action = actions.PASSIVE;
                self.state.state = status.FREE;
            },
            update: function() { 
                self.state.action = actions.PASSIVE;
                self.state.status = status.FREE;

                var vx = self.vel.x;
                var vy = self.vel.y;
                var absNewVx = Math.abs(vx);
                if (vy > 0) {
                    self.state.motion = motions.FALLING;
                }  else if (vy < 0) {
                    self.state.motion = motions.JUMP;
                } else if (absNewVx <= WALK_X && absNewVx > 0) {
                    self.state.motion = motions.WALK;
                } else if (vx === 0 && vy === 0) {
                    self.state.motion = motions.STAND;
                }                                                             

            },
            children: {
                Boost_Horizontal: { 
                    duration : BOOST_CAST + BOOST_BCKSWNG,
                    children: {
                        Melee: {
                            duration: BOOST_MELEE_CAST + BOOST_MELEE_BCKSWNG,
                            active: function(time) {
                                var isKeyDown = function(e) { return e.type === "keydown" };
                                var noKeyDown = C.inputter.getEvents()
                                                          .filter(isKeyDown)
                                                          .length === 0;

                                return noKeyDown || time > BOOST_MELEE_CAST
                            },                            
                            init: function() {
                                self.state.action = actions.MELEE;
                                self.state.status = status.BUSY;
                                self.vel.x = self.vel.y = 0;
                            },
                            update: function(time) {
                                if (time > BOOST_MELEE_CAST && time < BOOST_MELEE_CAST + 250) {
                                    self.state.status = status.BUSY;
                                    self.vel.x = (self.state.facing === facing.RIGHT ? BOOST_X * 2 : -BOOST_X * 2);
                                } else {
                                    self.vel.x = (self.state.facing === facing.RIGHT ? 1 : -1);
                                }

                            },
                            transition: function() {
                                self.vel.x = 0;
                                self.state.action = actions.PASSIVE;
                                self.state.status = status.FREE;
                                self.stater.toParent();
                            }
                        },
                        Range: { 
                            duration: LASER_CAST + LASER_BCKSWNG,
                            init: function() {
                                self.state.action = actions.RANGE;
                            },
                            transition: function() {
                                self.state.action = actions.PASSIVE; 
                                self.stater.toParent();

                            //CHANGEEE

                                self.animator.reset();
                            }

                        }
                    }
                }, 
                Range: { 
                    duration: LASER_CAST + LASER_BCKSWNG,
                    init: function() {
                        self.state.action = actions.RANGE;
                        self.animator.reset();
                    },
                    update: function() {
                        self.vel.y = 0;
                    }
                },
                Melee: {
                    duration: MELEE_CAST,
                    active: function(time) {
                        var isKeyDown = function(e) { return e.type === "keydown" };
                        var noKeyDown = C.inputter.getEvents()
                                                  .filter(isKeyDown)
                                                  .length === 0;

                        return noKeyDown;
                    },
                    init: function() {
                        self.state.action = actions.MELEE;
                    },
                    update: function(time) {
                        // hover or stand still
                        self.vel.x = self.vel.y = 0;
                    },
                    transition: function(time) { 
                        if (time < MELEE_CAST) {
                            self.stater.toParent();
                            self.animator.reset();
                        } else {
                            self.stater.toSibling("MeleeBckswng");
                        }
                    },
                },
                MeleeBckswng: {
                    duration: MELEE_BCKSWNG,
                    init: function() {
                        self.state.status = status.BUSY;
                    },
                    update: function(time) {
                        if (MELEE_BCKSWNG - time < 200 && C.inputter.isDown(C.inputter.J)) {
                            self.state.status = status.FREE;
                        }
                        // hover or stand still
                        self.vel.x = self.vel.y = 0;
                    },
                    children: {
                        Melee: {
                            duration: MAX_CHARGE,
                            active: function(time) {
                                return C.inputter.isDown(C.inputter.J);
                            },
                            init: function() {
                                if (self.state.motion === motions.CROUCH) { 
                                    self.stater.toParent(); 
                                } else {
                                    self.state.motion = motions.STAND;
                                    self.state.action = actions.CHARGE;
                                    self.state.status = status.BUSY;
                                }
                            },
                            transition: function(time) {
                                if (time < MIN_CHARGE_DUR) {
                                    self.stater.toParent();
                                    self.state.action = actions.PASSIVE;
                                    self.state.status = status.FREE; 
                                } else {
                                    self.stater.toSibling("Swing");
                                }
                            }
                        },
                        Swing: {
                            duration: RELEASE_BACKSWNG,
                            init: function() {
                                self.vel.x = (self.state.facing === facing.RIGHT ? BOOST_X : -BOOST_X);
                                self.state.action = actions.SWING;
                                self.state.status = status.BUSY;
                            },
                            transition: function() {
                                self.state.action = actions.PASSIVE;
                                self.state.status = status.FREE;
                                self.state.motion = motions.STAND;
                                self.stater.toParent();
                            } 
                        }
                    }
                }
            }
        });

        this.update = function(delta) {

            this.stater.update(delta);
            this.animator.update(delta);

            if (this.state.status === status.FREE) {
                handleInput();
            } 

            this.center.y += this.vel.y * delta/DIV
            this.center.x += this.vel.x * delta/DIV
              
            // Gravity
            this.vel.y += GRAV * delta/DIV;
            
            if (Math.abs(this.vel.x) > WALK_X) {
                this.vel.y = 0;
            }

            // Friction
            this.vel.x = reduce(this.vel.x, FRIC * delta/DIV);
        }; 

        this.stateToStringList = function() {
            var motionId = this.state.motion;
            var actionId = this.state.action;
            var facingId = this.state.facing;
            var statusId = this.state.status;
            var motion, action, dir, stat;

            if (motionId === motions.BOOST_UP) {
               motion = "BOOST UP";
            } else if (motionId === motions.BOOST_DOWN) {
               motion = "BOOST DOWN";
            } else if (motionId === motions.BOOST_RIGHT) {
               motion = "BOOST RIGHT";
            } else if (motionId === motions.BOOST_LEFT) {
               motion = "BOOST LEFT";
            } else if (motionId === motions.HOVER) {
               motion = "HOVER";
            } else if (motionId === motions.CROUCH) {
               motion = "CROUCH";
            } else if (motionId === motions.WALK) {
               motion = "WALK";
            } else if (motionId === motions.STAND) {
               motion = "STAND";
            } else if (motionId === motions.FALLING) {
                motion = "FALLING";
            }

            if (facingId === facing.RIGHT) {
                dir = "RIGHT";
            } else {
                dir = "LEFT";
            }

            if (statusId === status.FREE) {
                stat = "FREE";
            } else {
                stat = "BUSY";
            }
           
            if (actionId === actions.BLIP) {
                action = "BLIP";
            } else if (actionId === actions.MELEE) {
                action = "MELEE";
            } else if (actionId === actions.CHARGE) {
                action = "CHARGE";
            } else if (actionId === actions.SWING) {
                action = "SWING";
            } else if (actionId === actions.RANGE) {
                action = "RANGE";
            } else if (actionId === actions.PASSIVE) {
                action = "PASSIVE";
            }

            return [motion, action, dir, stat];
        }

        this.collision = function(other) { 
            var type = other.constructor;
            if (type === Platform) {
                self.vel.y = 0;
                self.center.y = other.center.y - other.size.y/2 - self.size.y/2
                      
                // Recharge hover
                self.resources.hover = 100;
            }
        }
        this.boundingBox = C.collider.RECTANGLE;

        this.draw = function(ctx) { 
            var state = this.state;

            if (state.action === actions.PASSIVE) {
                if (state.motion === motions.BOOST_LEFT) {
                    this.animator.push("Boost_Legs_L");
                    this.animator.push("Boost_Top_L");
                    this.animator.push("PFX_Boost_L");
                } else if (state.motion === motions.BOOST_RIGHT) {
                    this.animator.push("Boost_Legs_R");
                    this.animator.push("Boost_Top_R");
                    this.animator.push("PFX_Boost_R");
                } else if (state.motion === motions.WALK) {
                    if (state.facing === facing.RIGHT)
                        this.animator.push("Walk_R");
                    else
                        this.animator.push("Walk_L");
                } else if (state.motion === motions.STAND) {
                     if (state.facing === facing.RIGHT)
                        this.animator.push("Stand_R");
                    else
                        this.animator.push("Stand_L");
               } else if (state.motion === motions.FALLING) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Falling_Legs_R");
                        this.animator.push("Falling_Top_R");
                    } else {
                        this.animator.push("Falling_Legs_L");
                        this.animator.push("Falling_Top_L");
                    }

               } else if (state.motion === motions.JUMP) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Jump_R");
                    } else {
                        this.animator.push("Jump_L");
                    }
               } else if (state.motion === motions.CROUCH) {
                    if (state.facing === facing.RIGHT) {
                       this.animator.push("Crouch_R");
                    } else {
                       this.animator.push("Crouch_L");
                    }
               }
            } else if (state.action === actions.MELEE) {
                if (state.motion === motions.BOOST_LEFT) {
                    this.animator.push("Boost_Legs_L");
                    this.animator.push("Boost_Slash_L");
                    this.animator.push("PFX_Boost_L");
                } else if (state.motion === motions.BOOST_RIGHT) {
                    this.animator.push("Boost_Legs_R");
                    this.animator.push("Boost_Slash_R");
                    this.animator.push("PFX_Boost_R");
                } else if (state.motion === motions.FALLING || state.motion === motions.JUMP) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Falling_Slash_R");
                    } else {
                        this.animator.push("Falling_Slash_L");
                    }
               } else if (state.motion === motions.WALK || state.motion === motions.STAND) {
                    if (state.facing === facing.RIGHT) {
                       this.animator.push("Walk_Slash_Swing_R");
                    } else {
                       this.animator.push("Walk_Slash_Swing_L");
                    }
               } else if (state.motion === motions.CROUCH) {
                    if (state.facing === facing.RIGHT) {
                       this.animator.push("Crouch_Stab_R");
                    } else {
                       this.animator.push("Crouch_Stab_L");
                    }
               }
            } else if (state.action === actions.MELEE_RVS) {
               this.animator.push("Walk_Slash_Swing_Reverse_R");
            } else if (state.action === actions.RANGE) {
                if (state.motion === motions.BOOST_LEFT) {
                    this.animator.push("Boost_Legs_L");
                    this.animator.push("Boost_Laser_L");
                    this.animator.push("PFX_Laser_Boost_L");
                } else if (state.motion === motions.BOOST_RIGHT) {
                    this.animator.push("Boost_Legs_R");
                    this.animator.push("Boost_Laser_R");
                    this.animator.push("PFX_Laser_Boost_R");
                } else if (state.motion === motions.FALLING) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Falling_Laser_Legs_R");
                        this.animator.push("Falling_Laser_Top_R");
                        this.animator.push("PFX_Laser_Fall_R");
                    } else {
                        this.animator.push("Falling_Laser_Legs_L");
                        this.animator.push("Falling_Laser_Top_L");
                        this.animator.push("PFX_Laser_Fall_L");
                    }

                } else if (state.motion === motions.WALK) {
                    if (state.facing === facing.RIGHT)
                        this.animator.push("Walk_R");
                    else
                        this.animator.push("Walk_L");
                } else if (state.motion === motions.STAND) {
                     if (state.facing === facing.RIGHT)
                        this.animator.push("Stand_R");
                    else
                        this.animator.push("Stand_L");
                } else if (state.motion === motions.JUMP) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Jump_R");
                    } else {
                        this.animator.push("Jump_L");
                    }
               } else if (state.motion === motions.CROUCH) {
                    if (state.facing === facing.RIGHT) { 
                        this.animator.push("Crouch_Laser_R");
                        this.animator.push("PFX_Laser_Crouch_R");
                    } else {
                        this.animator.push("Crouch_Laser_L");
                        this.animator.push("PFX_Laser_Crouch_L");
                    }
               }
            } else if (state.action === actions.CHARGE) {
                if (state.facing === facing.RIGHT) {
                    this.animator.push("Walk_Slash_Charge_R");
                } else {
                    this.animator.push("Walk_Slash_Charge_L");
                }
            } else if (state.action === actions.SWING) {
                if (state.facing === facing.RIGHT) {
                    this.animator.push("Walk_Slash_Release_R");
                } else {
                    this.animator.push("Walk_Slash_Release_L");
                }

            } 

            this.animator.draw(ctx);

            if (DEBUG) {
                ctx.fillStyle = "#fff";
                if (state.action !== actions.BLIP) {
                    ctx.fillRect(this.center.x - this.size.x/2
                               , this.center.y - this.size.y/2
                               , this.size.x
                               , this.size.y);
                }

                ctx.fillStyle = "#000";
                ctx.strokeRect(this.attackBox.center.x - this.attackBox.size.x/2
                             , this.attackBox.center.y - this.attackBox.size.y/2
                             , this.attackBox.size.x
                             , this.attackBox.size.y);

                ctx.fillStyle = "#000";

                var x = this.center.x - this.size.x/2;
                var y = this.center.y;
                var w = this.size.x;
                var stringList = this.stateToStringList();
                ctx.fillText(stringList[0], x, y     , w);
                ctx.fillText(stringList[1], x, y + 10, w);
                ctx.fillText(stringList[2], x, y + 20, w);
                ctx.fillText(stringList[3], x, y + 30, w);
            }

        }

        function reduce(n, x) {
            var pos = Math.abs(n), 
                sign = n > 0 ? 1 : -1,
                result;
            if (x > pos) {
                result = 0;
            } else {
                result = (pos - x) * sign
            }
            return result;
        }

        function handleInput() {
            var vx = self.vel.x;
            var vy = self.vel.y;

            if (game.sequencer.isPressed("BOOST_UP")) { 
                self.vel.y = -BOOST_Y;
                self.state.motion = motions.JUMP;
                self.stater.emit("Boost");
            } else if (game.sequencer.isPressed("BOOST_DOWN")) { 
                self.vel.y = BOOST_Y;
                self.state.motion = motions.BOOST_DOWN;
                self.stater.emit("Boost");
            } else if (game.sequencer.isPressed("BOOST_LEFT")) { 
                self.vel.x += -BOOST_X;                   
                self.state.motion = motions.BOOST_LEFT;   
                self.state.facing = facing.LEFT;
                self.stater.emit("Boost_Horizontal");
            } else if (game.sequencer.isPressed("BOOST_RIGHT")) { 
                self.vel.x += BOOST_X;
                self.state.motion = motions.BOOST_RIGHT;
                self.state.facing = facing.RIGHT;
                self.stater.emit("Boost_Horizontal");
            } else if (C.inputter.isDown(C.inputter.S)) { 
                if (vy === 0) { self.state.motion = motions.CROUCH; } else if (vy > 0) { 
                   self.state.motion = motions.FALLING; 
                }
            } else if (C.inputter.isDown(C.inputter.D) && C.inputter.isDown(C.inputter.A)) {
                if (self.state.facing === facing.RIGHT) {
                    self.vel.x = Math.max(WALK_X, vx);
                } else {
                    self.vel.x = Math.min(-WALK_X, vx);
                }
            } else if (C.inputter.isDown(C.inputter.D)) {
                if (self.state.facing === facing.LEFT) {
                    if (self.state.motion === motions.BOOST_RIGHT) {
                        self.state.motion = motions.BOOST_LEFT;
                    } else if (self.state.motion === motions.BOOST_LEFT) {
                        self.state.motion = motions.BOOST_RIGHT;
                    } else {
                        self.state.motion = motions.STAND;
                    }
                    self.state.facing = facing.RIGHT;
                } else if (vx > 0) {
                    self.vel.x = Math.max(WALK_X, vx);
                } else if (vx === 0) {
                    self.vel.x = WALK_X;
                }
            } else if (C.inputter.isDown(C.inputter.A)) {
                if (self.state.facing === facing.RIGHT) {
                    if (self.state.motion === motions.BOOST_RIGHT) {
                        self.state.motion = motions.BOOST_LEFT;
                    } else if (self.state.motion === motions.BOOST_LEFT) {
                        self.state.motion = motions.BOOST_RIGHT;
                    } else {
                        self.state.motion = motions.STAND;
                    }

                    self.state.facing = facing.LEFT;
                } else if (vx < 0) {
                    self.vel.x = Math.min(-WALK_X, vx);
                } else if (vx === 0) {
                    self.vel.x = -WALK_X;
                } 
            } else if (C.inputter.isDown(C.inputter.W) 
                        && self.resources.hover > 0
                        && vy >= 0) {
                // Falling or not in air
                self.resources.hover -= 1.5;
                self.vel.y = -0.2;
                self.state.motion = motions.JUMP;
            }

            if (C.inputter.isPressed(C.inputter.J)) {
                self.stater.emit("Melee");
            } else if (C.inputter.isPressed(C.inputter.L)) {
                self.stater.emit("Range");
            } else if (C.inputter.isPressed(C.inputter.K)) {
                self.stater.emit("Blip");
            }

        }

        function meleeAction() {

            // Create attack hitbox
            
            //self.attackBox.center = self.center;
            //self.attackBox.size.x = 500;
            //C.collider.createEntity(self.attackBox);
            //self.meleeTimer.after(500, function() {
            //    self.attackBox.size.x = 10;
            //    C.collider.destroyEntity(self.attackBox);
            //});            

        };
    };

})(this);
