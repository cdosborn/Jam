;(function(exports) {
    exports.Player = function(game, settings) {
        var self = this;
        var coq = game.c;
        var input = game.c.inputter;

        for (var i in settings) { 
            this[i] = settings[i];
        }

        // Enumerate state
        var C =       config.Player.Constants;
        var motions = config.Player.Motions;
        var facing =  config.Player.Facing;
        var actions = config.Player.Actions;
        var status  = config.Player.Status;

        this.resources = { 
            hover: C.HOVER, 
            health: C.HEALTH 
        }

        this.state = { 
            action: actions.PASSIVE, 
            motion: motions.STAND,
            facing: facing.RIGHT, 
            status: status.FREE 
        } 

        this.vel = { x:0, y:0 }

        this.animator = Animator(this, game, config.Player.Animations);

        this.stater = Stater(this, {
            init: function() { 
                self.state.action = actions.PASSIVE;
                self.state.status = status.FREE;
            },
            update: function() { 
                self.state.action = actions.PASSIVE;
                self.state.status = status.FREE;

                var vx = self.vel.x;
                var vy = self.vel.y;
                if (vy > 0) {
                    self.state.motion = motions.FALLING;
                }  else if (vy < 0) {
                    self.state.motion = motions.JUMP;
                } else if (Math.abs(vx) <= C.WALK_X && vx !== 0) {
                    self.state.motion = motions.WALK;
                } else if (vy === 0 && vx === 0 && !input.isDown(input.A) && !input.isDown(input.D)) {
                    self.state.motion = motions.STAND;
                }                                                             

            },
            children: {
                Boost_Up: {
                    duration : C.BOOST_CAST + C.BOOST_BCKSWNG,
                    children: {
                        Melee: {
                            duration: C.MELEE_CAST,
                            active: function(time) {
                                return input.noKeysDown();
                            },
                            init: function() {
                                self.state.action = actions.MELEE;
                            },
                            update: function(time) {
                                self.vel.x = self.vel.y = 0;
                            },
                            transition: function(time) { 
                                if (time < C.MELEE_CAST) {
                                    self.stater.toParent();
                                    self.animator.reset();
                                } else {
                                    self.stater.toSibling("MeleeBckswng");
                                }
                            },
                        },
                        MeleeBckswng: {
                            duration: C.MELEE_BCKSWNG,
                            init: function() {
                                self.state.status = status.BUSY;
                                self.attacker.trigger("Melee_Walk");
                            },
                            update: function(time) {
                                if (C.MELEE_BCKSWNG - time < 200 && input.isDown(input.J)) {
                                    self.state.status = status.FREE;
                                }
                                self.vel.x = self.vel.y = 0;
                            }
                        },
                        Range: { 
                            duration: C.LASER_CAST + C.LASER_BCKSWNG,
                            init: function() {
                                self.state.action = actions.RANGE;
                                self.attacker.trigger("Range_Attack");
                            },
                            transition: function() {
                                self.state.action = actions.PASSIVE; 
                                self.stater.toParent();
                                self.animator.reset();
                            }

                        }
                    }
                },
                Boost_Horizontal: {
                    duration : C.BOOST_CAST + C.BOOST_BCKSWNG,
                    init: function() {
                        self.vel.x = (self.vel.x > 0 ? C.BOOST_X : -C.BOOST_X);
                    },
                    update: function(time) {
                        self.vel.y = 0;
                    },
                    children: {
                        Melee: {
                            duration: C.BOOST_MELEE_CAST + C.BOOST_MELEE_BCKSWNG,
                            active: function(time) {
                                var isKeyDown = function(e) { return e.type === "keydown" };
                                var noKeyDown = input.getEvents()
                                                          .filter(isKeyDown)
                                                          .length === 0;

                                return noKeyDown || time > C.BOOST_MELEE_CAST
                            },                            
                            init: function() {
                                self.state.action = actions.MELEE;
                                self.state.status = status.BUSY;
                                self.attacker.trigger("Melee_Dash");
                                self.vel.y = 0;
                            },
                            update: function(time) {
                                if (time > C.BOOST_MELEE_CAST && time < C.BOOST_MELEE_CAST + 150) {
                                    self.state.status = status.BUSY;
                                    self.vel.x = (self.state.facing === facing.RIGHT ? C.BOOST_X * 2 : -C.BOOST_X * 2);
                                } else {
                                    self.vel.x = (self.state.facing === facing.RIGHT ? 1 : -1);
                                }

                                self.vel.y = 0;
                            },
                            transition: function() {
                                //self.vel.x = 0;
                                self.state.action = actions.PASSIVE;
                                self.state.status = status.FREE;
                                self.stater.toParent();
                            }
                        },
                        Range: { 
                            duration: C.LASER_CAST + C.LASER_BCKSWNG,
                            init: function() {
                                self.state.action = actions.RANGE;
                                self.vel.y = 0;
                                self.attacker.trigger("Range_Boost_Attack");
                            },
                            update: function(time) {
                                self.vel.y = 0;
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
                    duration: C.LASER_CAST + C.LASER_BCKSWNG,
                    init: function() {
                        self.state.action = actions.RANGE;
                        self.animator.reset();
                        self.attacker.trigger("Range_Attack");
                    },
                    update: function() {
                        self.vel.y = 0;
                    }
                },
                Melee: {
                    duration: C.MELEE_CAST,
                    active: function(time) {
                        var isKeyDown = function(e) { return e.type === "keydown" };
                        var noKeyDown = input.getEvents()
                                                  .filter(isKeyDown)
                                                  .length === 0;

                        return noKeyDown;
                    },
                    init: function() {
                        self.state.action = actions.MELEE;
                    },
                    update: function(time) {
                    },
                    transition: function(time) { 
                        if (time < C.MELEE_CAST) {
                            self.stater.toParent();
                            self.animator.reset();
                        } else {
                            self.stater.toSibling("MeleeBckswng");
                        }
                    },
                },
                MeleeBckswng: {
                    duration: C.MELEE_BCKSWNG,
                    init: function() {
                        self.state.status = status.BUSY;
                        self.attacker.trigger("Melee_Walk");
                    },
                    update: function(time) {
                        if (C.MELEE_BCKSWNG - time < 200 && input.isDown(input.J)) {
                            self.state.status = status.FREE;
                        }

                        // hover or stand still
                        //self.vel.x = self.vel.y = 0;
                    },
                    children: {
                        Melee: {
                            duration: C.MAX_CHARGE,
                            active: function(time) {
                                return input.isDown(input.J);
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
                                if (time < C.MIN_CHARGE_DUR) {
                                    self.stater.toParent();
                                    self.state.action = actions.PASSIVE;
                                    self.state.status = status.FREE; 
                                } else {
                                    self.stater.toSibling("Swing");
                                }
                            }
                        },
                        Swing: {
                            duration: C.RELEASE_BACKSWNG,
                            init: function() {
                                self.attacker.trigger("Melee_Power");
                                self.vel.x = (self.state.facing === facing.RIGHT ? C.BOOST_X : -C.BOOST_X);
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

        game.sequencer.bind("BOOST_UP", [input.W, -input.W, input.W]);
        game.sequencer.bind("BOOST_DOWN", [input.S, -input.S, input.S]);
        game.sequencer.bind("BOOST_RIGHT", [input.D, -input.D, input.D]); 
        game.sequencer.bind("BOOST_LEFT", [input.A, -input.A, input.A]);

        this.attacker = Attacker(game);
        this.attacker.register("Melee_Walk", {
            duration: C.MELEE_BCKSWNG,
            damage: 50,
            init: function() {
                this.size.x = 60;
                this.size.y = 100;
            },
            update: function(time) {
               this.center.y = self.center.y;
               if (self.state.facing === facing.RIGHT) {
                    this.center.x = self.center.x + self.size.x/2; 
               } else {
                    this.center.x = self.center.x - self.size.x/2; 
               }
            }
        });
        this.attacker.register("Melee_Dash", {
            duration: C.MELEE_BCKSWNG*2,
            damage: 50,
            init: function() {
                this.size.x = 60;
                this.size.y = 100;
            },
            update: function(time) {
               this.center.y = self.center.y;
               if (self.state.facing === facing.RIGHT) {
                    this.center.x = self.center.x + self.size.x/2; 
               } else {
                    this.center.x = self.center.x - self.size.x/2; 
               }
            }
        });
        this.attacker.register("Melee_Power", {
            duration: C.MELEE_BCKSWNG*2,
            damage: 200,
            init: function() {
                this.size.x = 60;
                this.size.y = 100;
            },
            update: function(time) {
               this.center.y = self.center.y;
               if (self.state.facing === facing.RIGHT) {
                    this.center.x = self.center.x + self.size.x/2; 
               } else {
                    this.center.x = self.center.x - self.size.x/2; 
               }
            }
        });
        this.attacker.register("Range_Attack", {
            duration: C.LASER_BCKSWNG,
            damage: 2,
            init: function() {
                this.size.y = 10;
            },
            update: function(time) {
               var part = time/this.duration;
               this.size.x = Math.min(360, 2 * time * part);


               if (self.state.facing === facing.RIGHT) {
                    this.center.x = self.center.x + self.size.x/2 + this.size.x/2 - 35; 
               } else {
                    this.center.x = self.center.x - self.size.x/2 - this.size.x/2 + 50;  
               }
               if (self.state.motion === motions.CROUCH) {
                   this.center.y = self.center.y; 
               } else {
                   this.center.y = self.center.y - 40; 
               }
            }
        });
        this.attacker.register("Range_Boost_Attack", {
            duration: C.LASER_BCKSWNG,
            damage: 2,
            init: function() {
                this.size.y = 10;
            },
            update: function(time) {
               var part = time/this.duration;
               this.size.x = Math.min(360, 2 * time * part);

               if (self.state.facing === facing.RIGHT) {
                    this.center.x = self.center.x + self.size.x/2 + this.size.x/2; 
               } else {
                    this.center.x = self.center.x - self.size.x/2 - this.size.x/2;  
               }
               if (self.state.motion === motions.CROUCH) {
                   this.center.y = self.center.y; 
               } else {
                   this.center.y = self.center.y - 40; 
               }

            }
        });
        this.attacker.register("Range_Crouch_Attack", {
            duration: C.LASER_BCKSWNG,
            damage: 2,
            init: function() {
                this.size.y = 10;
            },
            update: function(time) {
               var part = time/this.duration;
               this.size.x = Math.min(360, 2 * time * part);

               this.center.y = self.center.y; 

               if (self.state.facing === facing.RIGHT) {
                    this.center.x = self.center.x + self.size.x/2 + this.size.x/2; 
               } else {
                    this.center.x = self.center.x - self.size.x/2 - this.size.x/2;  
               }
            }
        });

        this.update = function(delta) {

            this.stater.update(delta);
            this.animator.update(delta);

            if (this.state.status === status.FREE) {
                handleInput();
            } 

            this.center.y += (this.vel.y * delta/C.DIV) | 0;
            this.center.x += (this.vel.x * delta/C.DIV) | 0;
              
            // Gravity
            this.vel.y += C.GRAV * delta/C.DIV
            
            // Friction
            this.vel.x = reduce(this.vel.x, C.FRIC * delta/C.DIV);

            // UGLY AND NEEDS TO CHANGE
            var view = {x: Math.min(Math.max(400, this.center.x), 3924), 
                        y: Math.max(Math.min(200, this.center.y - 90), -694)}
            game.c.renderer.setViewCenter(view); 
        }; 

        this.stateToStringList = function() {
            var motionId = this.state.motion;
            var actionId = this.state.action;
            var facingId = this.state.facing;
            var statusId = this.state.status;
            var motion, action, dir, stat;

            if (motionId === motions.JUMP) {
               motion = "JUMP";
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
                bottomPlayerEdge =  self.center.y + self.size.y/2;
                topPlayerEdge    =  self.center.y - self.size.y/2;
                topPlatformEdge  =  other.center.y - other.size.y/2;
                if (topPlayerEdge > topPlatformEdge) { // below
                    self.center.y = other.center.y + other.size.y/2 + self.size.y/2 + 1;
                } else {
                    self.center.y = other.center.y - other.size.y/2 - self.size.y/2;
                }
                      
                // Recharge hover
                self.resources.hover = 100;
                self.vel.y = 0;
            }
        }
        this.boundingBox = coq.collider.RECTANGLE;

        this.draw = function(ctx) {
            var state = this.state;

//          console.log(self.state.motion === motions.WALK);
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
               } else if (state.motion === motions.HOVER) {
                    if (state.facing === facing.RIGHT) {
                        this.animator.push("Jump_R");
                    } else {
                        this.animator.push("Jump_L");
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

            if (C.DEBUG) {
                ctx.fillStyle = "#fff";
                if (state.action !== actions.BLIP) {
                    ctx.fillRect(this.center.x - this.size.x/2
                               , this.center.y - this.size.y/2
                               , this.size.x
                               , this.size.y);
                }

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
                self.vel.y = -C.BOOST_Y;
                self.state.motion = motions.JUMP;
                self.stater.toRoot();
                self.stater.emit("Boost_Up");
            } else if (game.sequencer.isPressed("BOOST_DOWN")) { 
            } else if (game.sequencer.isPressed("BOOST_LEFT")) { 
                self.vel.x += -C.BOOST_X;                   
                self.state.motion = motions.BOOST_LEFT;   
                self.state.facing = facing.LEFT;
                self.stater.toRoot();
                self.stater.emit("Boost_Horizontal");
            } else if (game.sequencer.isPressed("BOOST_RIGHT")) { 
                self.vel.x += C.BOOST_X;
                self.state.motion = motions.BOOST_RIGHT;
                self.state.facing = facing.RIGHT;
                self.stater.toRoot();
                self.stater.emit("Boost_Horizontal");
            } else if (input.isDown(input.S)) { 
                if (vy === 0) { self.state.motion = motions.CROUCH; } else if (vy > 0) { 
                   self.state.motion = motions.FALLING; 
                }
            } else if (input.isDown(input.D) && input.isDown(input.A)) {
                if (self.state.facing === facing.RIGHT) {
                    self.vel.x = Math.max(C.WALK_X, vx);
                } else {
                    self.vel.x = Math.min(-C.WALK_X, vx);
                }
            } else if (input.isDown(input.D)) {
                if (self.state.facing === facing.LEFT) {
                    if (self.state.motion === motions.BOOST_RIGHT) {
                        self.state.motion = motions.BOOST_LEFT;
                    } else if (self.state.motion === motions.BOOST_LEFT) {
                        self.state.motion = motions.BOOST_RIGHT;
                    }

                    self.state.facing = facing.RIGHT;
                } else if (vx > 0) {
                    self.vel.x = Math.max(C.WALK_X, vx);
                } else if (vx === 0) {
                    self.vel.x = C.WALK_X;
                }
            } else if (input.isDown(input.A)) {
                if (self.state.facing === facing.RIGHT) {
                    if (self.state.motion === motions.BOOST_RIGHT) {
                        self.state.motion = motions.BOOST_LEFT;
                    } else if (self.state.motion === motions.BOOST_LEFT) {
                        self.state.motion = motions.BOOST_RIGHT;
                    }
                    self.state.facing = facing.LEFT;
                } else if (vx < 0) {
                    self.vel.x = Math.min(-C.WALK_X, vx);
                } else if (vx === 0) {
                    self.vel.x = -C.WALK_X;
                } 
            } else if (input.isDown(input.W) 
                        && self.resources.hover > 0
                        && vy >= 0) {
                // Falling or not in air
                self.resources.hover -= 1.5;
                self.vel.y = -0.8;
                self.state.motion = motions.HOVER;
            }

            if (input.isPressed(input.J)) {
                self.stater.emit("Melee");
            } else if (input.isPressed(input.L)) {
                self.stater.emit("Range");
            } else if (input.isPressed(input.K)) {
                self.stater.emit("Blip");
            }

        }

    };

})(this);
