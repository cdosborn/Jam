var durp;
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
            this.timestamp = game.totalTime;
        } 
    }; 

    var ButtonSequencer = function(game) {
        var that = this,
            C = game.c;
            sequences = {};
            inbetweenTime = 200;

        return {
            update: function(interval, events) {
                this.reset();
                events.filter(function(e) { return e.type === "keydown" || e.type === "keyup"; })
                      .map(function(e) { return e.type === "keydown" ? e.keyCode : -e.keyCode;})
                      .map(this.updateSequences)
            },

            updateSequences: function(button) {
                for (var i in sequences) {
                    var seq = sequences[i];

                // Might be an unecessary check
                // to see if instanceof

                    if (seq instanceof Sequence) {
                        if (game.totalTime - seq.timestamp > inbetweenTime) { // not updated recently
                           seq.reset();
                        } 

                        if (seq.check(button)) {
                            seq.next();
                        }
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
