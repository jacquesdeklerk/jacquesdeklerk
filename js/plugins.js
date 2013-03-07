// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

//// Place any jQuery/helper plugins in here.

//Open External Links as Blank Targets via Unobtrusive JavaScript
(function() {
    var i=0;
    if (!document.getElementsByTagName) return;
    var anchors = document.getElementsByTagName("a");
    for (i ; i<anchors.length; i++) {
        var anchor = anchors[i];
        if (
            anchor.getAttribute("href") && ( 
            anchor.getAttribute("rel") == "external" || 
            anchor.getAttribute("rel") == "external nofollow" || 
            anchor.getAttribute("rel") == "nofollow external" )
            )
        anchor.target = "_blank";
    }
}());
//End of Open External Links
