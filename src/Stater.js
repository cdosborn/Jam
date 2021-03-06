;(function(exports) {
    var State = function(parent, name, obj) {
        var timer    = Timer();

        var duration = obj.duration;
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


    var Stater = function(owner, obj) {
        var root;
        var cur;

        // transform obj into nested state objs
        (function(object) {
            var build = function(parent, name, node, indent) {
                var state = State(parent, name, node);

                var children = state.children;

                if (children !== undefined) {
                    for (var name in children) {
                        children[name] = build(state, name, children[name], indent + indent);
                    }
                };

                return state;
            };

            root = cur = build(cur, "root", object, " ");
            cur.init();
        })(obj)


        var checkCur = function() {
            var timeOver = cur.finished();
            var active = cur.active();
            var old;

            if (cur.finished() || !active) { 
                if (cur.transition) {
                    old = cur;
                    cur.transition();
                    if (cur !== old.parent) {
                        cur.init();
                    }
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

        var toRoot = function() {
            cur.timer.reset();
            cur = root;
        }

        return {
            toParent: toParent,
            toChild: toChild,
            toRoot: toRoot,
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
