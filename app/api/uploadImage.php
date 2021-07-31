<?php
  session_start();

  if ($_SESSION["auth"] != true) {
    header('HTTP/1.0 403 Forbidden');
    die;
  }

  if (file_exists($_FILES['image']['tmp_name']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
    // разрезание строки по символу '/'
    $file_ext = explode('/', $_FILES['image']['type'])[1];
    $file_name = uniqid('img_') . '.' . $file_ext;

    move_uploaded_file($_FILES['image']['tmp_name'], '../../img/' . $file_name);

    echo json_encode(array('src' => $file_name));
  }
