<?php

$err = false;

if (empty($_POST['email'])) {
    $err = 'email is required';
} else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $err = 'Invalid email format';
} else {

    $userEmail = $_POST['email'];
}

if (empty($_POST['message'])) {
    $err = 'message is required';
} else {

    $userMessage = $_POST['message'];
}



if (!$err) {
    // submit the form 

    $to = 'mamyrbas@gmail.com';
    $subject = 'PIPERNET contact form';
    $body = '';

    $body .= 'From: ' . $userEmail . '\r\n';
    $body .= 'Message: \r\n' . $userMessage . '\r\n';


    mail($to, $subject, $body);
} else {
    echo 'err: ' . $err;
}
