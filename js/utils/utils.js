var UTILS = {
    randInt: function(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a
    },
    randFloat: function(a, b) {
        return a + Math.random() * (b - a)
    },
    nearestPow2: function(a) {
        return Math.pow(2, Math.round(Math.log(a) / Math.log(2)))
    },
    getDistance: function(a, b, c, d) {
        return Math.sqrt((c -= a) * c + (d -= b) * d)
    },
    padNum: function(a, b) {
        for (var c = a + ""; c.length < b; )
            c = "0" + c;
        return c
    },
    getTimeString: function(a) {
        var b = parseInt(a % 1E3 / 100);
        a = parseInt(a / 1E3);
        return this.padNum(a, 2) + ":" + this.padNum(b, 2)
    },
    getUniqueID: function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
            var b = 16 * Math.random() | 0;
            return ("x" == a ? b : b & 3 | 8).toString(16)
        })
    }
};

function getScreenRefreshRate(callback, runIndefinitely){
    let requestId = null;
    let callbackTriggered = false;
    runIndefinitely = runIndefinitely || false;

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    }
    
    let DOMHighResTimeStampCollection = [];

    let triggerAnimation = function(DOMHighResTimeStamp){
        DOMHighResTimeStampCollection.unshift(DOMHighResTimeStamp);
        
        if (DOMHighResTimeStampCollection.length > 10) {
            let t0 = DOMHighResTimeStampCollection.pop();
            let fps = Math.floor(1000 * 10 / (DOMHighResTimeStamp - t0));

            if(!callbackTriggered){
                callback.call(undefined, fps, DOMHighResTimeStampCollection);
            }

            if(runIndefinitely){
                callbackTriggered = false;
            }else{
                callbackTriggered = true;
            }
        }
    
        requestId = window.requestAnimationFrame(triggerAnimation);
    };
    
    window.requestAnimationFrame(triggerAnimation);

    // Stop after half second if it shouldn't run indefinitely
    if(!runIndefinitely){
        window.setTimeout(function(){
            window.cancelAnimationFrame(requestId);
            requestId = null;
        }, 500);
    }
}
