<?php

header('Content-Type:application/json');

//检测需调用的功能
if( !isset($_POST['type']) || empty($_POST['type']) ) {
	echo '{"success":false, "msg":"服务器开了小差！"}';
}
else if ($_POST['type'] == "sendpost") {
	sendpost();
}
else if ($_POST['type'] == "countpost") {
	countpost();
}
else if ($_POST['type'] == "delpost") {
	delpost();
}
else if ($_POST['type'] == "endpost") {
	endpost();
}
else if ($_POST['type'] == "loadpost") {
	loadpost();
}
else if ($_POST['type'] == "loaduserpost") {
	loaduserpost();
}
else if ($_POST['type'] == "acceptpost") {
	acceptpost();
}


function formatTime($date) {  
	date_default_timezone_set('PRC');
    $str = '';  
    $timer = strtotime($date);  
    $diff = $_SERVER['REQUEST_TIME'] - $timer;  
    $day = floor($diff / 86400);  
    $free = $diff % 86400;  
    if($day > 0) { 
    	return date('m',$timer).'月'.date('d', $timer).'日';
    }else{  
        if($free>0){  
            $hour = floor($free / 3600);  
            $free = $free % 3600;  
                if($hour>0){  
                    return $hour."小时前";  
                }else{  
                    if($free>0){  
                        $min = floor($free / 60);  
                        $free = $free % 60;  
                        if($min>0){  
                            return $min."分钟前";  
                        }else{  
                            return '刚刚';  
                        }  
                    }else{  
                        return '刚刚';  
                    }  
               }  
       }else{  
           return '刚刚';  
       }  
    }  
}  

function sendpost(){
	//检测发送内容
	if(!isset($_POST['cUID']) || empty($_POST['cUID'])
		|| !isset($_POST['cUserName']) || empty($_POST['cUserName'])
		|| !isset($_POST['newhosttitle']) || empty($_POST['newhosttitle'])
		|| !isset($_POST['newhostctt']) || empty($_POST['newhostctt']))
	{
		echo '{"success":false, "msg":"信息不全！"}';
	}
	else{
		// 获取数据
		$UID = $_POST['cUID'];
		$user_name = $_POST['cUserName'];
		$title = $_POST['newhosttitle'];
		$content = $_POST['newhostctt'];
		$status = $_POST['status'];
		date_default_timezone_set('PRC');
		$datetime = new DateTime;
		$time1 = $datetime->format('Y-m-d H:i:s');

		//测试
		// $UID = '20180009738';
		// $user_name = '超哥';
		// $title = '我嘻嘻嘻嘻嘻';
		// $content = '哈哈哈哈哈';
		// $status = 0;
		// date_default_timezone_set('PRC');
		// $datetime = new DateTime;
		// $time1 = $datetime->format('Y-m-d H:i:s');

		//生成PID
		$time2 = time();
		$f_pid = date("ymd",$time2);
		$srand = rand(1000,9999);
		$PID = "$f_pid$srand";

		include "config.php";

		$sql_pid = "SELECT * FROM post WHERE PID = '$PID'";
		$result = mysqli_query($hd, $sql_pid);
		$pid_num= mysqli_num_rows($result);
		if( $pid_num == 0 ){
			$PID = "$f_pid$srand";
			$query1 = "INSERT INTO post SET PID='$PID', UID= '$UID',   user_name='$user_name', title = '$title' ,content ='$content', status = '$status', time ='$time1'";
			$result1 = mysqli_query($hd, $query1);
			if($result1){
				echo '{"success":true, "msg":"发帖成功！"}';
			}else{
				echo '{"success":false, "msg":"发帖失败！"}';
			}

		}else {
			echo '{"success":false, "msg":"重复！"}';
		}

		mysqli_close($hd);
	}	
}

function countpost(){
	require_once "config.php";

	$count_result = mysqli_query($hd, "SELECT count(PID) AS num FROM post");
	if ($count_result) {
		$row = mysqli_fetch_array($count_result, MYSQLI_ASSOC);
		echo '{"success":true, "msg":'. $row["num"] .'}';
	}
	else {
		echo '{"success":false, "msg":"抱歉，服务器开了小差！"}';
	}

	mysqli_close($hd);
}

function delpost(){
	if(!isset($_POST['PID']) || empty($_POST['PID'])){
		echo '{"success":false, "msg":"抱歉!服务器出了小差!"}';
	}
	else {
		$tie = $_POST['PID'];

		require_once "config.php";

		$query_st = "DELETE FROM post WHERE PID='$tie'";
		$result_st = mysqli_query($hd, $query_st);
		if($result_st){
			$result_del = mysqli_query($hd, 'ALTER TABLE post DROP Pindex');
			if ($result_del) {
				mysqli_query($hd, 'ALTER TABLE post ADD Pindex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD INDEX (Pindex)');
			}
			echo '{"success":true, "msg":"删除成功!"}';
		}
		else{
			echo '{"success":true, "msg":"删除失败!"}';
		}
		mysqli_close($hd);

	}
}

