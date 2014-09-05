;(function(exports) {
    exports.Platform = function(game, settings) {
        var that = this;
        for (var i in settings) {
          this[i] = settings[i];
        }

        this.color ="#fff";
        this.update = function() {}; 
        this.collision = function(other) {}
        this.boundingBox = C.collider.RECTANGLE;

        this.draw = function(ctx) { 
            ctx.fillStyle = that.color;
            ctx.fillRect(this.center.x - this.size.x / 2,
                         this.center.y - this.size.y / 2,
                         this.size.x,
                         this.size.y);
        }; 
    };

})(this);
