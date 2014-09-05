;(function(exports) {
    exports.game = function() {
        this.C = new Coquette(this, "canvas", 1280, 500, "#000");
        this.C.entities.create(Player);
    //  for (var i = 0; i < 10; i++) {
    //      var width  = Math.min(100, Math.random() * 700);
    //      var height = Math.min(40, Math.random() * 100);
    //      var x      = Math.random() * 1000;
    //      var y      = Math.random() * 300;
    //      exports.C.entities.create(Platform, {
    //          size:   { x: width, y: height },
    //          center: { x: x, y: y }
    //      });
    //  }
        exports.C.entities.create(Platform, {
            size:   { x: 720, y: 10 },
            center: { x: 360, y: 350 }
        });

    };
    game();
//  game.load(intro);
}(this));
