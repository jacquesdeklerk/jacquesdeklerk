<?php
    //These 2 lines are needed to make sure that the
    //script output is not cached and the script runs in
    //its entirety for each request
    session_start();
    //header("Cache-control: private");
    # Always modified
    header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
    header("Expires: " . gmdate("D, d M Y H:i:s") . " GMT");
    # HTTP/1.1
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    
    # HTTP/1.0
    header("Pragma: no-cache");
    
    require_once 'config.php';
    
    $proceed = false;
    $seconds = 60*30;
    
    //error_reporting (E_ALL ^ E_NOTICE);
    
    $post = (!empty($_POST)) ? true : false;
    

    if($post)
    {
        $name = stripslashes($_POST['form-name']);
        $email = trim($_POST['form-email']);
        $message = stripslashes($_POST['form-text']);

        
        $form_folly = $_POST['form-folly'];
        
        //echo $disclaimerCheck;
        
        $error = '';
        
        $name_error = '';
        $email_error = '';
        $message_error = '';

        
        $name_label = 'Name';
        $telnr_label = 'Contact Number';
        $email_label = 'Email';
        $message_label = 'Brief Description of Legal Enquiry';
        
        $name_alert = 'Please Enter Your Name';
        $telnr_alert = 'Please Enter Your Contact Number';
        $email_alert = 'Please Enter a Valid Email Address';
        $message_alert = 'Please Enter Your Message';
        
        if(isset($_POST['first_foil']) && isset($_COOKIE['token']) && $_COOKIE['token'] == md5('moenie peuter'.$_POST['first_foil'])) 
        {
        	$proceed = true;
        }
        
        if(!$proceed) 
        { 
        	$error .= 'Form processing halted for suspicious activity.<br />';
        }
        
        if(((int)$_POST['first_foil'] + $seconds) < mktime()) 
        {
        	$error .= 'Too much time elapsed.<br />';
        }
                
        // Check second foil
        if(!$form_folly == '')
        {
        	$error .= "Are you a spam bot?";
        }
   
        if(!$error && !$name_error && !$email_error && !$message_error)
        {
        	
        	$msg = "$message\n\n".
        	"From: $name\n".
        	"Email Address: $email\n";
        	
        	$subject = "Email from " . DOMAIN;
        	$mail = mail(CONTACT_EMAIL, $subject, $msg,
             "From: ".$name." <".$email.">\r\n"
            ."Reply-To: ".$email."\r\n"
            ."X-Mailer: PHP/" . phpversion());
        
        
        	if($mail){
        		echo 'OK';
        	}
        	
    	}
    	else
    	{
    		echo $name_error.' '.$email_error.' '.$message_error.' '.$error;
    	}
    
    }else
    {
    	echo $name_error.' '.$email_error.' '.$message_error.' '.$error;
    }
?>