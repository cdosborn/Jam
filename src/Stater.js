;(function(exports) {

    TimerLocal = function() {
        var time = 0;
        return {
            update: function(delta) { time += delta; },
            getTime: function() { return time; },
            add: function(timer) { time += timer.getTime()},
            reset: function() { time = 0; }
        }
    }

    State = function(parent, name, obj) {
        var self = this;

        var doNothing = function(){};
        if (obj.init === undefined) { obj.init = doNothing; }
        if (obj.update === undefined) { obj.update = doNothing; }
        if (obj.after === undefined) { obj.after = doNothing; }
        if (obj.transition !== undefined) { 
            this.transition = function(name) {
                return obj.transition(name, self.timer.getTime()); 
            }
        }

        this.timer = TimerLocal();
        this.parent = parent;
        this.name = name;
        this.children = obj.children;
        this.init = obj.init;
        this.active = function() { return obj.active(self.timer.getTime()); };
        this.after = function() { return obj.after(self.timer.getTime()); };
        this.reset = function() { self.timer.reset(); };
        this.update = function(delta) {
            self.timer.update(delta);
            obj.update(self.timer.getTime());
        };
    }


    Stater = function(obj) {
        var cur = new State(obj, "root", obj);

        cur.init();

        var toParent = function() {
            var parent = cur.parent; 
            parent.timer.add(cur.timer);
            cur.after();
            cur.reset();
            return parent;
        }

        return {
            update: function(delta) { 
                if (!cur.active()) {
                    cur = toParent();
                    this.update(delta);
                } else {
                    cur.update(delta);
                }
            },

            emit: function(state) {
                var filtered = (cur.transition !== undefined ? cur.transition(state) : state);
                var child, children;

                children = cur.children;
                for (var name in children) {
                    child = children[name];
                    if (name === filtered && children.hasOwnProperty(filtered)) {
                        cur = (child instanceof State ? child : new State(cur, name, child));
                        cur.init();
                        return true;
                    } 
                }
                return false;
            }
        }
    }

    exports.Stater = Stater;

})(this);
