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

    Drawable = function(game, json) {
        var delta  = json.delta || 0;
        var rendr  = game.c.renderer;
        var width  = json.width  || config.Game.Width;
        var height = json.height || config.Game.Height;

        var recent = {
            x      : json.x      || 0,
            y      : json.y      || 0,
            viewX  : rendr.getViewCenter().x - rendr.getViewSize().x/2,
            viewY  : rendr.getViewCenter().y - rendr.getViewSize().y/2,
        }

        var old =  {
            x      : recent.x,
            y      : recent.y,    
            viewX  : recent.viewX,
            viewY  : recent.viewY,
        }

        var img, draw;
        if (json.rsc !== undefined) {
            img = game.resourcer.get(json.rsc);
            draw = function(ctx) { 
                ctx.drawImage(img, recent.x, recent.y, width, height);
            }
        } else {
            draw = function(ctx) {
                ctx.fillStyle = json.color;
                ctx.fillRect(recent.x, recent.y, width, height);
            }
        }

        this.draw = draw;

        this.update = function() {
            // update old
            old.x = recent.x;
            old.y = recent.y;
            old.viewX = recent.viewX;
            old.viewY = recent.viewY;

            if (delta !== 0) {
                // update new
                recent.viewX = rendr.getViewCenter().x - rendr.getViewSize().x/2;
                recent.viewY = rendr.getViewCenter().y - rendr.getViewSize().y/2;

                recent.x -= delta * (recent.viewX - old.viewX)
                recent.y -= delta * (recent.viewY - old.viewY);
            }
        };

        this.changed = function() {
            var changeXGreaterThanOne = ((recent.x | 0) - (old.x | 0) !== 0)
            var changeYGreaterThanOne = ((recent.y | 0) - (old.y | 0) !== 0)
            return changeXGreaterThanOne || changeYGreaterThanOne;
        }
    }
    exports.Layerer = Layerer;

})(this);
