;(function(exports) {
    exports.game = function() {
        this.C = new Coquette(this, "canvas", 1280, 500, "#000");
        this.C.entities.create(Player);
        exports.C.entities.create(Platform, {
            size:   { x: 720, y: 10 },
            center: { x: 360, y: 350 }
        });

    };
    game();
//  game.load(intro);
}(this));
