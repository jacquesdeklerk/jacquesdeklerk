/*global console: false */
/*global ActiveXObject: false */


var JDK = JDK || {};



JDK.Polyfills =(function() {
    "use strict";
    
    //requestAnimationFrame polyfill
    
    (function fillRequestAnimFrame(){
        
       var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        currTime,
        timeToCall,
        id,
        i;
        
        for(i = 0; i < vendors.length && !window.requestAnimationFrame; i+=1) {
            window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
            window.cancelRequestAnimationFrame = window[vendors[i]+
              'CancelRequestAnimationFrame'];
        }
    
        if (!window.requestAnimationFrame){
            window.requestAnimationFrame = function(callback, element) {
                currTime = new Date().getTime();
                timeToCall = Math.max(0, 16 - (currTime - lastTime));
                id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
    
        if (!window.cancelAnimationFrame){
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        } 
    }());
    
    
}());


JDK.Utils = (function(Math){
    "use strict";
    
    var util = {},
        i;
    
    util.getElementsByClassName = function (node, classname) {
        
        var a;
        
        if(typeof node.getElementsByClassName === 'function'){
            a = node.getElementsByClassName(classname);
        }else{
            var re = new RegExp('(^| )'+classname+'( |$)'),
                els = node.getElementsByTagName("*"),
                j;
                
            a = [];    
            
            for(i = 0, j = els.length; i < j; i+=1){
                if(re.test(els[i].className)){
                    a.push(els[i]);
                }
            }    
        }

        return a;
    };
    

    util.hasClass =  function(element,className) {
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    };
    
    util.removeClass = function(elem, className) {
        var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
        if (this.hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    };
  

    util.addClass = function(element, className) {
        if (!this.hasClass(element, className)) {

            element.className += ' ' + className;
        }
    };
    
    
    util.toggleClass = function (element, className) {
        var newClass = ' ' + element.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
        if (this.hasClass(element, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace( ' ' + className + ' ' , ' ' );
            }
            element.className = newClass.replace(/^\s+|\s+$/g, '');
        } else {
            element.className += ' ' + className;
        }
    };

    
    
    util.bindEvent = function (element, eventName, eventHandler) {
        if (element.addEventListener){
            element.addEventListener(eventName, eventHandler, false); 
        } 
        else if (element.attachEvent){
            element.attachEvent('on'+eventName, eventHandler);
        }
    };
    
    /*
     * Scroll to top function
     */
    util.scrollTo = function(element, to, duration, callback) {
        var start = document.documentElement.scrollTop || element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20,
            animateScroll;
    
        animateScroll = function(){        
            currentTime += increment;
            var val = Math.easeInOutQuad(currentTime, start, change, duration);     
            
            if(element.scrollTop){
                element.scrollTop = val;
            }else{
                document.documentElement.scrollTop = val;
            }

            if(currentTime < duration) {
                //setTimeout(animateScroll, increment);
                
                window.requestAnimationFrame(animateScroll);                
                
            }else{
                //end of scroll
                if(callback){
                   callback(); 
                }
                              
            }
        };
        animateScroll();
    };
    
    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
        
        t /= d/2;
        if (t < 1){            
            return c/2*t*t + b;
        }
        t-=1;
        return -c/2 * (t*(t-2) - 1) + b;
    };
       
    util.preventDefault = function(event){
         if(event.preventDefault){
            event.preventDefault();    
         }else{
             event.returnValue = false; //lte8
         }   
    };
    
    

    return util; //public util object
    
    
}(Math));

JDK.Ajax = (function(){
    "use strict";
    
    var ajax = {},
        XMLHttpFactories = [
                function () {return new XMLHttpRequest();},
                function () {return new ActiveXObject("Msxml2.XMLHTTP");},
                function () {return new ActiveXObject("Msxml3.XMLHTTP");},
                function () {return new ActiveXObject("Microsoft.XMLHTTP");}
            ],
        i;
    
    ajax.formalizeObject = function (form){
   
        
        //create post send-data
        if (typeof form !== 'object'){
            throw new Error('no object provided');
        }
        var ret = '';
        form = form.elements || form;//double check for elements node-list
        
        for (i=0; i < form.length; i+=1){
            if (form[i].type === 'checkbox' || form[i].type === 'radio'){
                if (form[i].checked){
                    ret += (ret.length ? '&' : '') + form[i].name + '=' + form[i].value;
                }
            }
            ret += (ret.length ? '&' : '') + form[i].name +'='+ form[i].value; 
        }
        return encodeURI(ret);
    };
    
    
    ajax.createXMLHTTPObject = function() {
                
        var xmlhttp = false;
        for (i=0; i < XMLHttpFactories.length; i+=1) {
            
            if(XMLHttpFactories[i]()){
                xmlhttp = XMLHttpFactories[i](); 
                                
                break;
            }
        }
        return xmlhttp;
    };
    
    ajax.sendRequest = function(url,callback,postData,errorCallback) {
        var req = this.createXMLHTTPObject(),
            method;
            
        if (!req) {
            //if no request object could be created, exit
            return;
        }

        
        method = (postData) ? "POST" : "GET";
        
        req.open(method,url,true); // true (3rd param) = async
        
        //req.setRequestHeader('User-Agent','XMLHTTP/1.0');
        
        if (postData){
            req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        }
            
        req.onreadystatechange = function () {
            
            //console.log('onreadystatechange = ' +  req.readyState);
            
            if (req.readyState !== 4){ 
                return;
            }
            
            if (req.status !== 200 && req.status !== 304) {

                console.log('HTTP error ' + req.status);
                
                if (arguments.length === 4){
                    errorCallback();
                }
                
                return;
            }
            callback(req);
        };
        
        if (req.readyState === 4) {
            return;
        }

        
        req.send(postData);
    };
    
    

    return ajax;

}());



JDK.Page = (function(window,FastClick, util, ajax){
    "use strict";
    
    var
        document = window.document,  // Use the correct document accordingly with window argument (sandbox)      
        location = window.location,
        $contact = document.getElementById('contact'),
        enableTimer = 0, // Used to track the enabling of hover effects
        contactHash = 'message',
        projects,
        footerNav,
        scrollSpreed = 750,
        formError = false,
        i;
        

    function toggleContactHash(element){      
        if(util.hasClass(element,'expanded')){
             window.location.hash = contactHash;
        }else{            
            if(util.hasClass(document.getElementsByTagName('html')[0], 'history')){
               history.replaceState('', document.title, location.pathname); 
            }else{
                window.location.hash = '';
            }
        }        
     }  
       
   /**
     * Removes the hover class from the body. Hover styles
     * are reliant on this class being present
     */
    function removeHoverClass() {
        //document.body.classList.remove('hover');       
        util.removeClass(document.getElementById('top'),'hover');        
    }
    
    /**
     * Adds the hover class to the body. Hover styles
     * are reliant on this class being present
     */
    function addHoverClass() {
        //document.body.classList.add('hover');        
        util.addClass(document.body,'hover'); 
    }
    
    /*
     * Project click listener callback
     */
    function projectClick(e){        
        
        e = e||window.event;
        var target = e.target || e.srcElement,
            properThis,
            current,
            element = this;
        
        if(element.nodeType === 1){
            properThis = true;   
        }else{
            properThis = false; //lte8
        }     
        
        if(!properThis){
            
            current = e.srcElement;
            
            if(current.tagName.toLowerCase() !== 'article'){
               
                while(current.tagName.toLowerCase() !== 'article'){                                
                    current = current.parentNode;
                }
                
                if(current.tagName.toLowerCase() === 'article'){
                    element = current;
                }
            }
        }


        if(util.hasClass(element,'expanded')){
            
            if( !util.hasClass(target, 'bottom-expander') && !util.hasClass(target.parentNode, 'bottom-expander')) {
                
                return;
            }
            
            util.removeClass(element,'expanded');
            
        }else{
            util.addClass(element,'expanded');
        } 

        //close all other expanded projects
       //$('.project').each(function(i) {
            //$(this).not($current).removeClass('expanded');       
        //});
        
        //window.scrollTo(0, $current.offset().top);
    }

    
    function handleTokenRequest(data) {        
        //add some form security
        var inputNode = document.createElement('input');
      
        inputNode.type = "hidden";
        inputNode.id = "first_foil";
        inputNode.name = "first_foil";
        inputNode.value = data.responseText;

        document.getElementById('contact-form').appendChild(inputNode);            
    }
    
    /*
     * Contact form
     */   
    
    function formErrorCallback(){
        document.getElementById('form-status').innerHTML = 'An error occurred, please try again.';
    }
       
    
    function handleFormSubmitRequest(data) {           
        
        if(data.responseText !== 'OK'){
            //php error
            console.log('PHP error');
            document.getElementById('form-status').innerHTML = data.responseText;
        }else{
            //success            
            document.getElementById('form-status').innerHTML = 'Your message has been sent...';
            
            document.getElementById("contact-form").reset();
        }        
    }
    
    function submitForm (e) {
        
        var date = new Date(),
            time = date.getTime();
        
        e = e||window.event;  
        
        util.preventDefault(e);   
        
        ajax.sendRequest('php/contact.php?' + time , handleFormSubmitRequest, ajax.formalizeObject(document.getElementById('contact-form').elements), formErrorCallback);
    }
    
    
    
    /*
     * Attach Fastclick to body
     */
    util.bindEvent(window,'load', function() {
        FastClick.attach(document.body);
    });

       
   /*
     * Listen for a scroll and use that to remove
     * the possibility of hover effects
     */
    
    util.bindEvent(window,'scroll', function () {
      clearTimeout(enableTimer);
      removeHoverClass();
    
      // enable after 0.5 seconds
      enableTimer = setTimeout(addHoverClass, 500);
    });
        
    
    //close contact if clicked outside
    util.bindEvent(document,'click', function(e) {
        var hasParent = false,
            node,
            target = e.target || e.srcElement;
        
        if(location.hash === ('#' + contactHash)){

        
            for(node = target; node !== document.body; node = node.parentNode){
                if(node.id === 'contact-form' || node.id === 'contact-options'){
                    hasParent = true;
                    break;
                }
            }
            
            if(!hasParent){
                util.removeClass($contact,'expanded');
                toggleContactHash($contact);
            }
        }
        
    });

    //on loading page,expand contact section if hash is set
    if(window.location.hash === '#' + contactHash){
         util.addClass($contact,'expanded');
    }
    
    
    //Expand project      
    projects = util.getElementsByClassName(document.body,'project');
    
    for(i = 0; i < projects.length; i+=1){

        util.bindEvent(projects[i],'mouseup', projectClick);
    }
     
    


    //toggle contact
    util.bindEvent(document.getElementById('contact-form-expander'),'click', function(e) {
        //e.preventDefault();
        util.preventDefault(e);
        
        util.toggleClass($contact, 'expanded');       
        
        toggleContactHash($contact);
    });
    
    
    /*
     * footer - scroll to and open contact
     */
    footerNav = document.getElementById('footer-nav');
    footerNav = util.getElementsByClassName(footerNav,'contact')[0];
    
    util.bindEvent(footerNav,'click', function(e) {
        util.preventDefault(e);

        toggleContactHash($contact);
        
        util.scrollTo(document.body, 0, scrollSpreed,function(){
            // SET A TIMEOUT...
            window.setTimeout(function(){
                if(!util.hasClass($contact,'expanded')){
                    util.addClass($contact,'expanded');
                }
                toggleContactHash($contact);
            }, 300);    
        });        
    });
    

    /*
     * Scroll to top
     */   
    util.bindEvent(document.getElementById('scroll-top'),'click', function(e) {
        util.preventDefault(e);
        util.scrollTo(document.body, 0, scrollSpreed);
    });
    
    
    //form token cookie
    ajax.sendRequest('php/token.php',handleTokenRequest);
    
    
    util.bindEvent(document.getElementById('contact-form'), 'submit', submitForm);

}(window,FastClick, JDK.Utils, JDK.Ajax));