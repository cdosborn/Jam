;(function(exports) {

    // obj - ref to obj defining size for drawing
    // img - ref to img to be split across frames
    // frames - list of img frames composing anim

    Animation = function(obj) {
        var curFrame = 0,
            timeLeftOver = 0;

        var img    = obj.img,
            frames = obj.frames,
            fps    = obj.fps,
            size   = obj.size,
            center = obj.center,
            offset = obj.offset;

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

    Animator = function(owner, game, arr) {
        var activeQueue = [],
            passiveQueue = [],
            anims = {}
            defaultFps = 10;

        // construct animations
        (function() {
            var i, img, jsonObj, size, offset,
                frames, animObj;
                len = arr.length;
                
            for (i = 0; i < len; i++) {
                jsonObj = arr[i];
                frames = [];
                animObj = {};

                // extend animObj from JSON

                animObj.img = game.resourcer.get(jsonObj.rsc);

                // set size
                if (jsonObj.sizex !== undefined && jsonObj.sizey !== undefined) {
                    animObj.size = {x:jsonObj.sizex, y:jsonObj.sizey};
                } else {
                    animObj.size = owner.size;
                }

                // set offset
                if (jsonObj.offsetx !== undefined && jsonObj.offsety !== undefined) {
                    animObj.offset = {x:jsonObj.offsetx, y:jsonObj.offsety};
                } else {
                    animObj.offset = {x:0, y:0};
                }

                // set center
                if (jsonObj.centerx !== undefined && jsonObj.centery !== undefined) {
                    animObj.center = {x:jsonObj.centerx, y:jsonObj.centery};
                } else {
                    animObj.center = owner.center;
                }

                if (jsonObj.frames instanceof Array) {
                    animObj.frames = jsonObj.frames;
                } else {
                    for (var j = 0; j < jsonObj.frames; j++) {
                        frames.push(j);
                    }
                    animObj.frames = frames;
                }

                if (jsonObj.fps !== undefined) {
                    animObj.fps = jsonObj.fps;
                } else {
                    animObj.fps = defaultFps;
                }

                // Construct animation from animObj
                passiveQueue.push(jsonObj.name)
                anims[jsonObj.name] = Animation(animObj);
            }   
        })();

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

    exports.Animator = Animator;

})(this);
