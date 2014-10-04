;(function(exports) {

    // resourcer private vars;
    var resources = {};
    var finished = false;
    var counter = 1;

    var Resourcer = function(arr, callback) {
        var cb, name, url;

        for (var i = 0, len = arr.length; i < len; i++) {

            name = arr[i].name;
            url = arr[i].url;

            // function called when rsc is ready
            cb = (function(name,index,total) {
                return function(){ 
                    finished = counter === arr.length;
                    return callback(name,counter++,total);
                };
            })(name, i, len);

            // bind load event to function
            if (isPng(url)) {
                rsc = new Image();
                rsc.addEventListener('load', cb, false);
            } else {
                rsc = new Audio();
                rsc.addEventListener('canplaythrough', cb, false);
            }

            rsc.src = url;
            rsc.name = name;
            resources[name] = rsc;
        }

        // edge case when no resources passed
        if (arr.length === 0) {
            finished = true;
        }
    }

    Resourcer.prototype = {
        get: function(name) {
            return resources[name];
        },
        isReady: function() {
            return finished;
        }
    }

    var isPng = function(url) {
        return /\.png$/.test(url);
    }

    exports.Resourcer = Resourcer;

})(this);
