<?php
require_once 'connect.php';
if (isset($_POST['submit'])){
	$username = $_POST['username'];
	$password = $_POST['password'];

$sql = "SELECT * FROM `user` WHERE username='$username' and password='$password' and active=1";
$result = mysql_query($sql) or die(mysql_error());
$count = mysql_num_rows($result);
if ($count == 1){
	session_register($username);
         $_SESSION['login_user'] = $username;
         header("location: main.php");
}else {
	  echo '<script type="text/javascript">',
         'confirm("Login Failed!");',
         '</script>'
         ;
}
}
?>

<html lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>SYX.NET</title>
  <link rel="stylesheet" href="css/style.css">
  <!--[if lt IE 9]><script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
</head>
<body>
  <div>
    <h1 class="Title">SYX.NET</h1>
  </div>
  <div id="Box">
  <form method="post" action="" class="login" name="login_form">
    <p>
      <label>Username:</label>
      <input type="text" name="username" />
    </p>

    <p>
      <label>Password:</label>
      <input type="password" name="password" id="password"/>
    </p>


    <p class="login-submit">
      <button type="submit" name ="submit" class="login-button">Login</button>
    </p>

    <p class="forgot-password"><a href="index.html">Forgot your password?</a></p>
  </form>
  </div>

  <section class="Else">
    <p>Looking for Zirosyx.me ?</p>
    <p>Click <a href="http://zirosyx.me">here</a>.</p>
    <p>Looking for RemoteBot.tech instead ?</p>
    <p>Look around <a href="http://remotebot.tech">here</a>!</p>
  </section>

  <section class="FootNote"><p><sub>Copyright 2016 © Syx. All rights reserved. See <a href="index.html">Disclaimer</a>.</p></sub>
  </section>
  </body>
</html>
