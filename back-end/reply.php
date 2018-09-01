<?php

header('Content-Type:application/json');

//检测需调用的功能
if( !isset($_POST['type']) || empty($_POST['type']) ) {
	echo '{"success":false, "msg":"服务器开了小差！"}';
}
else if ($_POST['type'] == "loadreply") {
	loadreply();
}
else if ($_POST['type'] == "sendreply") {
	sendreply();
}
else if ($_POST['type'] == "delreply") {
	delreply();
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

function loadreply(){
	if (!isset($_POST['loadPid']) || empty($_POST['loadPid'])) {
		echo '{"success":false, "msg":"抱歉，网络开了小差！"}';
	}
	else {
		$lPid = $_POST['loadPid'];
		// $lPid = 1;

		require_once "config.php";

		$reply_result = mysqli_query($hd, "SELECT * FROM re_post WHERE PID = $lPid");

		$replyArr = mysqli_fetch_all($reply_result, MYSQLI_ASSOC);

		//也用于刷新最新的评论数	
		$arrlength = count($replyArr);

		//获取回复者信息
		for ($i = 0; $i < $arrlength; $i++) {
			// echo gettype($postArr[$i]);

			$query_uid =  "SELECT user_name, portraitURL FROM user WHERE UID = ".$replyArr[$i]["UID"];
			$result_info = mysqli_query($hd, $query_uid);
			$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);
			// print_r($info);
			$replyArr[$i]["reInfo"] = $info;

			if($replyArr[$i]["type"] == 1) {
				$result_toinfo = mysqli_query($hd, "SELECT user_name, portraitURL FROM user WHERE UID = ".$replyArr[$i]["toUID"]);
				$toinfo = mysqli_fetch_array($result_toinfo, MYSQLI_ASSOC);
				$replyArr[$i]["toInfo"] = $toinfo;
			}

			$replyArr[$i]["time"] = formatTime($replyArr[$i]["time"]);
		}

		// print_r($replyArr);

		echo '{"success":true, "msg":'. json_encode($replyArr) .', "replyNum":'. $arrlength .'}';

		mysqli_close($hd);
	}
}

function delreply(){
	if(!isset($_POST['RID']) || empty($_POST['RID'])){
		echo '{"success":false, "msg":"抱歉!服务器出了小差!"}';
	}
	else {
		$tie = $_POST['RID'];
		// $tie = '1806061981';

		require_once "config.php";

		$query_st = "DELETE FROM re_post WHERE RID='$tie'";
		$result_st = mysqli_query($hd, $query_st);
		if($result_st){
			$result_del = mysqli_query($hd, 'ALTER TABLE re_post DROP Rindex');
			if ($result_del) {
				mysqli_query($hd, 'ALTER TABLE re_post ADD Rindex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD INDEX (Rindex)');
			}
			echo '{"success":true, "msg":"删除成功!"}';
		}
		else{
			echo '{"success":true, "msg":"删除失败!"}';
		}
		mysqli_close($hd);

	}
}

function sendreply(){
	if( !isset($_POST['content']) ) {
		echo '{"success":false, "msg":"哎呀服务器出了小差"}';
	}
	else{

		require_once "config.php";

		$PID = $_POST['PID'];
		$UID = $_POST['UID'];
		$content = $_POST['content'];
		$rtype = $_POST['rtype'];

		// $PID = '1806037544';
		// $UID = '20182103908';
		// $content = '真的吗';
		// $rtype = 0;

		$time1 = time();
		$u_pid = date("ymd",$time1);
		$urand = rand(10000,99999);
		$RID = "$u_pid$urand";

    	// echo "$RID";
		date_default_timezone_set('PRC');
		$datetime = new DateTime;
		$time2 = $datetime->format('Y-m-d H:i:s');

		// echo "$time2";
		if($rtype == 0){
			// " INSERT INTO re_post SET RID = '18060984992', PID = '1806037544', UID = '20182103908', answer = '真的吗', type = 0, time = '2018-06-10 02:58:21' "
			$query_st = " INSERT INTO re_post SET RID = '$RID', PID = '$PID', UID = '$UID', answer = '$content', type = '$rtype', time = '$time2' ";
			$result_st = mysqli_query($hd, $query_st);
		}
		else{
			$toUID = $_POST['toUID'];
			$query_st = " INSERT INTO re_post SET RID = '$RID', PID = '$PID', UID = '$UID', answer = '$content', type = '$rtype', toUID = '$toUID', time = '$time2' ";
			$result_st = mysqli_query($hd, $query_st);
		}
		if($result_st) {
			echo '{"success":true, "msg":"评论成功！"}';
		}else{
			echo '{"success":false, "msg":"评论失败！'.mysqli_error($hd).'"}';
		}

		mysqli_close($hd);

	}		
}

?>