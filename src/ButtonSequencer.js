;(function(exports) {
    ButtonSequencer = function() {
        var that = this;
        var sequences = [];

        return {
            update: function(interval, button) {
                var success = false;
                for (var i = 0; i < sequences.length; i++) {
                    var seq = sequences[i];

                    if (C.ticker.clock - seq.timestamp > 150) { // not updated recently
                       seq.reset();
                    } 

                    if (seq.check(button)) {
                        success = seq.next();
                    }
                }
                return success; //The update notifies the caller when seq was completed
            },

        // doesn't make sense to have these methods separated
        // currently they cannot be called independently
        // there is a specific order
          
            bind: function(id, buttons, cb) {
                sequences[id] = {
                    timestamp: 0,
                    buttons: buttons,
                    id: id,
                    index: 0,
                    check: function (button) {
                        return this.buttons[this.index] === button;
                    },
                    next: function () {
                        var success = this.index === this.buttons.length - 1;
                        success ? cb() : undefined; // optionally call the callback
                        this.index = (this.index + 1) % (buttons.length);
                        this.stamp();
                        return success; // returns whether next completed a sequence
                    },
                    reset: function() {
                        this.index = 0;
                        this.stamp();
                    },
                    stamp: function() {
                        this.timestamp = C.ticker.clock;
                    }
                } 
            } 
        }
    }
    exports.ButtonSequencer = ButtonSequencer;
})(this);
