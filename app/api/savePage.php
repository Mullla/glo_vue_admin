<?php
  $_POST = json_decode(file_get_contents('php://input'), true);

  $file = '../../' . $_POST['pageName'];
  $newHtml = $_POST['html'];

  if($newHtml && $file) {
    file_put_contents($file, $newHtml);
  } else {
    header('HTTP/1.0 400 Bad Request');
  }