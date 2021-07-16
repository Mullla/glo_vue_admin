<?php
  $_POST = json_decode(file_get_contents('php://input'), true);


  $file_to_remove = "../../" . $_POST["name"];

  if(file_exists($file_to_remove)) {
    unlink($file_to_remove);
  } else {
    header("HTTP/1.0 400 Bad Reguest");
  }