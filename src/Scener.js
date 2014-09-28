;(function(exports) {

    Scene = function(game) {
        var actors = [];
        return {
            init: function() {
            }
            start: function() {
            },
            update: function() {
            },
            exit: function() {
            }
        }
    }

    Scener = function() {
        var paused = false;
        var scenes = {};
        var cur; 

        return { 
            register: function(name, scene) {
                scenes[name] = scene;
            }, 
            update: function(delta) { 
                curScene.update(delta);
                curScene.draw();
            },
            pause: function() {
                paused = true;
            },
            unpause: function() {
                paused = false;
            },
            transition: function(name) {
                if (cur !== undefined) {
                    cur.exit();
                }
                cur = scenes[name];
                cur.init();
                cur.start();
            },
        }
    }

    exports.Scene = Scene;
    exports.Scener = Scener;

})(this);
