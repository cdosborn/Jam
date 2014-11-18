;(function(exports) {

    Scene = function(game, obj) {
        var self = this;
        var timer = Timer();

        var doNothing = function() {};
        var getTrue = function() { return true; };

        var funs = ["init", "active", "update", "exit"];

        // bind funs if they exist to scene
        funs.forEach(function(fun) {
            if (obj[fun] !== undefined) {
                self[fun] = obj[fun].bind(null, game, timer.getTime());
            } else if (fun === "active") {
                self[fun] = getTrue;
            } else {
                self[fun] = doNothing;
            }
        });

        this.timer = timer;
    };

    var paused = false;

    Scener = function(game, arr) {
        var scenes = {};
        var cur;

        // construct from json obj
        (function() { 
            var i, obj,
            len = arr.length;
            for (i = 0; i < len; i++) {
                obj = arr[i];
                scenes[obj.name] = new Scene(game, obj);
            };
        })()

        this.start = function(name) {
            cur = scenes[name];
            cur.init();
        };

        this.update = function(delta) {
            if (!paused) {
                cur.timer.add(delta);
                if (cur.active()){
                    cur.update(delta);
                } else {
                    game.c.entities.destroyAll();
                    cur.exit();
                }
            } 

        };

        this.pause = function() {
            paused = true;
        };

        this.unPause = function() {
            paused = false;
        };

        this.isPaused = function() {
            return paused;
        }
    }

    exports.Scener = Scener;

})(this);
