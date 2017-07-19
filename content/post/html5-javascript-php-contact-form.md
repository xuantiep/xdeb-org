---
title: "A HTML5+PHP+JavaScript contact form with spam protection"
date: 2017-06-24T07:55:21+02:00
lastmod: 2017-06-24T07:55:21+02:00
author: "Fredrik Jonsson"
tags: ["php", "jquery", "javascript", "development"]

---

Setting out to create a simple contact form turned out to involve more work than I anticipated. I need it for one of my new static sites. The examples I found was to old, lacking spam protection and/or relied on multiple/large libraries.

A modern option would be to use one of the many cloud services for forms of different kinds but I prefer to run things on my own server. I run my own mail-server since well over a decade.

These are the features I wanted for my contact form:

* Local and lite weight.
* HTML5 form with placeholders, required field indicators and validation.
* Some decent spam protection, but no captcha.
* Status messages informing the user of success as well as error on sending the messages.
* Use the PHP mail() command for sending since that is built in to most servers, including my own.
* Make the PHP script reasonable secure.
* Set Sender and Return-Path so SPF checks do not complain.

I started by looking how the core Drupal 7 contact module handle this. That is what I use on all the Drupal sites I build and I got a lot of the PHP code from there.

For spam protection I looked at the Drupal modules [Honeypot](https://www.drupal.org/project/honeypot) and especially [Antibot](https://www.drupal.org/project/antibot). Honeypot uses a common fake hidden input field among other things and I have added that to my solution as well. Antibot has a really neat JavaScript antispam solution. It simply changes the action path until the user have moved the mouse or pressed the tab or enter key. This makes the contact form depend on JavaScript but that is well worth it I believe.

The JavaScript also takes care of displaying the status messages as well as hiding the "You must have Javascript…" message that is shown if the browser has it turned off. It also adds a "js-submitted" class to the form on submit.

A few lines of CSS makes the HTML5 form display when fields are valid or invalid after the user has started typing in a field or has tried to submit the form with invalid fields.

In the <a href="https://codepen.io/frjo/pen/pwWoEd/">Codepen for this Contact form </a> you can play around with it. The code is also below.

The HTML form:

~~~~ html
<p class="contact-no-js message">You must have Javascript enabled to use this contact form.</p>
<p class="contact-submitted hidden">Your message was sent.</p>
<p class="contact-error hidden">There was an error sending the message.</p>

<form class="contact-form hidden" action="#" method="post" accept-charset="UTF-8">
  <label for="edit-name">Name</label>
  <input type="text" id="edit-name" name="name" placeholder="Your name" tabindex="1" required autofocus><span></span>
  <label for="edit-mail">E-mail address</label>
  <input type="email" id="edit-mail" name="email" placeholder="Your e-mail address" tabindex="2" required><span></span>
  <input type="text" id="edit-url" class="hidden" name="url" placeholder="Skip if you are a human">
  <label for="edit-subject">Subject</label>
  <input type="text" id="edit-subject" name="subject" placeholder="A short subject" tabindex="3" required><span></span>
  <label for="edit-message">Message</label>
  <textarea id="edit-message" name="message" rows="5" placeholder="The messages goes here…" tabindex="4" required></textarea><span></span>
  <button type="submit" name="submit" class="form-submit" disabled>Send message</button>
</form>
~~~~

The CSS (SCSS) styling:

~~~~ css
.contact-form {
  input,
  textarea {
    margin-bottom: .5rem;
    font: inherit;
    width: 92%;

    &:required+span::after {
      content: ' *';
      color: red;
      vertical-align: top;
    }

    &:not(:placeholder-shown):valid {
      background-color: #f4feee;
    }

    &:not(:placeholder-shown):invalid {
      background-color: #fff0f0;
    }
  }

  label,
  button {
    display: block;
  }
}

.js-submitted {
  input,
  textarea {
    &:valid {
      background-color: #f4feee;
    }

    &:invalid {
      background-color: #fff0f0;
    }
  }
}
~~~~

The JavaScript (jQuery):

~~~~ js
(function ($) {

    'use strict';

    // Contact form.
    $('.contact-form').each(function() {
      var $contact_form = $(this);
      var $contact_button = $contact_form.find('.form-submit');
      var contact_action = '/php/contact.php';

      // Display the hidden form.
      $contact_form.removeClass('hidden');
      // Remove the "no javascript" messages
      $('.contact-no-js').detach();

      // Wait for a mouse to move, indicating they are human.
      $('body').mousemove(function() {
        // Unlock the form.
        $contact_form.attr('action', contact_action);
        $contact_button.attr('disabled', false);
      });

      // A tab or enter key pressed can also indicate they are human.
      $('body').keydown(function(e) {
        if ((e.keyCode == 9) || (e.keyCode == 13)) {
          // Unlock the form.
          $contact_form.attr('action', contact_action);
          $contact_button.attr('disabled', false);
        }
      });

      // Mark the form as submitted.
      $contact_button.on('click touchstart MSPointerDown', function() {
        $contact_form.addClass('js-submitted');
      });

      // Display messages.
      if (location.search.substring(1) != '') {
        switch (location.search.substring(1)) {
          case 'submitted':
            $('.contact-submitted').removeClass('hidden');
            break;

          case 'error':
            $('.contact-error').removeClass('hidden');
            break;
        }
      }
    });

})(jQuery);
~~~~

Below is the PHP script that sends the messages. You need to replace "info@example.com" with a real address but otherwise it should work on most Unix based servers. I run it on Debian GNU/Linux.

[PHP script for contact form](https://gist.github.com/frjo/23e45ec5e690d90f6bfcaca06873fd73) (GitHub gist):

~~~~ php
<?php

// Set address that submission should be sent to.
// Also set sender/return path header to this address to avoid SPF errors.
$to = $sender = "info@example.com";

$error = false;
$success = false;

// Check that referer is local server.
if (!isset($_SERVER['HTTP_REFERER']) || (parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) != $_SERVER['SERVER_NAME'])) {
  exit('Direct access not permitted');
}

// Check that this is a post request.
if ($_SERVER['REQUEST_METHOD'] != 'POST' || empty($_POST)) {
  $error = true;
}

// Check if fake url field is filled in, i.e. spam bot.
if (!empty($_POST['url'])) {
  $error = true;
}

// Check that e-mail address is valid.
if ((bool) filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL)) {
  $email = trim($_POST['email']);
}
else {
  $error = true;
}

