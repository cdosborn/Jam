var FRIC = 0.5,
    GRAV = 0.5,
    BOOST_X = 20,
    BOOST_Y = 15,
    HOVER = 100,
    HOVER_INCREMENT = 1,
    DIV = 15,
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

        var directions = { LEFT: 0
                         , RIGHT: 1 }

        var actions = { BLIP: 0
                      , MELEE: 1
                      , RANGE: 2 
                      , PASSIVE: 3 }

        this.state = { action: actions.PASSIVE
                     , motion: motions.STAND 
                     , dir:    directions.RIGHT } 

        this.resources = { boost:  100
                         , hover:  HOVER
                         , health: 100 }

        this.vel = { x:0, y:0 }

        this.animator = Animator(this);

//////  this.animator.register(
//////          "meleeRight",
//////          Animation(self, {   
//////              img        : game.images['dinosaur_melee'],
//////              frames     : [11,12,13,14,15,16,17,18,19,20,21],
//////              fps        : 10
//////              cast       : 3,
//////              exit       : 10
//////          });

//////  var meleeLeft = Animation(
//////              this, 
//////              game.images['dinosaur_melee'], 
//////              [0,1,2,3,4,5,6,7,8,9,10], 
//////              2, 
//////              3, 
//////              10 ); 

        this.anims = {};
        this.animDict = ["walkLeft", "walkRight", "standRight", "standLeft"];
        this.anims["meleeRight"] = Animation(this, {
            img: game.images['dinosaur_melee'], 
            frames: [11,12,13,14,15,16,17,18,19,20,21], 
            fps: 10,
            cast: 3, 
            exit: 10
        });

        this.anims["meleeLeft"]  = Animation(this, {
            img: game.images['dinosaur_melee'], 
            frames: [0,1,2,3,4,5,6,7,8,9,10],   
            cast: 3, 
            exit: 10
        }); 
  
        this.anims["walkRight"]   = Animation(this, { 
            img: game.images['dinosaur_walk'],  
            frames: [6,7,8,9,10,11]   
        }); 
        this.anims["walkLeft"]  = Animation(this, { 
            img: game.images['dinosaur_walk'],  
            frames: [0,1,2,3,4,5]
        });
        this.anims["standRight"] = Animation(this, { 
            img: game.images['dinosaur_stand'], 
            frames: [6,7,8,9,10,11]
        });
        this.anims["standLeft"]  = Animation(this, { 
            img: game.images['dinosaur_stand'], 
            frames: [0,1,2,3,4,5]
        });

        game.sequencer.bind("BOOST_UP", [C.inputter.W, -C.inputter.W, C.inputter.W]);
        game.sequencer.bind("BOOST_DOWN", [C.inputter.S, -C.inputter.S, C.inputter.S]);
        game.sequencer.bind("BOOST_RIGHT", [C.inputter.D, -C.inputter.D, C.inputter.D]); 
        game.sequencer.bind("BOOST_LEFT", [C.inputter.A, -C.inputter.A, C.inputter.A]);
        
        this.update = function(delta) {

            this.interval = delta;
            //console.log(this.state.dir);

            if (game.sequencer.isPressed("BOOST_UP")) {
                this.vel.y += -BOOST_Y;
            }

            if (game.sequencer.isPressed("BOOST_DOWN")) {
                this.vel.y += BOOST_Y;
            }

            if (game.sequencer.isPressed("BOOST_RIGHT")) {
                this.vel.x += BOOST_X;
            }

            if (game.sequencer.isPressed("BOOST_LEFT")) {
                this.vel.x += -BOOST_X;
            }

            if (C.inputter.isDown(C.inputter.D) && C.inputter.isDown(C.inputter.A)) {
                if (self.state.dir === directions.RIGHT) {
                    self.vel.x = Math.max(WALK_X, self.vel.x);
                } else {
                    self.vel.x = Math.min(-WALK_X, self.vel.x);
                }
            } else if (C.inputter.isDown(C.inputter.D)) {
                if (self.vel.x > 0) {
                    self.vel.x = Math.max(WALK_X, self.vel.x);
                } else {
                    self.vel.x = WALK_X;
                }
            } else if (C.inputter.isDown(C.inputter.A)) {
                if (self.vel.x < 0) {
                    self.vel.x = Math.min(-WALK_X, self.vel.x);
                } else {
                    self.vel.x = -WALK_X;
                }        
            }

            if (!C.inputter.isDown(C.inputter.D) && C.inputter.isDown(C.inputter.A)) {
                this.state.dir = directions.LEFT
            } else if (!C.inputter.isDown(C.inputter.A) && C.inputter.isDown(C.inputter.D)) {
                this.state.dir = directions.RIGHT;
            } 

            if (C.inputter.isDown(C.inputter.W)) {
                if (this.vel.y >= 0 && this.resources.hover > 0) { // Falling or not in air
                    self.resources.hover -= 1.5;
                    self.vel.y = -0.2;
                }
            } else {

                // Recharge hover
                this.resources.hover = Math.min(HOVER, this.resources.hover + HOVER_INCREMENT);
            }

            var dirWord = this.state.dir == directions.RIGHT ? "RIGHT" : "LEFT";
            if (C.inputter.isPressed(C.inputter.J)) {
                this.state.action = actions.MELEE;
                console.log("MELEE " + dirWord);
            }
            if (C.inputter.isPressed(C.inputter.K)) {
                this.state.action = actions.BLIP;
                console.log("PHASE ");
            }
            if (C.inputter.isPressed(C.inputter.L)) {
                this.state.action = actions.RANGE;
                 console.log("RANGE " + dirWord);
            }
           

            this.center.y += (this.vel.y * delta/DIV)
            this.center.x += (this.vel.x * delta/DIV)

            var isBOOST_UP    = this.vel.y < -WALK_X,
                isBOOST_DOWN  = this.vel.y > WALK_X,
                isBOOST_RIGHT = this.vel.x > WALK_X,
                isBOOST_LEFT  = this.vel.x < -WALK_X,
                isHOVER       = this.vel.y < 0 && !isBOOST_UP,
                isCROUCH      = false//this.center.y < this.height/2
                isWALK_RIGHT  = this.vel.x <= WALK_X && this.vel.x > 0 && !isBOOST_LEFT,
                isWALK_LEFT   = this.vel.x >= -WALK_X && this.vel.x < 0 && !isBOOST_RIGHT,
                isSTAND       = this.vel.x === 0 && this.vel.y === 0,
                isFALLING     = false//this.vel.y <= 0 && this.center.y > this.size.height/2;
                isFACING_LEFT = C.inputter.isDown(C.inputter.A) || this.state.dir === directions.LEFT;

            // Set states

            if (isBOOST_UP)    {this.state.motion = motions.BOOST_UP}   
            else if (isBOOST_DOWN)  {this.state.motion = motions.BOOST_DOWN}
            else if (isBOOST_RIGHT) {this.state.motion = motions.BOOST_RIGHT}
            else if (isBOOST_LEFT)  {this.state.motion = motions.BOOST_LEFT} 
            else if (isHOVER)       {this.state.motion = motions.HOVER}      
            else if (isCROUCH)      {this.state.motion = motions.CROUCH}     
            else if (isWALK_RIGHT)  {this.state.motion = motions.WALK} 
            else if (isWALK_LEFT)   {this.state.motion = motions.WALK}  
            else if (isSTAND)       {this.state.motion = motions.STAND}      

            //if(isBOOST_RIGHT) {console.log("BOOST_RIGHT");}
              
            // SET FOR NEXT TICK

            self.vel.y += GRAV * delta/DIV;
            
            if (Math.abs(this.vel.x) > WALK_X) {
                this.vel.x = reduce(this.vel.x, FRIC * delta/DIV);
                this.vel.y = 0;
            } else {
                this.vel.x = reduce(this.vel.x, FRIC * delta/DIV);
            }


        }; 

        this.collision = function(other, type) { 
            var type = other.__proto__.constructor;
            if (type === Platform) {
                self.vel.y = 0;
                self.center.y = other.center.y - other.size.y/2 - self.size.y/2
            }
        }
        this.boundingBox = C.collider.RECTANGLE;

        this.draw = function(ctx) { 

            if (this.state.motion === motions.WALK && this.state.dir === directions.RIGHT) {
                this.anim = this.anims["walkRight"];
            } else if (this.state.motion === motions.WALK && this.state.dir === directions.LEFT) {
                this.anim = this.anims["walkLeft"]
            } else if (this.state.action === actions.MELEE) {
                if (this.state.dir === directions.RIGHT) {
                    this.anim = this.anims["meleeRight"]
                } else {
                    this.anim = this.anims["meleeLeft"]
                }
            } else if (this.state.dir === directions.RIGHT) {
                this.anim = this.anims["standRight"]
            } else { // STAND LEFT
                this.anim = this.anims["standLeft"]
            }

            //console.log(this.state.dir);

            this.anim.draw(ctx);
            this.anim.next(this.interval);

            var next;
            var name;
            for (var i = 0, len = this.animDict.length; i < len; i++) {
               name = this.animDict[i];
               next = this.anims[name]; 
               if (this.anim !== next) {
                   next.reset();
               }
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


    };

})(this);
