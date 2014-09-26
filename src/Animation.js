;(function(exports) {

    // obj - ref to obj defining size for drawing
    // img - ref to img to be split across frames
    // frames - list of img frames composing anim

    Animation = function(obj, settings) {

        var curFrame = 0,
            timeLeftOver = 0,
            img    = settings.img,
            frames = settings.frames,
            fps    = (settings.fps    === undefined ? 10            : settings.fps),
            size   = (settings.size   === undefined ? obj.size      : settings.size),
            center = (settings.center === undefined ? obj.center    : settings.center),
            offset = (settings.offset === undefined ? { x: 0, y: 0} : settings.offset);

        return {
            next: function(delta) {
                var frameDuration = 1 / fps * 1000;
                var timePassed = timeLeftOver + delta;
                var framesToAdvance = (timePassed / frameDuration) | 0;
                var extraTime = timePassed % frameDuration;

                if (framesToAdvance > 0) {
                    curFrame = (curFrame + framesToAdvance) % frames.length;
                }

                timeLeftOver = extraTime;
            },
            draw: function(ctx) { 
                var frame = frames[curFrame],
                    width = size.x,
                    height = size.y,                    
                    x = (center.x - width/2 + offset.x),
                    y = (center.y - height/2 + offset.y);        

                ctx.drawImage(img, frame * width, 0, width, height, x, y, width, height);
            },
            reset: function() {
                curFrame = 0;
                timeLeftOver = 0;
            },
            getFrame: function() {
                return curFrame;
            }
        }
    }

    Animator = function(obj, ctx) {
        var activeQueue = [],
            passiveQueue = [],
            anims = {};

        return {
            update: function(delta) {
                var name;
                for (var i = 0, len = passiveQueue.length; i < len; i++) {
                    name = passiveQueue[i];
                    anims[name].reset(); 
                }
                for (var i = 0, len = activeQueue.length; i < len; i++) {
                    name = activeQueue[i];
                    anims[name].next(delta);
                    passiveQueue.push(name);
                }
                activeQueue.length = 0;
            },
            register: function(name, anim) {
                passiveQueue.push(name);
                anims[name] = anim;
            },
            push: function(name) {

                var removeIndex;

                activeQueue.push(name);
                removeIndex = passiveQueue.indexOf(name);
                (removeIndex !== -1) ? passiveQueue.splice(removeIndex, 1) : undefined;
            },
            draw: function(ctx) { 
                for (var i = 0, len = activeQueue.length; i < len; i++) {
                    anims[activeQueue[i]].draw(ctx);
                  //if (activeQueue[i] === "PFX_Laser_Fall_R")
                  //    console.log("Frame " + anims[activeQueue[i]].getFrame() + " at " + game.getTime() + "ms");
                }

            },
            reset: function() {
                for (var i = 0, len = activeQueue.length; i < len; i++) {
                    name = activeQueue[i];
                    anims[name].reset(); 
                }
                for (var i = 0, len = passiveQueue.length; i < len; i++) {
                    name = passiveQueue[i];
                    anims[name].reset(); 
                }
            },
            getFrame: function(name) {
                return anims[name].getFrame();
            },
            getAnims: function(name) {
                return activeQueue;
            }
        }
    }

    exports.Animation = Animation;
    exports.Animator = Animator;

})(this);
