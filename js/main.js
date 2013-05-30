/*global console: false */


(function(window,FastClick){
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
        i,
        XMLHttpFactories = [
            function () {return new XMLHttpRequest();},
            function () {return new ActiveXObject("Msxml2.XMLHTTP");},
            function () {return new ActiveXObject("Msxml3.XMLHTTP");},
            function () {return new ActiveXObject("Microsoft.XMLHTTP");}
        ];
    

    function getElementsByClassName (node, classname) {
        var a = [],
            re = new RegExp('(^| )'+classname+'( |$)'),
            els = node.getElementsByTagName("*"),
            i,
            j;
        for(i=0,j=els.length; i<j; i++){
            if(re.test(els[i].className)){
                a.push(els[i]);
            }
        }
        return a;
    }
    

    function hasClass(element,className) {
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    }
    
    function removeClass(elem, className) {
        var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
        if (hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    } 
  

    function addClass(element, className) {
        if (!hasClass(element, className)) {

            element.className += ' ' + className;
        }
    }
    
    
     function toggleClass (element, className) {
        var newClass = ' ' + element.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
        if (hasClass(element, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace( ' ' + className + ' ' , ' ' );
            }
            element.className = newClass.replace(/^\s+|\s+$/g, '');
        } else {
            element.className += ' ' + className;
        }
    }

    
    
    function bindEvent (element, eventName, eventHandler) {
        if (element.addEventListener){
            element.addEventListener(eventName, eventHandler, false); 
        } 
        else if (element.attachEvent){
            element.attachEvent('on'+eventName, eventHandler);
        }
    }
    
    function toggleContactHash(element){      
        if(hasClass(element,'expanded')){
             window.location.hash = contactHash;
        }else{            
            if(hasClass(document.getElementsByTagName('html')[0], 'history')){
               history.replaceState('', document.title, window.location.pathname); 
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
        removeClass(document.getElementById('top'),'hover');        
    }
    
    /**
     * Adds the hover class to the body. Hover styles
     * are reliant on this class being present
     */
    function addHoverClass() {
        //document.body.classList.add('hover');        
        addClass(document.body,'hover'); 
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
            properThis = false;
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


        if(hasClass(element,'expanded')){
            
            if( !hasClass(target, 'bottom-expander') && !hasClass(target.parentNode, 'bottom-expander')) {
                
                return;
            }
            
            removeClass(element,'expanded');
            
        }else{
            addClass(element,'expanded');
        } 

        //close all other expanded projects
       //$('.project').each(function(i) {
            //$(this).not($current).removeClass('expanded');       
        //});
        
        //window.scrollTo(0, $current.offset().top);
    }
    
    
    /*
     * Scroll to top function
     */
    function scrollTo(element, to, duration, callback) {
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
                
                requestAnimationFrame(animateScroll);
                
                
            }else{
                //end of scroll
                if(callback){
                   callback(); 
                }
                              
            }
        };
        animateScroll();
    }
    
    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
        
        t /= d/2;
        if (t < 1){
            
            //console.log(c/2*t*t + b);
            
            return c/2*t*t + b;
        }
        t--;
        
        //console.log(-c/2 * (t*(t-2) - 1) + b);
        return -c/2 * (t*(t-2) - 1) + b;
    };
    
    
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
     * Attach Fastclick to body
     */
    bindEvent(window,'load', function() {
        FastClick.attach(document.body);
    });

       
   /*
     * Listen for a scroll and use that to remove
     * the possibility of hover effects
     */
    
    bindEvent(window,'scroll', function () {
      clearTimeout(enableTimer);
      removeHoverClass();
    
      // enable after 0.5 seconds
      enableTimer = setTimeout(addHoverClass, 500);
    });
        
    
    //close contact if clicked outside
    bindEvent(document,'click', function(e) {
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
                removeClass($contact,'expanded');
                toggleContactHash($contact);
            }
        }
        
    });

    //on loading page,expand contact section if hash is set
    if(window.location.hash === '#' + contactHash){
         addClass($contact,'expanded');
    }
    
    
    //Expand project   
    
    
    projects = typeof document.getElementsByClassName !== 'function' ? getElementsByClassName(document.body,'project') : document.getElementsByClassName('project');
    
    
    
    for(i = 0; i < projects.length; i++){

        bindEvent(projects[i],'mouseup', projectClick);
    }
     
    


    //toggle contact
    bindEvent(document.getElementById('contact-form-expander'),'click', function(e) {
        //e.preventDefault();
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        
        toggleClass($contact, 'expanded');       
        
        toggleContactHash($contact);
    });
    
    
    /*
     * footer - scroll to and open contact
     */
    footerNav = document.getElementById('footer-nav');
    footerNav = typeof document.getElementsByClassName !== 'function' ? getElementsByClassName(footerNav,'contact')[0] : footerNav.getElementsByClassName('contact')[0];
    
    bindEvent(footerNav,'click', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        toggleContactHash($contact);
        
        scrollTo(document.body, 0, scrollSpreed,function(){
            // SET A TIMEOUT...
            window.setTimeout(function(){
                if(!hasClass($contact,'expanded')){
                    addClass($contact,'expanded');
                }
                toggleContactHash($contact);
            }, 300);    
        });
        
    });
    

    /*
     * Scroll to top
     */   
    bindEvent(document.getElementById('scroll-top'),'click', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        scrollTo(document.body, 0, scrollSpreed);
    });
    
    
    /*
     * Contact form
     */
    function formalizeObject(form){
        //we'll use this to create our send-data
        if (typeof form !== 'object'){
            throw new Error('no object provided');
        }
        var ret = '';
        form = form.elements || form;//double check for elements node-list
        for (i=0;i<form.length;i++){
            if (form[i].type === 'checkbox' || form[i].type === 'radio'){
                if (form[i].checked)
                {
                    ret += (ret.length ? '&' : '') + form[i].name + '=' + form[i].value;
                }
                continue;
            }
            ret += (ret.length ? '&' : '') + form[i].name +'='+ form[i].value; 
        }
        return encodeURI(ret);
    }
    
    function createXMLHTTPObject() {
        var xmlhttp = false;
        for (i=0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    }
    
    function sendRequest(url,callback,postData) {
        var req = createXMLHTTPObject(),
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
                
                formErrorCallback();
                
                return;
            }
            callback(req);
        };
        
        if (req.readyState === 4) {
            return;
        }
        
        //console.log(postData);
        
        req.send(postData);
    }
    
    
    
    
    
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
        
        e.preventDefault ? e.preventDefault() : e.returnValue = false;   
        
        sendRequest('php/contact.php' + time , handleFormSubmitRequest, formalizeObject(document.getElementById('contact-form').elements), formErrorCallback);
    }
    
    
    
    
    sendRequest('php/token.php',handleTokenRequest);
    
    
    bindEvent(document.getElementById('contact-form'), 'submit', submitForm);
    
    
    
    
    
    
    
    
    
    
    
    (function() {
        var lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'],
            currTime,
            timeToCall,
            id;
            
        for(i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
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
    
    
    
    
    
    
    
    
    
    
    
    

    
}(window,FastClick));
