;(function(exports) {

    // vars
    // 
    // methods 
    //
    // *optional*
    // 
    // 
    // 

    Timer = function(obj, settings) {

        var cb, timeLeft, active;
        
        return { 
            after: function(ms, callback) {
                cb = callback;
                timeLeft = ms;
                active = true;
            },
            update: function(delta) {
                if (active) {
                    timeLeft -= delta;
                    if (timeLeft <= 0) {
                          
                        // The callback may make additional
                        // after() calls resetting cb, active
                        // thus active must be set to false
                        // before cb().
                          
                        active = false;
                        cb();
                    }
                }
            }
        }
    }

    exports.Timer = Timer;
})(this);
