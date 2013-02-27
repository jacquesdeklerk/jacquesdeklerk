$(document).ready(function(){
	externalLinks();//in plugins.js
	
	$('.project-head, .images').click(function(e) {
	    e.preventDefault();
		$(this).parents('article').toggleClass('inactive').toggleClass('expanded');
	});
	
	//add expand symbol to headings
	$('.project-heading').prepend('<a href="#" class="expander"></a>');
	
	
	$('.project').hover(
      function() {
        $(this).toggleClass('focused');  
      }
    );
    
    
    //stylize contact   

    
    
    //toggle contact
    $('#contact-form-expander').click(function(e) {
        e.preventDefault();
        $(this).parents('#contact').toggleClass('expanded');
    });
	
});


