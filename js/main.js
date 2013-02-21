$(document).ready(function(){
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
	
});
