<?php
  // ! эта функция обязательно должна быть в самом верху, перед ней ничего не должно находиться
  session_start();

  if($_SESSION["auth"] == true) {
    echo json_encode(array("auth" => true));
  } else {
    echo json_encode(array("auth" => false));
  }

?>