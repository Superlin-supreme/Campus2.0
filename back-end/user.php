<?php

header('Content-Type:application/json');

//检测需调用的功能
if ($_SERVER["REQUEST_METHOD"] == "GET") {
	Logout();
} else if ($_SERVER["REQUEST_METHOD"] == "POST"){
	if( !isset($_POST['type']) || empty($_POST['type']) ) {
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else if ($_POST['type'] == "checkLogin") {
		checkLogin();
	}
	else if ($_POST['type'] == "Login") {
		Login();
	}
	else if ($_POST['type'] == "register") {
		register();
	}
	else if ($_POST['type'] == "loadmyinfo") {
		loadmyinfo();
	}
	else if ($_POST['type'] == "loadotherinfo") {
		loadotherinfo();
	}
	else if ($_POST['type'] == "changeinfo") {
		changeinfo();
	}
	else if ($_POST['type'] == "changepwd") {
		changepwd();
	}
}

function checkLogin(){
	if (!isset($_COOKIE['UID']) ) {
		echo '{"checklogin":false,"msg":"未有用户登录"}';
	}
	else {
		require_once "config.php";

		$query_uid =  "SELECT user_name, portraitURL FROM user WHERE UID = ".$_COOKIE['UID'];
		$result_info = mysqli_query($hd, $query_uid);
		$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);

		echo '{"checklogin":true,"UID":'. $_COOKIE['UID'] .',"msg":'. json_encode($info) .'}';

		mysqli_close($hd);
	}
}

function Login(){
	require_once "config.php";

	if (!isset($_POST['zh']) || empty($_POST['zh'])
		|| !isset($_POST['pwd']) || empty($_POST['pwd']))
	{
		echo '{"success":false, "msg":"服务器开了"}';
	}
	else {
		$zh = $_POST['zh'];
		$pwd = $_POST['pwd'];

		$query_st = "select * from user where email='$zh' or phone = '$zh' and pwd='$pwd' ";
		$result_st = mysqli_query($hd, $query_st);
		$row = mysqli_fetch_array($result_st, MYSQLI_ASSOC);

		if (!$row) {
			echo '{"success":false, "msg":"用户名或密码错误"}';
		}
		else {  
			setcookie('UID', $row["UID"], time()+3600);
			echo '{"success":true, "UID":'. $row["UID"] .'}';
		}
	}

	mysqli_close($hd);
}

function register(){
	// isset检测变量是否设置；empty判断值为否为空
	if( !isset($_POST['user_name']) || empty($_POST['user_name'])
		|| !isset($_POST['phone']) || empty($_POST['phone'])
		|| !isset($_POST['em']) || empty($_POST['em'])
		|| !isset($_POST['dept_name']) || empty($_POST['dept_name'])
		|| !isset($_POST['pwd']) || empty($_POST['pwd']) ) 
	{
		echo '{"success":false, "msg":"信息不全！"}';
	}
	else{
		include "config.php";

		$pwd = $_POST['pwd'];
		$user_name = $_POST['user_name'];
		$age = $_POST['age'];
		$sex = $_POST['sex'];
		$wechat = $_POST['wechat'];
		$phone = $_POST['phone'];
		$em = $_POST['em'];
		$dormitory = $_POST['dormitory'];
		$dept_name = $_POST['dept_name'];
		$portraitURL = $_POST['portraitURL'];

   	 	// $pwd = '12344';
   	 	// $user_name = '23232';
    	// $age = "0";
   		 // $sex = '0';
    	// $wechat = '22';
    	// $phone = '2434334';
    	// $em = '3434223344';
    	// $dormitory = '3434343';
    	// $dept_name = '国际商务英语学院';
    	// $portraitURL = 'girl.png';

		$sql1 = "select * from user where phone = '$phone'";
		$sql2 = "select * from user where email = '$em'";
		$sql_phone = mysqli_query($hd, $sql1);
		$sql_mail = mysqli_query($hd, $sql2);
		$sql_phone_num = mysqli_num_rows($sql_phone);
		$sql_mail_num = mysqli_num_rows($sql_mail);
	  	// mysqli_close($hd);
		if ($sql_phone_num > 0) {
			echo '{"success":false, "msg":"该号码已存在！"}';
		}
		else if($sql_mail_num > 0) {
			echo '{"success":false, "msg":"该邮箱已被注册！"}';
		}
		else  {                  
			$time = time();
    		//随机分配UID
			$f_id = date("Y",$time); 
        	//UID前6位
			$sql3 = "select *from department where dept_name = '$dept_name'";
			$sql_deptname = mysqli_query($hd, $sql3);
			$sql_dept_name = mysqli_fetch_array($sql_deptname);
			$Did = $sql_dept_name['CSID'];
			$srand = rand(1000,9999); 
       		 //UID后四位不重复
			$UID =  "$f_id$Did$srand";
			$sql_UID = "select * from user where UID = '$UID'";
        	//保证UID不重复
			if($sql_UID){
				$srand = rand(1000,9999); 
            //UID后四位不重复
				$UID =  "$f_id$Did$srand";
			}
        	// $query = "INSERT INTO user SET UID='$UID', pwd = '$pwd', user_name='$user_name', sex = '$sex' ,age='$age', wechat = '$wechat', phone = '$phone', email='$em', dormitory ='$dormitory', dept_name='$dept_name', portraitURL = '$portraitURL'";
			$query = "INSERT INTO user SET UID='$UID', pwd = '$pwd', user_name='$user_name', sex = '$sex' ,age='$age', wechat ='$wechat', phone = '$phone', email='$em', dormitory ='$dormitory' ,dept_name='$dept_name', portraitURL='$portraitURL' ";
			$result = mysqli_query($hd, $query);
			if ($result) {
				echo '{"success":true, "msg":"注册成功！"}';
			}
			else{
				echo '{"success":false, "msg":"后台开了点小差，请稍后重试！'.mysqli_error($hd).'"}';
			}
		}
		mysqli_close($hd);
	}
}

