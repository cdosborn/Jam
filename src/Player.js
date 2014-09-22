var FRIC = 0.1,
    GRAV = 0.3,
    BOOST_X = 20,
    BOOST_Y = 15,

    // After BOOST_CAST actions no longer combined
    // with BOOST

    BOOST_CAST = 200,           

    // BOOST_MELEE_CAST duration where a different
    // action could be applied to the boost

    BOOST_MELEE_CAST = 100,

    // BOOST_MELEE_BCKSWNG duration following
    // the cast, where the player is vulnerable
    // and cannot change animation

    BOOST_MELEE_BCKSWNG = 600,   //700 totoal

    // The duration where the melee can be cancelled
    // while walking

    WALK_MELEE_CAST = 200,

    // The duration of vulnerability following the
    // cast point

    WALK_MELEE_BCKSWNG = 350,    //550 total

    CHARGE_CAST = 100, // no idea, just to make this work

    BLIP_CAST = 100,
    BLIP_BCKSWNG = 500,
    FALL_MELEE_CAST = 100,
    FALL_MELEE_BCKSWNG = 500,
    LASER_CAST = 100,
    LASER_BCKSWNG = 700,
    HOVER = 100,
    HOVER_INCREMENT = 1,
    DIV = 15,
    DEBUG = false,
    WALK_X = 5;

