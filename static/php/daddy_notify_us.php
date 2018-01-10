<?php

$query = [];

if (isset($_SERVER['QUERY_STRING'])) {
  parse_str($_SERVER['QUERY_STRING'], $query);
}

// Check token and other query variables.
$token = 'b600b229d30a4512fe48f9ae1d4f46cef38541b898ec89f792b1aad26030a421';
if (empty($query) || $query['token'] !=  $token || !isset($query['type']) || !isset($query['button'])) {
  exit('Not allowed.');
}

$type = $query['type'];
$button = $query['button'];

//$to = 'fredrik@xdeb.org, karina@combonet.se, annika@combonet.se';
$to = 'fredrik@xdeb.org, fredrik@combonet.se';
$from = $sender = 'ragnvald@xdeb.org';
$name = 'Ragnvald Jonsson'


switch ($type) {
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
  'From'                      => "$name <$email>",
  'Sender'                    => $sender,
  'Return-Path'               => $sender,
  'MIME-Version'              => '1.0',
  'Content-Type'              => 'text/plain; charset=UTF-8; format=flowed; delsp=yes',
  'Content-Transfer-Encoding' => '8Bit',
  'X-Mailer'                  => 'PHP7',
];
$mime_headers = [];
foreach ($headers as $name => $value) {
  $mime_headers[] = "$name: $value";
}
$mail_headers = join("\n", $mime_headers);

// Send the mail, suppressing errors and setting Return-Path with the "-f" option.
@mail($to, $subject, $message, $mail_headers, '-f' . $sender);
exit;
