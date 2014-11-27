;(function(exports) {

    var Scene = function(game, obj) {
        var self = this;
        var timer = Timer();

        var doNothing = function() {};
        var getTrue = function() { return true; };

        ["init", "active", "update", "exit"].forEach(function(fun) {
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


    var Scener = function(game, arr) {
        var scenes, paused, cur, obj, len, i;
        paused = false;
        scenes = {};

        // construct from json obj
        len = arr.length;
        for (i = 0; i < len; i++) {
            obj = arr[i];
            scenes[obj.name] = new Scene(game, obj);
        };

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
