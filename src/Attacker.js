;(function(exports) {

    var Timer = function() {
        var time = 0;
        return {
            add: function(delta) { time += delta; },
            getTime: function() { return time; },
            reset: function() { time = 0; }
        }
    }

    var Attack = function(game, obj) {
        var timer = Timer();
        var duration = obj.duration;
        var damage = obj.damage;

        var init = function() { 
            obj.init.call(this) 
        }

        var update = function(delta) { 
            timer.add(delta);
            if (active()) { // if active last tick
                obj.update.call(this, timer.getTime()); 
            } else {
                game.c.entities.destroy(this);
            }
        };

        var active = function() { 
            return timer.getTime() <= duration;
        };

        var draw = function(ctx) {
            ctx.fillStyle = "#fff";
            ctx.strokeRect(this.center.x - this.size.x/2
                         , this.center.y - this.size.y/2
                         , this.size.x
                         , this.size.y);
        }


        var doNothing = function(){};

        this.boundingBox = game.c.collider.RECTANGLE;
        this.damage = damage;
        this.duration = duration;
        this.center = {x:0,y:0};
        this.size = {x:0,y:0};
        this.update = update;
        this.active = active;
        this.init = (obj.init ? init : doNothing);
        //this.draw = draw;
    }


    var Attacker = function(game) {
        var objs = {};
        var lookup = {};

        var register = function(name, obj) {
            objs[name] = obj;
        }

        var trigger = function(name) {
            if (lookup[name]) { 
                game.c.entities.destroy(lookup[name]);
            }
            lookup[name] = game.c.entities.create(Attack, objs[name]);
            lookup[name].init();
        }

        return {
            trigger: trigger,
            register: register,
        }
    }

    exports.Attacker = Attacker;

})(this);
