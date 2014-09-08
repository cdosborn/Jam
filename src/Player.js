var FRIC,GRAV, BOOST_X, BOOST_Y;
FRIC = 0.5;
GRAV = 0.5;
BOOST_X = 20;
BOOST_Y = 15;
WALK_X = 5;
;(function(exports) {
    exports.Player = function(game, settings) {
        var self = this,
            C = game.c;
        for (var i in settings) {
          this[i] = settings[i];
        }

        // Enumerate state
        var motions = { WALK_LEFT: 0
                      , WALK_RIGHT: 1
                      , CROUCH: 2
                      , HOVER: 3
                      , FALLING: 4 
                      , BOOST_LEFT: 5
                      , BOOST_RIGHT: 6
                      , BOOST_UP: 7
                      , BOOST_DOWN: 8
                      , STAND: 9 
                      }

        var actions = { BLIP: 0
                      , MELEE: 1
                      , RANGE: 2 
                      , PASSIVE: 3 }

        //speed,range,damage

        this.state = { action: actions.PASSIVE
                     , motion: motions.STAND } 

        this.health = 100;
        this.resources = { boost:  100
                         , hover:  50
                         , health: 100 }
                            
        this.vel = { x:0, y:0 }
        this.size = { x:30, y:100 };
        this.center = { x:10, y:110 };
        this.color="#f07"; 

        game.sequencer.bind("BOOST_UP", [C.inputter.W, -C.inputter.W, C.inputter.W]);
        game.sequencer.bind("BOOST_DOWN", [C.inputter.S, -C.inputter.S, C.inputter.S]);
        game.sequencer.bind("BOOST_RIGHT", [C.inputter.D, -C.inputter.D, C.inputter.D]); 
        game.sequencer.bind("BOOST_LEFT", [C.inputter.A, -C.inputter.A, C.inputter.A]);
        
        // reduce ought to be moved to a utils file

        function reduce (n, x) {
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

        this.update = function(delta) {
            //console.log(this.motion === motions.BOOST_RIGHT ? "BOOST" : (this.motion === motions.WALK_RIGHT ? "WALK" : ""));

            if (game.sequencer.isPressed("BOOST_UP")) {
                this.state.motion = motions.BOOST_UP;
                this.vel.y += -BOOST_Y;
            }

            if (game.sequencer.isPressed("BOOST_DOWN")) {
                this.state.motion = motions.BOOST_DOWN;
                this.vel.y += BOOST_Y;
            }

            if (game.sequencer.isPressed("BOOST_RIGHT")) {
                this.state.motion = motions.BOOST_RIGHT;
                this.vel.x += BOOST_X
            }

            if (game.sequencer.isPressed("BOOST_LEFT")) {
                this.state.motion = motions.BOOST_LEFT;
                this.vel.x += -BOOST_X
            }

            if (C.inputter.isDown(C.inputter.D)) {
                if (self.vel.x > 0) {
                    self.vel.x = Math.max(WALK_X, self.vel.x);
                } else {
                    self.vel.x = WALK_X;
                }
            }

            if (C.inputter.isDown(C.inputter.A)) {
                if (self.vel.x < 0) {
                    self.vel.x = Math.min(-WALK_X, self.vel.x);
                } else {
                    self.vel.x = -WALK_X;
                }        
            }


            if (C.inputter.isDown(C.inputter.W)) {
//                  console.log(this.vel.y);
//                  console.log(this.resources.hover);
                if (this.vel.y >= 0 && this.resources.hover > 0) { // Falling or not in air
                    self.resources.hover -= 1.5;
                    self.vel.y = -0.2;
                }
                //console.log(this.resources.hover);
            } else {
                this.resources.hover = Math.min(50, this.resources.hover + 0.5);
            }

            //this.center.y = Math.min(280, this.center.y + this.vel.y);
            this.center.y += this.vel.y
            this.center.x += this.vel.x

            self.vel.y += GRAV;
            
            if (Math.abs(this.vel.x) > 10) {
                this.vel.x = reduce(this.vel.x, FRIC * 2);
                this.vel.y = 0;
            } else {
                this.vel.x = reduce(this.vel.x, FRIC);
            }

         // if (Math.abs(this.vel.y) > 1) { // Ascending / Descending
         //     this.vel.y = reduce(this.vel.y, GRAV);
         //     //console.log(this.vel.y);
         // }

///         console.log(this.resources.hover);

       ///  if (Math.abs(this.vel.x) <= 5) {
       ///      if (this.vel.x < 0)
       ///          this.state.motion = motions.WALK_LEFT;
       ///      else 
       ///          this.state.motions = motions.WALK_RIGHT;
       ///  } else {
       ///  }


            //console.log(this.vel.x);
///         if (!C.inputter.isDown(C.inputter.W)) { // if 
///             this.vel.y = (Math.abs(this.vel.x) > 5) ? 0 : this.vel.y + GRAV;
///         }
        }; 

        this.collision= function(other, type) { 
            var type = other.__proto__.constructor;
            if (type === Platform) {
                self.vel.y = 0;
                self.center.y = other.center.y - other.size.y/2 - self.size.y/2
            }
        }
        this.boundingBox = C.collider.RECTANGLE;

        this.draw = function(ctx) { 
            ctx.fillStyle = self.color;
            ctx.fillRect(this.center.x - this.size.x / 2,
                         this.center.y - this.size.y / 2,
                         this.size.x,
                         this.size.y);
        }; 
    };

})(this);
