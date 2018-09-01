<?php

// header('Content-Type:application/json');

//设置时区
date_default_timezone_set('PRC');

//检测需调用的功能
if( !isset($_POST['type']) || empty($_POST['type']) ) {
	echo '{"success":false, "msg":"服务器开了小差！"}';
}
else if ($_POST['type'] == "sendmsg") {
	sendmsg();
}
else if ($_POST['type'] == "loadmsg") {
	loadmsg();
}
else if ($_POST['type'] == "checkmsg") {
	checkmsg();
}
else if ($_POST['type'] == "checkallnum") {
	checkallnum();
}


function sendmsg(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser'])
	 	|| !isset($_POST['friendUser']) || empty($_POST['friendUser'])
	 	|| !isset($_POST['content']) || empty($_POST['content']) ) {
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		$fUser = $_POST['friendUser'];
		$content = $_POST['content'];
		$datetime = new DateTime;
		$time = $datetime->format('Y-m-d H:i:s');

		require_once"config.php";

		$result = mysqli_query($hd, "INSERT INTO msg SET UID1 ='$cUser', UID2 = '$fUser', content ='$content', time ='$time'");

		if ($result) {
			echo '{"success":true}';
		}
		else {
			echo '{"success":false, "msg":"sendfalse"}';
		}


		mysqli_close($hd);
	}
}

function loadmsg() {
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser'])
	 	|| !isset($_POST['friendUser']) || empty($_POST['friendUser']) ) {
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		$fUser = $_POST['friendUser'];
		// $cUser = '20180076205';
		// $fUser = '20181004917';

		require_once"config.php";

		$result = mysqli_query($hd, "SELECT * FROM msg WHERE (UID1 ='$cUser' and UID2 = '$fUser') or (UID1 ='$fUser' and UID2 = '$cUser')");

		$msgArr = mysqli_fetch_all($result, MYSQLI_ASSOC);
		$arrlength = count($msgArr);

		$result_info = mysqli_query($hd, "SELECT user_name, portraitURL FROM user WHERE UID = ".$fUser);		
		$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);

		if (!$arrlength) {
			echo '{"success":false, "fUser":'.json_encode($info).', "msg":"no_msg"}';
		}
		else {
			for ($i = 0; $i < $arrlength; $i++) {
				if ($msgArr[$i]["readed"]==0 && $msgArr[$i]["UID2"] == $cUser){
					$mIndex = $msgArr[$i]["msgIndex"];
					mysqli_query($hd, "UPDATE msg SET readed = 1 WHERE msgIndex = '$mIndex'");
				}				
			}
			echo '{"success":true, "fUser":'.json_encode($info).', "msg":'. json_encode($msgArr) .'}';
		}


		mysqli_close($hd);
	}
}

function checkmsg() {
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser'])
	 	|| !isset($_POST['friendUser']) || empty($_POST['friendUser']) ) {
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		$fUser = $_POST['friendUser'];
		// $cUser = '20180076205';
		// $fUser = '20181004917';

		require_once"config.php";

		$result = mysqli_query($hd, "SELECT * FROM msg WHERE UID1 ='$fUser' and UID2 = '$cUser' and readed = 0");

		$msgArr = mysqli_fetch_all($result, MYSQLI_ASSOC);

		$arrlength = count($msgArr);

		if (!$arrlength) {
			echo '{"success":false, "msg":"no_new_msg"}';
		}
		else {
			for ($i = 0; $i < $arrlength; $i++) {
				if ($msgArr[$i]["readed"]==0){
					$mIndex = $msgArr[$i]["msgIndex"];
					mysqli_query($hd, "UPDATE msg SET readed = 1 WHERE msgIndex = '$mIndex'");
				}				
			}
			echo '{"success":true, "msg":'. json_encode($msgArr) .'}';
		}


		mysqli_close($hd);
	}
}

function checkallnum(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) ) {
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		// $cUser = '20180076205';
		// $fUser = '20181004917';

		require_once"config.php";

		$result = mysqli_query($hd, "SELECT * FROM msg WHERE UID2 = '$cUser' and readed = 0");

		$msgArr = mysqli_fetch_all($result, MYSQLI_ASSOC);

		$arrlength = count($msgArr);

		echo '{"success":true, "msg":'. $arrlength .'}';

		mysqli_close($hd);
	}
}

?>