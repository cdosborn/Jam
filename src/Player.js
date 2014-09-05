var FRIC,GRAV, BOOST_X, BOOST_Y;
FRIC = 2;
GRAV = 0.8;
BOOST_X = 25;
BOOST_Y = 20;
;(function(exports) {
    exports.Player = function(game, settings) {
        var self = this;
        for (var i in settings) {
          this[i] = settings[i];
        }

        // Enumerate state
        var motions = { WALK_LEFT: 0
                      , WALK_RIGHT: 1
                      , CROUCH: 2
                      , HOVER: 3
                      , BOOST_LEFT: 4
                      , BOOST_RIGHT: 5
                      , BOOST_UP: 6
                      , BOOST_DOWN: 7
                      , STAND: 8 
                      , FALLING: 9 }

        var actions = { BLIP: 0
                      , MELEE: 1
                      , RANGE: 2 
                      , PASSIVE: 3 }

        var directions = { UP: 0
                         , DOWN: 1
                         , LEFT: 2
                         , RIGHT: 3 }

        var combos = { BOOST_RIGHT      : 0
                     , BOOST_LEFT       : 1
                     , BOOST_UP         : 2
                     , BOOST_DOWN       : 3
                     , BLIP             : 4 } 

        //speed,range,damage

        // Initialize state
        this.action = actions.PASSIVE;
        this.motion = motions.STAND;
        this.health = 100;
        this.vel = { x:0, y:0 }
        this.size = { x:60, y:120 };
        this.center = { x:10, y:110 };
        this.color="#f07";

//      C.inputter.bindKey("W", function() {
//          this.motion = motion. 
//      }) 
        C.inputter.bindSequence(combos.BOOST_UP, [C.inputter.W, -C.inputter.W, C.inputter.W], function() {
            self.motion = motions.BOOST_UP
        }); 
        C.inputter.bindSequence(combos.BOOST_DOWN, [C.inputter.S, -C.inputter.S, C.inputter.S], function() { 
            self.motion = motions.BOOST_LEFT; 
        }); 
        C.inputter.bindSequence(combos.BOOST_RIGHT, [C.inputter.D, -C.inputter.D, C.inputter.D], function() { 
            self.motion = motions.BOOST_RIGHT; 
        }); 
        C.inputter.bindSequence(combos.BOOST_LEFT, [C.inputter.A, -C.inputter.A, C.inputter.A], function() { 
            self.motion = motions.BOOST_LEFT;
        }); 
        C.inputter.bindSequence(combos.BLIP, [C.inputter.H], function() { 
            self.action = motions.BLIP; 
             console.log("BLIP");
        }); 

        function reduce (n, x) {
            var pos, sign, result;
            pos = Math.abs(n); 
            sign = n > 0 ? 1 : -1;
            if (x > pos) {
                result = 0;
            } else {
                result = (pos - x) * sign
            }
            return result;
        }

        this.update = function(delta) {

            if (this.motion === motions.BOOST_UP) {
                this.vel.y = -BOOST_Y;
            }
            if (this.motion === motions.BOOST_DOWN) {
                this.vel.y = BOOST_Y;
            }
            if (this.motion === motions.BOOST_RIGHT) {
                this.vel.x = BOOST_X;
            }
            if (this.motion === motions.BOOST_LEFT) {
                this.vel.x = -BOOST_X;
            }

            //if (this.motion === motions.WALKING) {
            //    this.speed.x = Math.max(1, this.speed.x);
            //    this.dir.y = 0;
            //} else  {
            //    this.speed.x = Math.max(0, this.speed.x);
            //}

            this.center.y += this.vel.y
            this.center.x += this.vel.x

            //console.log(this.speed.x);
            this.vel.x = reduce(this.vel.x, FRIC);

            this.vel.y = (Math.abs(this.vel.x) > 0) ? 0 : this.vel.y + GRAV;
            this.motion = motions.STAND;
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
