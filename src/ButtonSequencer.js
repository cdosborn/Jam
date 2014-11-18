;(function(exports) { 
    var Sequence = function(buttons) { 
        this.timestamp = 0; 
        this.buttons = buttons; 
        this.sucess = false; 
        this.index = 0;
    } 

    Sequence.prototype = { 
        check: function (button) { 
            return this.buttons[this.index] === button; 
        }, 
        next: function () { 
            this.sucess = this.index === this.buttons.length - 1; 
            this.index = (this.index + 1) % (this.buttons.length); 
            this.stamp(); 
        }, 
        reset: function() { 
            this.index = 0; this.stamp(); 
        },
        stamp: function() { 
            this.timestamp = game.timer.getTime();
        } 
    }; 

    var ButtonSequencer = function(game) {
        var that = this,
            C = game.c;
            sequences = {};
            inBetweenTime = 200;

        return {
            update: function(interval, events) {

            // Calling this.reset() is the proper way to reset all
            // successful sequences, but it occurs after every tick
            // A more efficient approach is to set seq.success = false
            // in isPressed method, when success is true

                this.reset();
                events.filter(function(e) { return e.type === "keydown" || e.type === "keyup"; })
                      .map(function(e) { return e.type === "keydown" ? e.keyCode : -e.keyCode;})
                      .map(this.updateSequences)
            },

            updateSequences: function(button) {
                for (var name in sequences) {
                    var seq = sequences[name];

                    if (game.timer.getTime() - seq.timestamp > inBetweenTime) { // not updated recently
                       seq.reset();
                    } 

                    if (seq.check(button)) {
                        seq.next();
                    }
                }
            },

        // doesn't make sense to have these methods separated
        // currently they cannot be called independently
        // there is a specific order
          
            bind: function(name, buttons) {
                sequences[name] = new Sequence(buttons);
            }, 

            isPressed: function(name) {
                return sequences[name].sucess;
            },

            reset: function() {
                for (var i in sequences) {
                    sequences[i].sucess = false;
                }
            }
        }
    }
    exports.ButtonSequencer = ButtonSequencer;
    exports.Sequence = Sequence;
})(this);
