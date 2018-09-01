<?php

header('Content-Type:application/json');

//检测需调用的功能
if ($_SERVER["REQUEST_METHOD"] == "GET") {
	logout();
} else if ($_SERVER["REQUEST_METHOD"] == "POST"){
	if( !isset($_POST['type']) || empty($_POST['type']) ) {
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else if ($_POST['type'] == "superlogin") {
		superlogin();
	}
	else if ($_POST['type'] == "checkLogin") {
		checkLogin();
	}
	else if ($_POST['type'] == "loaduser") {
		loaduser();
	}
	else if ($_POST['type'] == "deluser") {
		deluser();
	}
	else if ($_POST['type'] == "delpost") {
		delpost();
	}
}

function superlogin(){
	if (!isset($_POST['zh']) || empty($_POST['zh'])
		|| !isset($_POST['pwd']) || empty($_POST['pwd']))
	{
		echo '{"success":false, "msg":"服务器出了小差"}';
	}
	else {
		
		require_once "config.php";

		$zh = $_POST['zh'];
		$pwd = $_POST['pwd'];

		// $zh = 'yuge@qq.com';
		// $pwd = '123456';

		$result = mysqli_query($hd, "SELECT * from manager where phone = '$zh' or email = '$zh' and pwd ='$pwd'");
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

		if (!$row) {
			echo '{"success":false, "msg":"用户名或密码错误"}';
		}
		else {  
			setcookie('MID', $row["MID"], time()+3600);
			echo '{"success":true, "MID":'. $row["MID"] .'}';
		}

		mysqli_close($hd);
	}
}

function checkLogin(){
	if (!isset($_COOKIE['MID']) ) {
		echo '{"checklogin":false,"msg":"未有用户登录"}';
	}
	else {
		require_once "config.php";

		$query_uid =  "SELECT admin_name FROM manager WHERE MID = ".$_COOKIE['MID'];
		$result_info = mysqli_query($hd, $query_uid);
		$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);

		echo '{"checklogin":true,"MID":'. $_COOKIE['MID'] .',"msg":'. json_encode($info) .'}';

		mysqli_close($hd);
	}
}

function Logout(){
	setcookie('MID', '', time()-3600);
	echo '{"success":true}';
}

function loaduser(){
	require_once "config.php";

	$result_info = mysqli_query($hd, "SELECT * FROM user");

	if ($result_info) {
		$info = mysqli_fetch_all($result_info, MYSQLI_ASSOC);
		echo '{"success":true, "msg":'. json_encode($info) .'}';
	}

	else{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}

	mysqli_close($hd);
}

function deluser(){
	$uid = $_POST['UID'];
   // $uid = '20182108552';

   require_once "config.php";
   $query_st1 = "DELETE FROM user WHERE UID='$uid'";
   $query_st2 = "DELETE FROM post WHERE UID='$uid'";
   $query_st5 = "UPDATE post set aUID='NULL',status='0' WHERE aUID='$uid'";
   $query_st3 = "DELETE FROM re_post WHERE UID='$uid' or toUID='$uid'";
   $query_st4 = "DELETE FROM friend WHERE UID='$uid' or friendUID='$uid'";
   $result_st1 = mysqli_query($hd, $query_st1);
   $result_st2 = mysqli_query($hd, $query_st2);
   $result_st3 = mysqli_query($hd, $query_st3);
   $result_st4 = mysqli_query($hd, $query_st4);
   $result_st5 = mysqli_query($hd, $query_st5);

   if($result_st1&&$result_st2&&$result_st3&&$result_st4){
   	    $result_order1 = mysqli_query($hd, 'ALTER TABLE post DROP Pindex');
   	    $result_order2 = mysqli_query($hd, 'ALTER TABLE re_post DROP Rindex');
   	    $result_order3 = mysqli_query($hd, 'ALTER TABLE friend DROP findex');
   	    if($result_order1&&$result_order2&&$result_order3){
   	    	mysqli_query($hd, 'ALTER TABLE post ADD Pindex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD INDEX (Pindex)');
   	    	mysqli_query($hd, 'ALTER TABLE re_post ADD Rindex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD INDEX (Rindex)');
   	    	mysqli_query($hd, 'ALTER TABLE friend ADD findex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (findex)'); 	
   	    }
		echo '{"success":true, "msg":"删除用户及其所有信息成功"}';
	}
	else{
		echo '{"success":false, "msg":"用户不存在"}';
	}
	mysqli_close($hd);
}

function delpost(){
	$pid = $_POST['PID'];
   // $pid = '1806194666';

	require_once "config.php";

	$query_st1 = "DELETE FROM post WHERE PID='$pid'";
	$query_st2 = "DELETE FROM re_post WHERE PID='$pid'";
	$result_st1 = mysqli_query($hd, $query_st1);
	$result_st2 = mysqli_query($hd, $query_st2);

	if($result_st1&&$result_st2){
		$result_del1 = mysqli_query($hd, 'ALTER TABLE post DROP Pindex');
		$result_del2 = mysqli_query($hd, 'ALTER TABLE re_post DROP Rindex');
		if ($result_del1&&$result_del2) {
			mysqli_query($hd, 'ALTER TABLE post ADD Pindex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD INDEX (Pindex)');
			mysqli_query($hd, 'ALTER TABLE re_post ADD Rindex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD INDEX (Rindex)');
		}
		echo '{"success":true, "msg":"删除订单成功!"}';
	}
	else{
		echo '{"success":false, "msg":"删除订单失败!"}';
	}
	mysqli_close($hd);
}


?>