function endpost(){
	if(!isset($_POST['PID']) || empty($_POST['PID'])){
		echo '{"success":false, "msg":"抱歉!服务器出了小差!"}';
	}
	else {
		$tie = $_POST['PID'];
		// $tie = '1806061981';

		require_once "config.php";

		$query_st = "UPDATE post SET status = 2 WHERE PID='$tie'";
		$result_st = mysqli_query($hd, $query_st);
		if($result_st){
			echo '{"success":true, "msg":"订单结束!感谢您的使用"}';
		}
		else{
			echo '{"success":true, "msg":"结束失败!"}';
		}
		mysqli_close($hd);

	}	
}

function loadpost(){
	if (!isset($_POST['begin']) || empty($_POST['begin'])
		|| !isset($_POST['end']) || empty($_POST['end'])) 
	{
		echo '{"success":false, "msg":"抱歉，网络开了小差！"}';
	}
	else {
		$bindex = $_POST['begin'];
		$eindex = $_POST['end'];
		// $bindex =1;
		// $eindex = 5;

		require_once "config.php";

		$post_result = mysqli_query($hd, "SELECT * FROM post WHERE Pindex <= $bindex AND Pindex >= $eindex");

		$postArr = mysqli_fetch_all($post_result, MYSQLI_ASSOC);

		$arrlength = count($postArr);

		//获取帖主信息和评论数
		for ($i = 0; $i < $arrlength; $i++) {
			// echo gettype($postArr[$i]);

			$query_uid =  "SELECT userLabel, portraitURL FROM user WHERE UID = ".$postArr[$i]["UID"];
			$result_info = mysqli_query($hd, $query_uid);
			$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);
			$postArr[$i]["hostInfo"] = $info;


			$query_num =  "SELECT count(*) AS num FROM re_post WHERE PID = ".$postArr[$i]["PID"];
			$result_num = mysqli_query($hd, $query_num);
			$numOj = mysqli_fetch_array($result_num, MYSQLI_ASSOC);
			$postArr[$i]["replyNum"] = $numOj["num"];

			$postArr[$i]["time"] = formatTime($postArr[$i]["time"]);
		}

		echo '{"success":true, "msg":'. json_encode($postArr) .'}';

		mysqli_close($hd);

	}
}

function loaduserpost(){
	if (!isset($_POST['UID']) || empty($_POST['UID'])) {
		echo '{"success":false, "msg":"抱歉，网络开了小差！"}';
	}
	else {
		$UID = $_POST['UID'];
		// $UID = '20181004917';
		// $UID = '20180029456';

		require_once "config.php";

		$post_result = mysqli_query($hd, "SELECT * FROM post WHERE UID = '$UID'");

		$postArr = mysqli_fetch_all($post_result, MYSQLI_ASSOC);

		$arrlength = count($postArr);

		if (!$arrlength) {
			echo '{"success":false, "msg":"no_post"}';
		}
		else {
			//获取帖主信息和评论数
			for ($i = 0; $i < $arrlength; $i++) {
				// echo gettype($postArr[$i]);
				$query_uid =  "SELECT userLabel, portraitURL FROM user WHERE UID = ".$postArr[$i]["UID"];
				$result_info = mysqli_query($hd, $query_uid);
				$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);
				// print_r($info);
				$postArr[$i]["hostInfo"] = $info;

				if($postArr[$i]["status"] == 1 || $postArr[$i]["status"] == 2) {
					$query_auid =  "SELECT user_name, portraitURL, wechat, phone, email FROM user WHERE UID = ".$postArr[$i]["aUID"];
					$result_ainfo = mysqli_query($hd, $query_auid);
					$ainfo = mysqli_fetch_array($result_ainfo, MYSQLI_ASSOC);
					$postArr[$i]["aUserInfo"] = $ainfo;
				}

				$query_num =  "SELECT count(*) AS num FROM re_post WHERE PID = ".$postArr[$i]["PID"];
				$result_num = mysqli_query($hd, $query_num);
				$numOj = mysqli_fetch_array($result_num, MYSQLI_ASSOC);
				// print_r($numOj["num"]);
				$postArr[$i]["replyNum"] = $numOj["num"];


				$postArr[$i]["time"] = formatTime($postArr[$i]["time"]);
			}
			// print_r($postArr);

			echo '{"success":true, "msg":'. json_encode($postArr) .'}';
		}

		mysqli_close($hd);

	}	
}

function acceptpost(){
	if( !isset($_POST['aUID']) || empty($_POST['aUID'])
		|| !isset($_POST['PID']) || empty($_POST['PID']) ) 
	{
		echo '{"success":false, "msg":"抱歉!服务器出了小差!"}';
	}
	else {
		$aUID = $_POST['aUID'];
		$PID = $_POST['PID'];

		require_once "config.php";

		$query_st = "UPDATE post SET status = 1, aUID = '$aUID' WHERE PID='$PID'";
		$result_st = mysqli_query($hd, $query_st);
		if($result_st){
			echo '{"success":true, "msg":"你已接单！请等待单主联系。"}';
		}
		else{
			echo '{"success":false, "msg":"已经有人抢先一步了!"}';
		}
		mysqli_close($hd);

	}	
}

?>