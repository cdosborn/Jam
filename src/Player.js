var FRIC = 0.1,
    GRAV = 0.3,
    BOOST_X = 20,
    BOOST_Y = 15,
    HOVER = 100,
    HOVER_INCREMENT = 1,
    DIV = 15,
//  DEBUG = true,
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

        this.state = { action: actions.PASSIVE
                     , motion: motions.STAND 
                     , facing: facing.RIGHT } 

        this.resources = { boost:  100
                         , hover:  HOVER
                         , health: 100 }

        this.vel = { x:0, y:0 }

        this.actionTimer = Timer(this);
        this.meleeTimer = Timer(this);

        this.attackBox = { size: {x:10,y:50}
                         , center: this.center
                         , name: "attack"
                         }
        C.entities._entities.push(this.attackBox);

        this.animator = Animator(this);
        this.animator.register("Boost_Legs_R", Animation(this, { 
            img: game.images['Boost_Legs_R'],  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Legs_L", Animation(this, { 
            img: game.images['Boost_Legs_L'],  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Top_R", Animation(this, { 
            img: game.images['Boost_Top_R'],  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Top_L", Animation(this, { 
            img: game.images['Boost_Top_L'],  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Slash_L", Animation(this, { 
            img: game.images['Boost_Slash_L'],  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Slash_R", Animation(this, { 
            img: game.images['Boost_Slash_R'],  
            frames: [0,1,2,3,4,5,6]
        }));
        this.animator.register("Boost_Laser_L", Animation(this, { 
            img: game.images['Boost_Laser_L'],  
            frames: [0,1,2,3,4,5,6],
            size: {x:124,y:106}
        }));
        this.animator.register("Boost_Laser_R", Animation(this, { 
            img: game.images['Boost_Laser_R'],  
            frames: [0,1,2,3,4,5,6],
            size: {x:124,y:106}
        }));

        this.animator.register("Walk_L", Animation(this, { 
            img: game.images['Walk_L'],  
            frames: [0,1,2,3,4,5,6],
            size: {x:97,y:106}
        }));
        this.animator.register("Walk_R", Animation(this, { 
            img: game.images['Walk_R'],  
            frames: [0,1,2,3,4,5,6],
            size: {x:97,y:106}
        }));
        this.animator.register("Stand_R", Animation(this, { 
            img: game.images['Stand_R'],  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
            size: {x:76,y:104}
        }));
        this.animator.register("Stand_L", Animation(this, { 
            img: game.images['Stand_L'],  
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
            size: {x:76,y:104}
        }));
        this.animator.register("Falling_Top_L", Animation(this, { 
            img: game.images['Falling_Top_L'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Top_R", Animation(this, { 
            img: game.images['Falling_Top_R'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Legs_L", Animation(this, { 
            img: game.images['Falling_Legs_L'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Legs_R", Animation(this, { 
            img: game.images['Falling_Legs_R'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Slash_Top_L", Animation(this, { 
            img: game.images['Falling_Slash_Top_L'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:166,y:130}
        }));
        this.animator.register("Falling_Slash_Top_R", Animation(this, { 
            img: game.images['Falling_Slash_Top_R'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:166,y:130}
        }));
        this.animator.register("Falling_Slash_Legs_L", Animation(this, { 
            img: game.images['Falling_Slash_Legs_L'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:166,y:130}
        }));
        this.animator.register("Falling_Slash_Legs_R", Animation(this, { 
            img: game.images['Falling_Slash_Legs_R'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:166,y:130}
        }));
        this.animator.register("Falling_Laser_Top_L", Animation(this, { 
            img: game.images['Falling_Laser_Top_L'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Laser_Top_R", Animation(this, { 
            img: game.images['Falling_Laser_Top_R'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Laser_Legs_L", Animation(this, { 
            img: game.images['Falling_Laser_Legs_L'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));
        this.animator.register("Falling_Laser_Legs_R", Animation(this, { 
            img: game.images['Falling_Laser_Legs_R'],  
            frames: [0,1,2,3,4,5,6,7,8],
            size: {x:62,y:126}
        }));

        game.sequencer.bind("BOOST_UP", [C.inputter.W, -C.inputter.W, C.inputter.W]);
        game.sequencer.bind("BOOST_DOWN", [C.inputter.S, -C.inputter.S, C.inputter.S]);
        game.sequencer.bind("BOOST_RIGHT", [C.inputter.D, -C.inputter.D, C.inputter.D]); 
        game.sequencer.bind("BOOST_LEFT", [C.inputter.A, -C.inputter.A, C.inputter.A]);
        
        this.update = function(delta) {

            this.actionTimer.update(delta);
            this.meleeTimer.update(delta);
            this.animator.update(delta);

            if (this.state.action === actions.PASSIVE) {
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
            var motion, action, dir;

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
            
            if (actionId === actions.BLIP) {
                action = "BLIP";
            } else if (actionId === actions.MELEE) {
                action = "MELEE";
            } else if (actionId === actions.RANGE) {
                action = "RANGE";
            } else if (actionId === actions.PASSIVE) {
                action = "PASSIVE";
            }

            return [motion, action, dir];
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

            if (state.action === actions.PASSIVE) {
                if (state.motion === motions.BOOST_LEFT) {
                    this.animator.push("Boost_Legs_L");
                    this.animator.push("Boost_Top_L");
                } else if (state.motion === motions.BOOST_RIGHT) {
                    this.animator.push("Boost_Legs_R");
                    this.animator.push("Boost_Top_R");
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

               }
            } else if (state.action === actions.MELEE) {
                if (state.motion === motions.BOOST_LEFT) {
                    this.animator.push("Boost_Legs_L");
                    this.animator.push("Boost_Slash_L");
                } else if (state.motion === motions.BOOST_RIGHT) {
                    this.animator.push("Boost_Legs_R");
                    this.animator.push("Boost_Slash_R");
                } else if (state.motion === motions.FALLING) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Falling_Slash_Legs_R");
                        this.animator.push("Falling_Slash_Top_R");
                    } else {
                        this.animator.push("Falling_Slash_Legs_L");
                        this.animator.push("Falling_Slash_Top_L");
                    }

               }
            } else if (state.action === actions.RANGE) {
                if (state.motion === motions.BOOST_LEFT) {
                    this.animator.push("Boost_Legs_L");
                    this.animator.push("Boost_Laser_L");
                } else if (state.motion === motions.BOOST_RIGHT) {
                    this.animator.push("Boost_Legs_R");
                    this.animator.push("Boost_Laser_R");
                } else if (state.motion === motions.FALLING) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Falling_Laser_Legs_R");
                        this.animator.push("Falling_Laser_Top_R");
                    } else {
                        this.animator.push("Falling_Laser_Legs_L");
                        this.animator.push("Falling_Laser_Top_L");
                    }

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
            if (game.sequencer.isPressed("BOOST_UP")) {
                self.vel.y += -BOOST_Y;
                self.state.motion = motions.BOOST_UP;
            } else if (game.sequencer.isPressed("BOOST_DOWN")) {
                self.vel.y += BOOST_Y;
                self.state.motion = motions.BOOST_DOWN;
            } else if (C.inputter.isDown(C.inputter.S)) { 
                if (self.vel.y === 0) { 
                   self.state.motion = motions.CROUCH;
               } else if (self.vel.y > 0) { 
                   self.state.motion = motions.FALLING;
               }
            } else if (game.sequencer.isPressed("BOOST_RIGHT")) {
                self.vel.x += BOOST_X;
                self.state.motion = motions.BOOST_RIGHT;
            } else if (game.sequencer.isPressed("BOOST_LEFT")) {
                self.vel.x += -BOOST_X;
                self.state.motion = motions.BOOST_LEFT;
            } else if (C.inputter.isDown(C.inputter.D) && C.inputter.isDown(C.inputter.A)) {
                if (self.state.facing === facing.RIGHT) {
                    self.vel.x = Math.max(WALK_X, self.vel.x);
                } else {
                    self.vel.x = Math.min(-WALK_X, self.vel.x);
                }
            } else if (C.inputter.isDown(C.inputter.D)) {
                if (self.state.facing === facing.LEFT) {
                    self.state.facing = facing.RIGHT;
                } else if (self.vel.x > 0) {
                    self.vel.x = Math.max(WALK_X, self.vel.x);
                } else if (self.vel.x === 0) {
                    self.vel.x = WALK_X;
                }
            } else if (C.inputter.isDown(C.inputter.A)) {
                if (self.state.facing === facing.RIGHT) {
                    self.state.facing = facing.LEFT;
                } else if (self.vel.x < 0) {
                    self.vel.x = Math.min(-WALK_X, self.vel.x);
                } else if (self.vel.x === 0) {
                    self.vel.x = -WALK_X;
                } 
            } else if (C.inputter.isDown(C.inputter.W) 
                        && self.resources.hover > 0
                        && self.vel.y >= 0) {
                // Falling or not in air
                self.resources.hover -= 1.5;
                self.vel.y = -0.2;
                self.state.motion = motions.HOVER;
            } 
            
            var xSpeed = Math.abs(self.vel.x);
            
            if (self.vel.y > 0 && xSpeed <= WALK_X) {
                self.state.motion = motions.FALLING;
            } else if (xSpeed <= WALK_X && xSpeed > 0) {
                self.state.motion = motions.WALK;
            } else if (self.vel.x === 0 && self.vel.y === 0) {
                self.state.motion = motions.STAND;
            }                                                             

            if (!C.inputter.isDown(C.inputter.W)){
                // Recharge hover
                self.resources.hover = Math.min(HOVER, self.resources.hover + HOVER_INCREMENT);
            } 

            if (C.inputter.isPressed(C.inputter.J)) {
                self.actionTimer.after(100, function() {
                    self.state.action = actions.MELEE;
                    meleeAction();
                    self.actionTimer.after(900, function() { 
                        self.state.action = actions.PASSIVE;
                    });
                });
            } else if (C.inputter.isPressed(C.inputter.K)) {
                self.actionTimer.after(200, function() {
                   self.state.action = actions.BLIP; 
                    blipAction();
                    self.actionTimer.after(300, function() { 
                        self.state.action = actions.PASSIVE;
                    });
                });
            } else if (C.inputter.isPressed(C.inputter.L)) {
                self.actionTimer.after(100, function() {
                    self.state.action = actions.RANGE;
                    rangeAction();
                    self.actionTimer.after(900, function() { 
                        self.state.action = actions.PASSIVE;
                    });
                });
            }
        }

        function handleActions() {
            if (self.state.action === actions.MELEE) {
                  
                // if attack hitbox collides with enemy
                // send damage to enemy

            } else if (self.state.action === actions.BLIP) {
            } else if (self.state.action === actions.RANGE) {
            }
            self.vel.y = reduce(self.vel.y, 0.5);
        }

        function meleeAction() {

            // Create attack hitbox
            
            self.attackBox.center = self.center;
            self.attackBox.size.x = 500;
            C.collider.createEntity(self.attackBox);
            self.meleeTimer.after(500, function() {
                self.attackBox.size.x = 10;
                C.collider.destroyEntity(self.attackBox);
            });            


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
