;(function(exports) {

    Layerer = function(game, drawables, canvases) {
        var contexts = {}; 
        var layers = []; // arr of drawable layers (canvases)
        var lookup = {};
        var drawbjects = {};
          
        // initialize a layer for each canvas
        canvases.forEach(function(name, index) {
           // canvas initialiation should happen in main
           var c = document.getElementById(name);
           c.width = config.Game.Width;
           c.height = config.Game.Height;
           var ctx = c.getContext('2d');
           contexts[name] = ctx;
           lookup[name] = index;
           // Create layers 
           layers.push(new Layer(ctx, drawbjects));
        });

        this.include = function(drawbleNames, canvas_name) {
            // Create drawables that haven't been created before
            drawbleNames.forEach(function(name) {
                if (!drawbjects[name]) {
                    drawbjects[name] = new Drawable(game, drawables[name]);
                }
            });

            var layer = layers[lookup[canvas_name]];
            layer.include(drawbleNames);
            layer.draw();
        };

        // layerer.include(["sky","mountains","clouds"], "fg_canvas");
        this.update = function(delta) {
            layers.forEach(function(layer) {
                layer.update();
                if (layer.changed()) {
                    layer.clear();
                    layer.draw();
                };
            });
        };

        this.remove= function(drawable, canvas) {
            layers[lookup[canvas]].remove(drawable);
        };
        this.clear = function() {
            layers.forEach(function(layer) {
                layer.clear();
            });
        };
    }

    var Layer = function(ctx, drawables) {
        var included = [];

        this.include = function(names) {
            included = included.concat(names);
        };
        this.clear = function() { 
            ctx.clearRect(0, 0, config.Game.Width, config.Game.Height);
        };
        this.draw = function() {
            included.forEach(function(name) {
                drawables[name].draw(ctx);
            });
        };
        this.changed = function() {
            return included.some(function(name) {
                return drawables[name].changed();
            });
        };
        this.update = function() {
            included.forEach(function(name) {
                drawables[name].update();
            });
        };
        this.remove = function(name) {
            included.splice(included.indexOf(name), 1)
        }
    }

    var ifDefined = function(value, backup) {
        return (value === undefined ? backup : value)
    } 

    Drawable = function(game, json) {
        var width  = ifDefined(json.width, config.Game.Width);
        var height = ifDefined(json.height, config.Game.Height);
        var x      = ifDefined(json.x,     0);
        var y      = ifDefined(json.y,     0);
        var oldX   = x;
        var oldY   = y;
        var delta  = ifDefined(json.delta, 0);
        var rendr = game.c.renderer;
        var oldViewX = rendr.getViewCenter().x - rendr.getViewSize().x/2;
        var oldViewY = rendr.getViewCenter().x - rendr.getViewSize().y/2;
        var viewX = oldViewX;
        var viewY = oldViewY;
        var deltaX = 0;
        var deltaY = 0;

        var img, draw;
        if (json.rsc !== undefined) {
            img = game.resourcer.get(json.rsc);
            draw = function(ctx) { 
                console.log("Undefined?", img === undefined, 'rsc', json.rsc);
                ctx.drawImage(img, x, y, width, height);
            }
        } else {
            draw = function(ctx) {
                ctx.fillStyle = json.color;
                ctx.fillRect(x, y, width, height);
            }
        }

        this.draw = draw;

        this.update = function() {
            if (delta !== 0) {
                oldX = x;
                oldY = y;
                viewx = rendr.getViewCenter().x - rendr.getViewSize().x/2
                viewy = rendr.getViewCenter().y - rendr.getViewSize().y/2
                deltax = viewx - oldViewX;
                deltay = viewy - oldViewY;
                x += delta * deltax;
                y -= delta * deltay;
                oldViewX = viewx;
                oldViewY = viewy;

            }
        };

        this.changed = function() {
            var changeXGreaterThanOne = ((x | 0) - (oldX | 0) !== 0)
            var changeYGreaterThanOne = ((y | 0) - (oldY | 0) !== 0)
            return changeXGreaterThanOne || changeYGreaterThanOne;
        }
    }
    exports.Layerer = Layerer;

})(this);
