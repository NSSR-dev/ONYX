<?php
$connection = mysql_connect('192.168.0.100', 'root', 'Akatsuki06');
if (!$connection){
    die("Database Connection Failed" . mysql_error());
}
$select_db = mysql_select_db('login');
if (!$select_db){
    die("Database Selection Failed" . mysql_error());
}