;(function(exports) {
    exports.Player = function(game, settings) {
        var self = this,
            C = game.c;
        for (var i in settings) {
          this[i] = settings[i];
        }

        // Enumerate state
        var motions = { WALK: 0
                      , STAND: 1 
                      , CROUCH: 2
                      , HOVER: 3
                      , FALLING: 4 
                      , BOOST_UP: 5
                      , BOOST_DOWN: 6
                      , BOOST_LEFT: 7
                      , BOOST_RIGHT: 8
                      }

        this.interval = 0;

        var facing = { LEFT: 0
                     , RIGHT: 1 }

        var actions = { BLIP: 0
                      , MELEE: 1
                      , RANGE: 2 
                      , PASSIVE: 3 
                      , STAGGER: 4 }

        var status =  { FREE: 0
                      , BUSY: 1 } 

        this.state = { action: actions.PASSIVE
                     , motion: motions.STAND 
                     , facing: facing.RIGHT 
                     , status: status.FREE } 

        this.flags = { boostCastActive: false }

        this.resources = { boost:  100
                         , hover:  HOVER
                         , health: 100 }

        this.vel = { x:0, y:0 }

        this.actionTimer = Timer(this);
        this.meleeTimer = Timer(this);
        this.boostTimer = Timer(this);

        this.attackBox = { size: {x:10,y:50}
                         , center: this.center
                         , name: "attack"
                         }
        C.entities._entities.push(this.attackBox);

        this.animator = Animator(this);

        animations_to_register = { // maybe eventually load this from some external json
          "Boost_Legs_R" : {frames: 7},
          "Walk_Slash_Charge_R" : {frames: 28, fps: 20, size: {x:192, y:106}}
        }

        for (var animation in animations_to_register) { // I'd rather write parsing code like this once than have all those things explicit
          if (animations_to_register.hasOwnProperty(animation)) {
            var frames = [];
            for (var i = 0; i < frames; i++){ frames.push(i) }
            var animation_data = {
                img: game.images[animation],  
                frames: frames
            }
            if (animations_to_register[animation].fps) {
              animation_data.fps = animaitons_to_register.fps;
            }
            if (animations_to_register[animation].size) {
              animation_data.fps = animaitons_to_register.size;
            }
            this.animator.register(animation, Animation(this, animation_data));
          }
        }

        game.sequencer.bind("BOOST_UP", [C.inputter.W, -C.inputter.W, C.inputter.W]);
        game.sequencer.bind("BOOST_DOWN", [C.inputter.S, -C.inputter.S, C.inputter.S]);
        game.sequencer.bind("BOOST_RIGHT", [C.inputter.D, -C.inputter.D, C.inputter.D]); 
        game.sequencer.bind("BOOST_LEFT", [C.inputter.A, -C.inputter.A, C.inputter.A]);
        
        this.update = function(delta) {

            this.actionTimer.update(delta);
            this.meleeTimer.update(delta);
            this.boostTimer.update(delta);
            this.animator.update(delta);

            if (this.state.status === status.FREE) {
                handleInput();
            } else {
                handleActions();
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

            var motion_map = {
              motions.BOOST_UP : "BOOST UP",
              motions.BOOST_DOWN : "BOOST DOWN",
              motions.BOOST_RIGHT : "BOOST RIGHT"
              // etc.
            }

            motion = motion_map[motionId]


            // maybe each of these should be a separate function?

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
            }
        }
        this.boundingBox = C.collider.RECTANGLE;

        this.draw = function(ctx) { 
            var state = this.state;

            action, motion, facing, 


            // This could be data-driven too - build a table describing which animations to push,
            // then write a little code to navigate the table given a state - and if necessary for speed,
            // compile them into something for faster lookups (nested objects or something)

            to_push = [
              [actions.PASSIVE, motions.BOOST_LEFT, [facing.LEFT, facing.RIGHT], function(){
                    this.animator.push("Boost_Legs_L");
                    this.animator.push("Boost_Top_L");
                    this.animator.push("PFX_Boost_L");
              }],
              [actions.PASSIVE, motions.BOOST_RIGHT, [facing.LEFT, facing.RIGHT], function(){
                    this.animator.push("Boost_Legs_R");
                    this.animator.push("Boost_Top_R");
                    this.animator.push("PFX_Boost_R");
              }]
              //etc
            ];

            for animation_set in to_push {
              if it matches, do it
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

            var actions = {};
          // this looks harder - but if we named each case and described the conditions, I think
          // we could get somethign flatter and easier to edit. This should probably be at least
          // two separate functions as well.

            if (game.sequencer.isPressed("BOOST_UP")) {
                self.vel.y += -BOOST_Y;
                self.state.motion = motions.Jump;
            } else if (game.sequencer.isPressed("BOOST_DOWN")) {
                self.vel.y += BOOST_Y;
                self.state.motion = motions.BOOST_DOWN;
            } else if (C.inputter.isDown(C.inputter.S)) { 
                if (vy === 0) { 
                   self.state.motion = motions.CROUCH; 
                } else if (vy > 0) { 
                   self.state.motion = motions.FALLING; 
                }
            } else if (game.sequencer.isPressed("BOOST_RIGHT")) { 
                self.vel.x += BOOST_X;
                self.state.motion = motions.BOOST_RIGHT;
                self.state.facing = facing.RIGHT;
                self.flags.boostCastActive = true;
                self.boostTimer.after(BOOST_CAST, function() { self.flags.boostCastActive = false; });
            } else if (game.sequencer.isPressed("BOOST_LEFT")) {
                self.vel.x += -BOOST_X;
                self.state.motion = motions.BOOST_LEFT;
                self.state.facing = facing.LEFT;
                self.flags.boostCastActive = true;
                self.boostTimer.after(BOOST_CAST, function() { self.flags.boostCastActive = false; });
            } else if (C.inputter.isDown(C.inputter.D) && C.inputter.isDown(C.inputter.A)) {
                if (self.state.facing === facing.RIGHT) {
                    self.vel.x = Math.max(WALK_X, vx);
                } else {
                    self.vel.x = Math.min(-WALK_X, vx);
                }
            } else if (C.inputter.isDown(C.inputter.D)) {
                if (self.state.facing === facing.LEFT) {
                    self.state.facing = facing.RIGHT;
                } else if (vx > 0) {
                    self.vel.x = Math.max(WALK_X, vx);
                } else if (vx === 0) {
                    self.vel.x = WALK_X;
                }
            } else if (C.inputter.isDown(C.inputter.A)) {
                if (self.state.facing === facing.RIGHT) {
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
                self.state.motion = motions.HOVER;
            } 
            
            // State modifications based on what was
            // applied above

            var newVx = self.vel.x;
            var newVy = self.vel.y;
            var absNewVx = Math.abs(newVx);
            if (newVy > 0 && absNewVx <= WALK_X) {
                self.state.motion = motions.FALLING;
            } else if (absNewVx <= WALK_X && absNewVx > 0 && !self.flags.boostCastActive) {
                self.state.motion = motions.WALK;
            } else if (newVx === 0 && newVy === 0 && !self.flags.boostCastActive) {
                  
                // !self.flags.boostCastActive checks that we are NOT in a boost
                // attack sequence, otherwise the vel becomes 0 and handleInput
                // thinks STAND

                self.state.motion = motions.STAND;
            }                                                             

            // Recharge hover
            if (!C.inputter.isDown(C.inputter.W)){
                self.resources.hover = Math.min(HOVER, self.resources.hover + HOVER_INCREMENT);
            } 



            if (self.state.action !== actions.PASSIVE) {
                if (C.inputter.getEvents().filter(function(e) { return e.type === "keydown"; }).length > 0) {
                    self.animator.reset();
                    self.state.action = actions.PASSIVE;
                    self.actionTimer = Timer(self);
                }
            }

            if (C.inputter.isPressed(C.inputter.J)) {

                // If control flow still includes handleInput, then cast point has not been reached
                // thus any action key press resets the animation.
                self.animator.reset();

                if ((self.state.motion === motions.BOOST_RIGHT 
                            || self.state.motion === motions.BOOST_LEFT) 
                        && self.flags.boostCastActive) {
                    self.state.action = actions.MELEE;
                    self.vel.x = 0 //(newVx < 0 ? -0.2 : 0.2);  // WITH FRICTION RESULTS IN A STAND STATE
                    self.actionTimer.after(BOOST_MELEE_CAST, function() {
                        self.state.status = status.BUSY;
                     // slashPFXObj.center.x = self.center.x + (newVx < 0 ? -10*BOOST_X : 10*BOOST_X);
                     // slashPFXObj.center.y = self.center.y;
                        self.state.motion = (newVx < 0 ? motions.BOOST_LEFT : motions.BOOST_RIGHT);
                        self.vel.x = (newVx < 0 ? -BOOST_X : BOOST_X); // now apply boost
                        meleeAction();
                        self.actionTimer.after(BOOST_MELEE_BCKSWNG, function() { 
                            self.state.status = status.FREE;
                            self.state.action = actions.PASSIVE;
                            self.actionTimer.after();
                        });
                    });
                } else if (self.state.motion === motions.WALK || self.state.motion === motions.STAND) {
                    self.state.action = actions.MELEE;
                    self.actionTimer.after(WALK_MELEE_CAST, function() {
                        self.state.status = status.BUSY;
                          
                        //self.vel.x = (self.state.facing === facing.RIGHT ? 3 : self.vel.x); // creep fwd
                        meleeAction();
                        self.actionTimer.after(WALK_MELEE_BCKSWNG, function() { 
                            self.state.status = status.FREE;
                            self.state.action = actions.PASSIVE;
                            self.flags.chargeCastActive = true;
                            self.actionTimer.after(CHARGE_CAST, function() {
                                self.flags.chargeCastActive = false;
                            })
                        });
                    });

                } else if (self.state.motion === motions.FALLING) { 
                    self.state.action = actions.MELEE;
                    self.actionTimer.after(FALL_MELEE_CAST, function() {
                        self.state.status = status.BUSY;
                          
                        //self.vel.x = (self.state.facing === facing.RIGHT ? 3 : self.vel.x); // creep fwd
                        meleeAction();
                        self.actionTimer.after(FALL_MELEE_BCKSWNG, function() { 
                            self.state.status = status.FREE;
                            self.state.action = actions.PASSIVE;
                        });
                    });


                }
            } else if (C.inputter.isPressed(C.inputter.K)) {
                self.actionTimer.after(BLIP_CAST, function() {
                    self.state.status = status.BUSY;
                   self.state.action = actions.BLIP; 
                    blipAction();
                    self.actionTimer.after(BLIP_BCKSWNG, function() { 
                        self.state.status = status.FREE;
                        self.state.action = actions.PASSIVE;
                    });
                });
            } else if (C.inputter.isPressed(C.inputter.L)) {
                self.actionTimer.after(LASER_CAST, function() {
                    self.state.status = status.BUSY;
                    self.state.action = actions.RANGE;
                    rangeAction();
                    self.actionTimer.after(LASER_BCKSWNG, function() { 
                        self.state.status = status.FREE;
                        self.state.action = actions.PASSIVE;
                    });
                });
            }
        }

        function handleActions() {
            if (self.state.action === actions.MELEE) {
                  
                // if attack hitbox collides with enemy
                // send damage to enemy

                // Creeping forward for melee
                if (self.state.motion === motions.WALK || self.state.motion === motions.STAND) {
                    self.center.x += (self.state.facing === facing.RIGHT ? 10 : -10);
                }


            } else if (self.state.action === actions.BLIP) {
            } else if (self.state.action === actions.RANGE) {
            }
            self.vel.y = reduce(self.vel.y, 1);
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
        function slowMeleeAction() {
            // Create attack hitbox

            //self.attacker.register(
            //        [ x, y, width, height
            //        , x2,y2,width2,height2
            //        ]
        };

        function rangeAction() {
        };
        function blipAction() {
        };

    };

})(this);
