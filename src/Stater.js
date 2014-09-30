;(function(exports) {

    var Timer = function() {
        var time = 0;
        return {
            add: function(delta) { time += delta; },
            getTime: function() { return time; },
            reset: function() { time = 0; }
        }
    }

    var State = function(parent, name, obj) {
        var duration = obj.duration;
        var timer    = Timer();

        var doNothing = function(){};
        var returnTrue = function(){ return true; };

        var update =     function() { obj.update.call(null, timer.getTime()); };
        var init =       function() { obj.init.call(null); };
        var active =     function() { return obj.active.call(null, timer.getTime()); };
        var transition = function() { obj.transition.call(null, timer.getTime());}
        var finished = function() { 
            return (duration !== undefined) && (timer.getTime() >= duration);
        };

        return {
            name:       name,
            timer:      timer,
            parent:     parent,
            children:   obj.children,
            transition: obj.transition === undefined ? null   : transition,
            update:     obj.update     === undefined ? doNothing  : update,
            init:       obj.init       === undefined ? doNothing  : init,
            active:     obj.active     === undefined ? returnTrue : active, 
            finished:   finished,
        }
    }


    var Stater = function(obj) {
        var cur;

        // transform obj into nested state objs
        (function(object) {
            var build = function(parent, name, node) {
                var state = new State(parent, name, node);

                var children = state.children;
                for (var name in children) {
                    if (state.children.hasOwnProperty(name)) {
                        state.children[name] = build(state, name, state.children[name]);
                    }
                }
                return state;
            }

            cur = build(cur, "root", object);
            cur.init();
        })(obj)


        var checkCur = function() {
            var timeOver = cur.finished();
            var active = cur.active();

            if (cur.finished() || !active) { 
                if (cur.transition) {
                    cur.transition();
                    cur.init();
                } else {
                    toParent();
                }
            }
        }

        var toParent = function() {
            cur.parent.timer.add(cur.timer.getTime());
            cur.timer.reset();
            cur = cur.parent;
        }

        var toChild = function(name, delta) {
            var child;
            if (cur.children && cur.children[name]) {
                child = cur.children[name];
                if (delta !== undefined) {
                    child.timer.add(delta);
                }
                cur = child;
            }
        }

        return {
            toParent: toParent,
            toChild: toChild,
            toSibling: function(name, delta) { 
                toParent();
                if (delta) { toChild(name, delta); }
                else {       toChild(name) };
            },
            getPath: function() {
                var getPathHelper = function(node) {
                    if (node.name === "root") {
                        return ["root"];
                    }
                    var names = getPathHelper(node.parent);
                    names.push(node.name);
                    return names;
                }

                return getPathHelper(cur);
            },
            update: function(delta) { 
                cur.timer.add(delta);
                checkCur();
                cur.update();
            },

            emit: function(state) { 
                if (cur.children && cur.children.hasOwnProperty(state)) { 
                    this.toChild(state);
                    cur.init();
                }
            }
        }
    }

    exports.Stater = Stater;

})(this);
