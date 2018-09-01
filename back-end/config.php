<?php

$server = "localhost";

$user = "root";

$pwd = ""; 

$hd = mysqli_connect($server, $user, $pwd);

if ($hd->connect_error) {
    die('Connect Error (' . $hd->connect_errno . ') '
            . $hd->connect_error);
}

$db_name = "test";

$db = mysqli_select_db($hd, $db_name);

mysqli_query($hd, "SET NAMES UTF8");

?>