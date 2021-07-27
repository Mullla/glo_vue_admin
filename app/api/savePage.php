<?php
  $_POST = json_decode(file_get_contents('php://input'), true);

  $file = $_POST['pageName'];
  $newHtml = $_POST['html'];

  $backups = json_decode(file_get_contents("../backups/backups.json"));
  if(!is_array($backups)) {
    $backups = [];
  }

  if($newHtml && $file) {
    $backup_filename = uniqid("backup_") . ".html";
    copy('../../' . $file, "../backups/" . $backup_filename);
    array_push($backups, ["page" => $file, "file" => $backup_filename, "time" => date("H:i:s d.m.y", strtotime("+3 hours"))]);
    file_put_contents("../backups/backups.json", json_encode($backups));

    file_put_contents('../../' . $file, $newHtml);
  } else {
    header('HTTP/1.0 400 Bad Request');
  }