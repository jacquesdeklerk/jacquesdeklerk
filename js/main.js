$(document).ready(function(){
   "use strict";
	var $contact = $('#contact');
	
	//close contact if clicked outside
	$(document).mouseup(function (e){

	    if(e.target.hash === '#contact'){
	       return false;
	    }
	    else{
	        if($contact.has(e.target).length === 0){ 
                $contact.removeClass('expanded');
                toggleContactHash($contact);
            }
	    }
    });
    
	//expand contact section if hash is set
	if(window.location.hash === "#contact"){
	     $contact.addClass('expanded');
	}
	
	
	//Expand project
	
	$('.project').click(function(e) {
	    
	    var $current = $(this);
	    
	    if($current.hasClass('expanded')){
	        if( !$(e.target).hasClass('bottom-expander') && !$(e.target).parent().hasClass('bottom-expander')) {
                return;
            }
	    }

        $current.toggleClass('expanded');    
        
        //close all other expanded projects
        $('.project').each(function(i) {
            $(this).not($current).removeClass('expanded');       
        });
        
        //window.scrollTo(0, $current.offset().top);        
         
    });
	
	
	$('.project').hover(
      function() {
        $(this).toggleClass('focused');  
      }
    );
    

    //toggle contact
    $('#contact-form-expander').click(function(e) {
        e.preventDefault();
        $contact.toggleClass('expanded');       
        
        toggleContactHash($contact);
        
    });
    
    
    //toggle contact
    $('#footer-nav .contact').click(function(e) {
        $("html, body").animate({ scrollTop: 0 }, 800, function(){
            // SET A TIMEOUT...
            window.setTimeout(function(){
                if(!$contact.hasClass('expanded')){
                    $contact.addClass('expanded');
                }
                toggleContactHash($contact);
            }, 300);    
        });
        
        return false;
    });
    
    
    
    /*
     * Scroll to top
     */
    $('#scroll-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    
    
    
    /*
     * Contact form
     */
    
    //add some form security
    $.get("php/token.php", function(txt){
      $("#contact-form").append('<input type="hidden" id = "first_foil" name="first_foil" value="'+txt+'" />');
    });     

	$("#contact-form").submit(function(e){                                                          
            
            e.preventDefault();
            
            //console.log('submitting form');
            
            var str = $(this).serialize(),                    
                bPhpError = true,
                date = new Date(),
                time = date.getTime(),
                url = "php/contact.php",               
                testurl = "php/tes.html";
                
            //console.log(str);    
                       
            $.ajax({
               type: "POST",
               url: url + "?time=" + time,
               data: str,
               cache: false,
               success: function(data,status, obj)
               {
                   //console.log('ajax success');
                   //console.log(data); // show response from the php script.                  
                   
                   if(data !== 'OK'){
                       $('#form-status').html(data);
                   }
                   else{
                        $('#form-status').text('Your message has been sent...');
                   }
                   
                   
               },
               complete: function(data,status){
                   //console.log('this: ' , $(this));
                   $('#contact-form')[0].reset();
               },
               error: function(obj,status,error){
                   //console.log('ERROR!');                   
                   $('#form-status').text('An error occurred, please try again.');
               }
               
    
            });
            
            return false;
     });
     
     function toggleContactHash(element){      
         
        if(element.hasClass('expanded')){
             window.location.hash = 'contact';
        }
        else{            
            if($('html').hasClass('history')){
               history.replaceState('', document.title, window.location.pathname); 
            }
            else{
                window.location.hash = '';
            }
            
            
        }        
     }

	
});