if (!$error) {
  // Construct the mail with headers.
  $name = _contact_clean_str($_POST['name'], ENT_QUOTES, true);
  $subject = _contact_clean_str($_POST['subject'], ENT_NOQUOTES, true);
  $subject = "[Website feedback] $subject";
  $message = _contact_clean_str($_POST['message'], ENT_NOQUOTES);
  $lines = explode("\n", $message);
  array_walk($lines, '_contact_ff_wrap');
  $message = implode("\n", $lines);
  $headers = [
    'From'                      => "$name <$email>",
    'Sender'                    => $sender,
    'Return-Path'               => $sender,
    'MIME-Version'              => '1.0',
    'Content-Type'              => 'text/plain; charset=UTF-8; format=flowed; delsp=yes',
    'Content-Transfer-Encoding' => '8Bit',
    'X-Mailer'                  => 'Hugo - Zen',
  ];
  $mime_headers = [];
  foreach ($headers as $name => $value) {
    $mime_headers[] = "$name: $value";
  }
  $mail_headers = join("\n", $mime_headers);

  // Send the mail, suppressing errors and setting Return-Path with the "-f" option.
  $success = @mail($to, $subject, $message, $mail_headers, '-f' . $sender);
}

$status = $success ? 'submitted' : 'error';
$contact_form_url = strtok($_SERVER['HTTP_REFERER'], '?');

// Redirect back to contact form with status.
header('Location: ' . $contact_form_url . '?' . $status, TRUE, 302);
exit;

function _contact_ff_wrap(&$line) {
  $line = wordwrap($line, 72, " \n");
}

function _contact_clean_str($str, $quotes, $strip = false) {
  if ($strip) {
    $str = strip_tags($str);
  }
  return htmlspecialchars(trim($str), $quotes, 'UTF-8');
}
~~~~