function Logout(){
	setcookie('UID', '', time()-3600);
	echo '{"success":true}';
}

function loadmyinfo(){
	if (!isset($_POST['UID']) || empty($_POST['UID'])) {
		echo '{"success":false, "msg":"抱歉，网络开了小差！"}';
	}
	else {
		$UID = $_POST['UID'];

		require_once "config.php";

		$query_uid =  "SELECT * FROM user WHERE UID = ".$UID;
		$result_info = mysqli_query($hd, $query_uid);
		$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);


		echo '{"success":true, "msg":'. json_encode($info) .'}';

		mysqli_close($hd);

	}
}

function loadotherinfo(){
	if (!isset($_POST['oUID']) || empty($_POST['oUID'])
		|| !isset($_POST['cUID']) || empty($_POST['cUID']) ) {
		echo '{"success":false, "msg":"抱歉，网络开了小差！"}';
	}
	else {
		$oUID = $_POST['oUID'];
		$cUID = $_POST['cUID'];

		require_once "config.php";

		$result_info = mysqli_query($hd, "SELECT user_name, portraitURL, phone, userLabel FROM user WHERE UID = '$oUID'");
		$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);

		$check_fri = mysqli_query($hd, "SELECT * FROM friend WHERE UID = '$cUID' AND friendUID = '$oUID' AND relation = 1 ");
		$check_fri_result = mysqli_fetch_array($check_fri, MYSQLI_ASSOC);

		if(!count($check_fri_result)){
			echo '{"success":true, "friend":false, "msg":'. json_encode($info) .'}';
		} else{
			echo '{"success":true, "friend":true, "msg":'. json_encode($info) .'}';
		}

		mysqli_close($hd);

	}
}

function changeinfo(){
	if(isset($_COOKIE['UID'])){

		include "config.php";

		$UID = $_COOKIE['UID'];
		$data_attr = $_POST['data_attr'];
		$val = $_POST['val'];

	   //修改资料
		$result =  mysqli_query($hd, "UPDATE user SET ".$data_attr." = '$val' WHERE UID='$UID' ");
		if ($result){
			echo '{"success":true, "msg":"修改成功！"}';
		}else {
			echo'{"success":false,"msg":"修改失败!"}';
		}

		mysqli_close($hd);
	}
	else echo '{"success":false, "msg":"请先登录！"}';
}

function changepwd(){
	if(isset($_COOKIE['UID'])){
		include "config.php";
		$UID = $_COOKIE['UID'];

	   //修改密码
		$pwd = $_POST['pwd'];
		$newpwd = $_POST['newpwd'];

		if (($pwd!="")&&($newpwd!="")&&($pwd!=$newpwd)) {
			$sql1 = "SELECT * FROM user WHERE UID = '$UID' AND pwd = '$pwd'";
			$sql_pwd = mysqli_query($hd, $sql1);
			$sql_pwd_num = mysqli_num_rows($sql_pwd);

			if($sql_pwd_num > 0 ){
				mysqli_query($hd,"UPDATE user SET pwd=$newpwd WHERE UID='$UID'");
				echo '{"success":true, "msg":"修改成功！"}';
			}
			else {
				echo '{"success":false, "msg":"密码不正确！"}';
			}
		}else if($pwd==""){
			echo'{"success":false, "msg":"密码不能为空！"}';
		}else if($newpwd==""){
			echo'{"success":false, "msg":"新密码不能为空!"}';
		}else {
			echo'{"success":false,"msg":"密码不能相同!"}';
		}

		mysqli_close($hd);
	}
	else {
		echo '{"success":false, "msg":"请先登录！"}';
	}
}


?>