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

        this.resources = { health: 100 }

        this.vel = { x:0, y:0 }

        this.anims = {};
        
        this.update = function(delta) {

            this.interval = delta;

            var diff = Math.abs(this.target.center.x - this.center.x);
            if ( diff > 120 ) { 
                if (this.target.center.x > this.center.x) {
                    this.vel.x = 2;
                } else {
                    this.vel.x = -2;
                }
            }/* else if (diff < 100) {
                if (this.target.center.x > this.center.x) {
                    this.vel.x = -4;
                } else {
                    this.vel.x = 4;
                } 
            } */else {
                this.vel.x = 0;
            }

            setState();

            this.center.y += this.vel.y * delta/DIV
            this.center.x += this.vel.x * delta/DIV

            // Gravity
            this.vel.y += GRAV * delta/DIV;

            if (this.center.y > 1000) { self.respawn() };
        }; 

        this.stateToString = function() {
            var health = this.resources.health;
            var motionId = this.state.motion;
            var actionId = this.state.action;
            var facingId = this.state.facing;
            var motion, action, dir, health;

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

            return [health, motion, action, dir];
        }

        this.collision = function(other) { 
            var type = other.constructor;
            if (type === Platform) {
                self.vel.y = 0;
                self.center.y = other.center.y - other.size.y/2 - self.size.y/2
            } else if (type === Player || type === Enemy) {
                //console.log(other);
            } else {
                self.color = "#c00";
                self.resources.health -= 10;
                if (self.resources.health <= 0) {
                    self.respawn();
                }
            }
        }
        this.boundingBox = C.collider.RECTANGLE;

        this.respawn = function() {
            game.c.entities.destroy(self);
            game.c.entities.create(Enemy, { 
                center: {x: self.spawnPoint.x, y: self.spawnPoint.y},
                size:   { x:60, y:100 },
                spawnPoint: self.spawnPoint
            });
        }

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

            ctx.fillStyle = this.color;
            ctx.fillRect(this.center.x - this.size.x/2,this.center.y - this.size.y/2,this.size.x,this.size.y);
            this.color = "#fff";
            ctx.fillStyle = "#000";

            var x = this.center.x - this.size.x/2;
            var y = this.center.y;
            var w = this.size.x;
            ctx.fillText(this.stateToString()[0], x, y, w);
            ctx.fillText(this.stateToString()[1], x, y + 10, w);
            ctx.fillText(this.stateToString()[2], x, y + 20, w);
            ctx.fillText(this.stateToString()[3], x, y + 30, w);

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

        function setState() {
            if (self.vel.x > 0) {self.state.facing = facing.RIGHT;}   
            else                {self.state.facing = facing.LEFT;}
            self.state.motion = motions.WALK;
        }
    }

})(this);
