$(document).ready(function(){

	//expand contact section if hash is set
	if(window.location.hash === "#contact"){
	     $('#contact').addClass('expanded');
	}
	
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
    

    //toggle contact
    $('#contact-form-expander').click(function(e) {
        var location = 
        e.preventDefault();
        $('#contact').toggleClass('expanded');
       
        
        if($('#contact').hasClass('expanded')){
             window.location.hash = 'contact';
        }
        else{
            window.location.hash = '';
        }
        
    });
    
    
    //toggle contact
    $('#footer-nav .contact').click(function(e) {
        //e.preventDefault();
        
        if(!$('#contact').hasClass('expanded')){
            $('#contact').addClass('expanded');
        }
    });
    
    /*
     * Scroll to top
     */
    $('#scroll-top').click(function(e) {
        e.preventDefault();
        scrollTo(0);
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
            
            console.log('submitting form');
            
            var str = $(this).serialize(),                    
                bPhpError = true,
                date = new Date(),
                time = date.getTime(),
                url = "php/contact.php",               
                testurl = "php/tes.html";
                
            console.log(str);    
                       
            $.ajax({
               type: "POST",
               url: url + "?time=" + time,
               data: str,
               cache: false,
               success: function(data,status, obj)
               {
                   console.log('ajax success');
                   console.log(data); // show response from the php script.
                   
                   $('#form-status').text('Your message has been sent...');
                   
                   $('#form-status').html(data);
                   
                   
               },
               complete: function(data,status){
               },
               error: function(obj,status,error){
                   console.log('ERROR!');
                   console.log(status); // show response from the php script.
                   
                   $('#form-status').text('An error occurred, please try again.');
               }
               
    
            });
            
            return false;
     });

	
});


