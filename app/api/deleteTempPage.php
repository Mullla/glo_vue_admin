<?php
  $file_to_remove = "../../_temp.html";

  if(file_exists($file_to_remove)) {
    unlink($file_to_remove);
  } else {
    header("HTTP/1.0 400 Bad Reguest");
  }