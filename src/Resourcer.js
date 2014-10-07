;(function(exports) {

    // resourcer private vars;
    var resources = {};
    var queue = []; // unloaded resources
    var finished = false;
    var counter = 0;

    var Resourcer = function(arr) {
        queue = arr;
    
        this.get = function(name) {
            return resources[name];
        };
        this.isReady = function() {
            return finished;
        };
        this.load = function(callback) {
            var i, len, onLoad, name, url;
            len = queue.length; 

            for (i = 0; i < len; i++) {

                name = queue[i].name;
                url = queue[i].url;

                // function called when rsc is ready
                onLoad = (function(name,index,total) {
                    return function(){ 
                        counter++;
                        finished = counter === total;
                        return callback(name,counter,total);
                    };
                })(name, i, len);

                // bind load event to function
                if (isPng(url)) {
                    rsc = new Image();
                    rsc.addEventListener('load', onLoad, false);
                } else {
                    rsc = new Audio();
                    rsc.addEventListener('canplaythrough', onLoad, false);
                }

                rsc.src = url;
                rsc.name = name;
                resources[name] = rsc;
            }

            // edge case when no resources passed
            if (len === 0) {
                finished = true;
            }
        }
    };

    var isPng = function(url) {
        return /\.png$/.test(url);
    }

    exports.Resourcer = Resourcer;

})(this);
