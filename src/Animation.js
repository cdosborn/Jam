;(function(exports) {
    exports.Animation = function(obj, img, frames, repeat) {

        var index = 0,
            count = 0,
            width = obj.size.x,
            height = obj.size.y,
            x = obj.center.x - width/2,
            y = obj.center.y - height/2;

        return {
            next: function() {
                count = (count + 1) % repeat;
                if (count === 0) {
                    index = (index + 1) % frames.length
                } 
                return index;
            },
            draw: function(ctx) { 
                var frame = frames[index];
                ctx.drawImage(img, frame * width, 0, width, height, x, y, width, height);
            },
            reset: function() {
                index = 0;
            },
            set: function(i) {
                index = i;
            },
            refresh: function() {
                width = obj.size.x,
                height = obj.size.y,                    
                x = obj.center.x - width/2,
                y = obj.center.y - height/2;        
            }
        }
    }

})(this);
