<?php

// Only allow GET requests with a query.
if ($_SERVER['REQUEST_METHOD'] != 'GET' || !isset($_SERVER['QUERY_STRING'])) {
  exit('Not allowed.');
}

// Check token and other query variables.
$query = [];
parse_str($_SERVER['QUERY_STRING'], $query);
$token = 'b600b229d30a4512fe48f9ae1d4f46cef38541b898ec89f792b1aad26030a421';
if (empty($query) || $query['token'] !=  $token || !isset($query['type']) || !isset($query['button'])) {
  exit('Not allowed.');
}

$button = 'Okänd';
switch ($query['button']) {
  case 'white':
    $button = 'Sängen';
    break;

  case 'green':
    $button = 'Hallen';
    break;

  case 'blue':
    $button = 'Vardagsrum';
    break;
}

$to = 'fredrik@xdeb.org, karjo@mac.com, annikasfamilj@me.com';
$from = $sender = 'ragnvald@xdeb.org';
$name = 'Ragnvald Jonsson';

switch ($query['type']) {
  case 'notice':
    $subject = "[Pappa - $button] Allt är väl";
    $message = "Pappa har tryckt på knappen $button för att tala om att allt är väl.";
    break;

  case 'alarm':
    $subject = "[Pappa - $button] !!!Behöver hjälp!!!";
    $message = "Pappa har tryckt på knappen $button och behöver hjälp.";
    break;

  default:
    exit('Not valid.');
}

// Construct the mail with headers.
$headers = [
  'From'                      => "$name <$from>",
  'Sender'                    => $sender,
  'Return-Path'               => $sender,
  'MIME-Version'              => '1.0',
  'Content-Type'              => 'text/plain; charset=UTF-8; format=flowed; delsp=yes',
  'Content-Transfer-Encoding' => '8Bit',
  'X-Mailer'                  => 'PHP7',
];
$mime_headers = [];
foreach ($headers as $key => $value) {
  $mime_headers[] = "$key: $value";
}
$mail_headers = join("\n", $mime_headers);

// Send the mail, suppressing errors and setting Return-Path with the "-f" option.
@mail($to, $subject, $message, $mail_headers, '-f' . $sender);
exit;
