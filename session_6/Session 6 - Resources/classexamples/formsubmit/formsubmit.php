<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title> Mobile App Development</title>
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.3/jquery.mobile.min.css" />
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.3/jquery.mobile.min.js"></script>
</head>
<body>
	<div data-role="page" id="main">
		<div data-role="header">
			<h1>Form Submission</h1>
		</div>
		<div data-role="content">
			<p>Welcome back:
			<?php 
				$space =  " ";
				echo $_POST["fname"]; 
				echo $space;
				echo $_POST["lname"]; 
			?>
			</p>
		</div>
		<div data-role="footer" data-position="fixed">
			<h4>Footer Navigation</h4>
		</div>
	</div>
</body>
</html>