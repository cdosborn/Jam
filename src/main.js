;(function(exports) {
    var Game = function() {
        var self = this;

        var time = 0, 
            logger = 0,
            count = 0,
            p;

        this.c = new Coquette(this, "canvas", 1280, 500, "#444");

        this.getTime = function() {
            return time;
        }

        this.resourcer = new Resourcer( config.Player.Resources, 
            function(name, counter, total) {
              console.log("Loaded: " + name + " " + counter + "/" + total);
        });

        this.sequencer = ButtonSequencer(this);


        var update = function(interval) { 
            time += interval;
            this.sequencer.update(interval, this.c.inputter.getEvents());
            this.c.renderer.setViewCenter(p.center); 
        }

        var init = function() {
            p = self.c.entities.create(Player, { 
                center: { x:10, y:110 },
                size:   { x:124, y:106 }
            });

            self.c.entities.create(Enemy, { 
                center: { x:10, y:110 },
                size:   { x:60, y:100 },
                spawnPoint: { x:10, y:110 }
            });

            self.c.entities.create(Enemy, { 
                center: { x:1200, y:110 },
                size:   { x:60, y:100 },
                spawnPoint: { x:1200, y:110 }
            });

            self.c.entities.create(Platform, {
                size:   { x: 1280, y: 30 },
                center: { x: 640, y: 400 }
            });
        };

        this.update = function(){
            if (this.resourcer.isReady()) {
                init();
                this.update = update;
            }
        } 
    };

    exports.Game = Game;

}(this));
