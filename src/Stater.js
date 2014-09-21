;(function(exports) {
    Stater = function(obj) {
        var cur = root = new State(obj, "root", obj);

        return {
            update: function(delta) { 
                if (!cur.active()) {
                    cur = cur.parent;
                    cur.init();
                }
                cur.update();
            },
            emit: function(name) {
                var child, children = cur.children;
                if (children !== undefined) {
                    for (var i in children) {
                        if (children.hasOwnProperty(i) && i === name) {
                            child = cur.children[i];
                            cur = (child instanceof State ? child : State(cur, name, child));
                            cur.init();
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }

    State = function(parent, name, obj) {
        var timer = Timer();

        this.parent = parent;
        this.name = name;
        this.children = obj.children;
        this.active = function() { return obj.active(timer.getTime()); };
        this.reset = function() { timer.reset(); };
        this.update = function(delta) {
            timer.update(delta);
            obj.update(timer.getTime());
        };
    }

    Timer = function() {
        var time = 0;
        return {
            update: function(delta) { time += delta; },
            getTime: function() { return time; },
            reset: function() { time = 0; }
        }
    }

    var example = Stater({
        active: function(time) { return true; },
        update: function() { console.log("..."); },
        children: {}
    });

    //exports.Stater = Stater;
    module.exports = example;

})(this);
