;(function(exports) {

    var Resourcer = function() {

        var finished = true;
        var resources = {};

        var get = function(url) { 
            return resources[url];
        }

        var isPng = function(url) {
            return /\.png$/.test(url);
        }

        var isReady = function() { 
            return finished;
        }

        var load = function(urls, callback) { 
            var rsc, url, counter;

            counter = 0;
            finished = urls.length === 0 ? true : false;

            for (var i = 0, len = urls.length; i < len; i++) {

                url = urls[i];


                // cb is a wrapper around the callback
                // passed as an argument
                //  1) calls callback with the url,index,total
                //  2) updates whether resourcer is finished

                var cb = (function(url,index,total) {
                    return function(){ 
                        finished = total - 1 === index;
                        return callback(url,++counter,total);
                    };
                })(url, i, len);

                if (isPng(url)) {
                    rsc = new Image()
                    rsc.addEventListener('load', cb, false);
                } else {
                    rsc = new Audio();
                    rsc.addEventListener('canplaythrough', cb, false);
                }

                rsc.src = url;
                resources[url] = rsc;
            }
        }

        return {
            load: load,
            get: get,
            isReady: isReady
        }
    }

    exports.Resourcer = Resourcer;

})(this);
