var curFrame = 0;
var timeLeftOver = 0;
var time = 0
module.exports = function(delta, fps, length) {
    time += delta
    var frameDuration = 1 / fps * 1000;
    var timePassed = timeLeftOver + delta
    var framesToAdvance =  (timePassed / frameDuration) | 0;
    var extraTime = timePassed % frameDuration;

    if (framesToAdvance > 0) {
        curFrame = (curFrame + framesToAdvance) % length;
    }

    console.log("frame " + curFrame + " at " + time); 
            
    timeLeftOver = extraTime;
    return curFrame;
}

