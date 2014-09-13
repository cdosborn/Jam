var FRIC = 0.5,
    GRAV = 0.5,
    BOOST_X = 20,
    BOOST_Y = 15,
    HOVER = 100,
    HOVER_INCREMENT = 1,
    DIV = 15,
    WALK_X = 5;

;(function(exports) {
    exports.Enemy = function(game, settings) {
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

        this.target = C.entities.all(Player)[0];

        this.color = "#555";

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

        this.anims = {};
        
        this.update = function(delta) {

            this.interval = delta;

            if (this.target.center.x > this.center.x) {
                this.vel.x = 2;
            } else {
                this.vel.x = -2;
            }

            setState();

            this.center.y += this.vel.y * delta/DIV
            this.center.x += this.vel.x * delta/DIV

            // Gravity
            this.vel.y += GRAV * delta/DIV;
        }; 

        this.stateToString = function() {
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

        this.collision = function(other, type) { 
            var type = other.constructor;
            if (type === Platform) {
                self.vel.y = 0;
                self.center.y = other.center.y - other.size.y/2 - self.size.y/2
            }
        }
        this.boundingBox = C.collider.RECTANGLE;

        this.draw = function(ctx) { 

            if (this.state.motion === motions.WALK && this.state.facing === facing.RIGHT) {
                this.anim = this.anims["walkRight"];
            } else if (this.state.motion === motions.WALK && this.state.facing === facing.LEFT) {
                this.anim = this.anims["walkLeft"]
            } else if (this.state.action === actions.MELEE) {
                if (this.state.facing === facing.RIGHT) {
                    this.anim = this.anims["meleeRight"]
                } else {
                    this.anim = this.anims["meleeLeft"]
                }
            } else if (this.state.facing === facing.RIGHT) {
                this.anim = this.anims["standRight"]
            } else { // STAND LEFT
                this.anim = this.anims["standLeft"]
            }

            if (this.state.action === actions.BLIP) {
                this.anim = this.anims["durp"];
            }

            ctx.fillStyle = "#c00";
            ctx.fillRect(this.center.x - this.size.x/2,this.center.y - this.size.y/2,this.size.x,this.size.y);
            ctx.fillStyle = "#000";

            var x = this.center.x - this.size.x/2;
            var y = this.center.y;
            var w = this.size.x;
            ctx.fillText(this.stateToString()[0], x, y, w);
            ctx.fillText(this.stateToString()[1],x, y + 10, w);
            ctx.fillText(this.stateToString()[2],x, y + 20, w);

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
            }

            if (game.sequencer.isPressed("BOOST_DOWN")) {
                self.vel.y += BOOST_Y;
            }

            if (game.sequencer.isPressed("BOOST_RIGHT")) {
                self.vel.x += BOOST_X;
            }

            if (game.sequencer.isPressed("BOOST_LEFT")) {
                self.vel.x += -BOOST_X;
            }

            if (C.inputter.isDown(C.inputter.D) && C.inputter.isDown(C.inputter.A)) {
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
            }

      ///   if (!C.inputter.isDown(C.inputter.D) && C.inputter.isDown(C.inputter.A)) {
      ///       self.state.facing = facing.LEFT;
      ///   } else if (!C.inputter.isDown(C.inputter.A) && C.inputter.isDown(C.inputter.D)) {
      ///       self.state.facing = facing.RIGHT;
      ///   } 

            if (C.inputter.isDown(C.inputter.W)) {
                // Falling or not in air
                if (self.vel.y >= 0 && self.resources.hover > 0) { 
                    self.resources.hover -= 1.5;
                    self.vel.y = -0.2;
                }
            } else {

                // Recharge hover
                self.resources.hover = Math.min(HOVER, self.resources.hover + HOVER_INCREMENT);
            }

            if (C.inputter.isPressed(C.inputter.J)) {
                self.state.action = actions.MELEE;
            } else if (C.inputter.isPressed(C.inputter.K)) {
                self.state.action = actions.BLIP;
            } else if (C.inputter.isPressed(C.inputter.L)) {
                self.state.action = actions.RANGE;
            }

        }

        function setState() {
          //var isBOOST_UP    = self.vel.y < -WALK_X
          //  , isBOOST_DOWN  = self.vel.y > WALK_X
          //  , isBOOST_RIGHT = self.vel.x > WALK_X
          //  , isBOOST_LEFT  = self.vel.x < -WALK_X
          //  , isHOVER       = self.vel.y < 0 && !isBOOST_UP
          //  , isCROUCH      = false//self.center.y < self.height/2
          //  , isWALK_RIGHT  = self.vel.x <= WALK_X && self.vel.x > 0 && !isBOOST_LEFT
          //  , isWALK_LEFT   = self.vel.x >= -WALK_X && self.vel.x < 0 && !isBOOST_RIGHT
          //  , isSTAND       = self.vel.x === 0 && self.vel.y === 0
          //  , isFALLING     = false//self.vel.y <= 0 && self.center.y > self.size.height/2;
          //  , isFACING_LEFT = C.inputter.isDown(C.inputter.A) || self.state.facing === facing.LEFT;

            if (self.vel.x > 0) {self.state.facing = facing.RIGHT;}   
            else                {self.state.facing = facing.LEFT;}
            self.state.motion = motions.WALK;
        }
    }

})(this);
