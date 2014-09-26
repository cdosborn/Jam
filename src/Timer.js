;(function(exports) {

    var Timer = function(obj, settings) {

        var cb, timeUntil, active, type;

        function create(time, callback, t) {
            active = true;
            cb = callback;
            timeUntil = time;
            type = t;
        }

        types = { DELAY: 0
                , DURING: 1 }
        
        return { 
            after: function(ms, callback) {
                create(ms, callback, types.DELAY);
            },
            for: function(ms, callback) {
                create(ms, callback, types.DURING);
            },
            update: function(delta) {
                if (active) {
                    timeUntil -= delta;
                    if (type === types.DELAY && timeUntil <= 0) {
                            // The callback may make additional
                            // after() calls resetting cb, active
                            // thus active must be set to false
                            // before cb().
                              
                        active = false;
                        cb();
                    } else if (type === types.DURING) {
                        if (timeUntil > 0) {
                            cb(); 
                        } else {
                            active = false
                        }
                    }
                }
            }
        }
    }

    exports.Timer = Timer;
})(this);
