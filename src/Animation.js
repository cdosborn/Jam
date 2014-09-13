;(function(exports) {

    // obj - ref to obj defining size for drawing
    // img - ref to img to be split across frames
    // frames - list of img frames composing anim
   //
    // *optional*
    // repeatEach - repeat each frame, repeatEach times
    // cast  - last frame where anim can be cancelled
    // exit - first frame following cast, where anim can be switched

    exports.Animation = function(obj, settings) {

        var curFrame = 0,
            lastTime = 0,
            img    = settings.img,
            frames = settings.frames,
            fps    = (settings.fps    === undefined ? 10 : settings.fps),
            cast   = (settings.cast   === undefined ? frames.length : settings.cast),
            exit   = (settings.exit   === undefined ? 0 : settings.exit),
            size   = (settings.size   === undefined ? obj.size : settings.size),
            center = (settings.center === undefined ? obj.center : settings.center);

        return {
            next: function(delta) {
                var curTime = game.getTime(),
                    timePassed = curTime - lastTime,
                    frameDuration = 1 / fps * 1000;
                    
                var framesToAdvance = (lastTime + delta) / frameDuration;

                //console.log(framesToAdvance);
                //console.log(framesToAdvance);
                if (framesToAdvance < 1) {
                    lastTime += delta
                } else {
                    lastTime = 0;
                    curFrame = (curFrame + framesToAdvance) % frames.length | 0;
                    //console.log(curFrame);
                }

            },
            draw: function(ctx) { 
                var frame = frames[curFrame],
                    width = size.x,
                    height = size.y,                    
                    x = center.x - width/2,
                    y = center.y - height/2;        
                //if (player.state.action ===  0) {
                //    //console.log("frame: " + frame);
                //    //console.log("x: " + x);
                //    //console.log("y: " + y);

                //    //console.log("width: " + width);
                //    //console.log("height: " + height);
                //}
                
                ctx.drawImage(img, frame * width, 0, width, height, x, y, width, height);
            },
            reset: function() {
                curFrame = 0;
            },
            stuck: function() {
                return curFrame > cast && curFrame < exit; 
            },
        }
    }

    exports.Animator = function(obj, ctx) {
        var queue = [],
            anims = {};

        return {
            register: function(name, anim) {
                anims[name] = anim;
            },
            push: function(anim) {
                if (!current.stuck()) {

                }
            },
            draw: function(otherContext) { 
                if (otherContext === undefined)
                    current.map(function (a) { a.draw(ctx); });
                else 
                    current.draw(otherContext);
            }
        }
    }

})(this);
