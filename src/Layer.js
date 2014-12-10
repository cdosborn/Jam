(function(exports) {
      
    //  rsc: "Mountains",
    //  delta {x: 0.2, y: 0}
    //  x:0,
    //  y:240,
    //  width: 1777,
    //  height: 172

    exports.Layer = function(game, json) {
        var img         = game.resourcer.get(json.rsc);
        var width       = json.width;
        var height      = json.height;
        var renderer    = game.c.renderer;
        var viewCenter  = renderer.getViewCenter();
        var viewSize    = renderer.getViewSize();
        var jsonUpdate  = json.update ? json.update.bind(this) : function(){};
        var view        = { center: viewCenter, size: viewSize };

        this.delta    = json.delta  || { x: 0, y: 0 };
        this.zindex   = json.zindex || 0;


        // position relative to viewport upper left corner
        this.offset = {
            x      : json.x      || 0,
            y      : json.y      || 0,
        }

        // recent and old keep track of the changes
        // that the view undergo
        var recent  = {
            viewX  : viewCenter.x,
            viewY  : viewCenter.y,
        }

        var old =  {
            viewX  : viewCenter.x,
            viewY  : viewCenter.y,
        }


        // below are objs reused in draw but not bound to
        // layer to prevent coquette from calling
        // collision detection on the layers
        var layer = { center: {}, size: {x: width, y: height} }; 
        var view = { center: viewCenter, size: viewSize }; 

        this.draw = function(ctx) { 
            //drawRect(view, ctx, "#0f0");

            layer.center.x = layer.size.x/2 + viewCenter.x - viewSize.x/2 + this.offset.x;
            layer.center.y = layer.size.y/2 + viewCenter.y - viewSize.y/2 + this.offset.y;

            rectInView = rectangleFromRectangleIntersection(layer, view);
            if (rectInView == undefined) return;
            // part of the layer in the viewport
            //drawRect(rectInView, ctx, "#f00");


            // calculate the relevant portion of the layer
            // to draw, relative to the layer
            var x1, // upper left point of the rectInView
                y1,    
                x2, // upper left point of layer
                y2,    
                rivSize = rectInView.size,     // aliases for now
                rivCenter = rectInView.center; // and later

            x1 = rivCenter.x - rivSize.x/2;
            y1 = rivCenter.y - rivSize.y/2;
            x2 = layer.center.x - layer.size.x/2;
            y2 = layer.center.y - layer.size.y/2;

            // calculate the relevant portion of the layer
            // to draw, relative to the layer (source)
            var sx,sy,sh,sw;
            sx = (x1 - x2) | 0;
            sy = (y1 - y2) | 0;
            sw = Math.round(rivSize.x);
            sh = Math.round(rivSize.y);
          //sw = rivSize.x;
          //sh = rivSize.y;

            // calculate the relevant portion of the layer
            // to draw, relative to the view (destination)
            var dx,dy,dh,dw; 
            dx = rivCenter.x - rivSize.x/2;
            dy = rivCenter.y - rivSize.y/2;
            dw = sw; 
            dh = sh;

            // sw && sh can be 0 with the rounding applied above
            // which causes ffx to throw an error
            // the rounding is necessary because there are overflow
            // issues of .0000000001 :C and all sx, sy, sw, sh must be legal
            try {
                sw && sh && ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
                drawRect(layer, ctx, "#00f");

            } catch (e) {
                console.log(sx, sy, sw, sh, dx, dy, dw, dh);
            }

        };

        this.update = function() {

            // update delta or offset maybs?
            jsonUpdate(view);

            // update new
            recent.viewX = viewCenter.x;
            recent.viewY = viewCenter.y;

            this.offset.x += this.delta.x * (recent.viewX - old.viewX);
            this.offset.y += this.delta.y * (recent.viewY - old.viewY);

            // update old
            old.viewX = recent.viewX;
            old.viewY = recent.viewY;

        };
    }

    // Could be optimized, there is unnecessary sorting
    var rectangleFromRectangleIntersection = function(obj1, obj2) {
        var Maths = Coquette.Collider.Maths;
        var corners, x1, x2, y1, y2, w, h;
        // if rectangles intersect
        if (Maths.unrotatedRectanglesIntersecting(obj1, obj2)) {
            corners = Maths.rectangleCorners(obj1).concat(Maths.rectangleCorners(obj2));
              

            // the 3rd and 6th of greatest y's and x's, represent corners
            // of the internal intersection rectangle


            // sort corners by x
            greaterX = corners.sort(function(c1, c2) { return c1.x - c2.x; });
            x1 = greaterX[2].x;
            x2 = greaterX[5].x;


            // sort corners by y
            greaterY = corners.sort(function(c1, c2) { return c1.y - c2.y; });
            y1 = greaterY[2].y;
            y2 = greaterY[5].y;

            w = x2 - x1;
            h = y2 - y1;

            return { center: { x:x1 + w/2, y:y1 + h/2}, 
                     size: { x: w, y: h }};
        }
        return; // undefined if no intersection
    }

    var drawRect = function(rect, ctx, color) {
        ctx.strokeStyle = color || "#f00";
      //ctx.strokeRect(rect.center.x - rect.size.x/2,
      //              rect.center.y -  rect.size.y/2,
      //              rect.size.x,
      //              rect.size.y)
        ctx.lineWidth = 1;

        var top = rect.center.y -  rect.size.y/2;
        var left = rect.center.x - rect.size.x/2;
        ctx.beginPath();
        ctx.moveTo(left, top)
        ctx.lineTo(left + rect.size.x, top);
        ctx.stroke();


        ctx.fillStyle = color;
        var textHeight = 15;
        var center = game.c.renderer.getViewCenter();
        ctx.fillText(top, 
                     center.x, 
                     top + textHeight);
    }


})(this)
