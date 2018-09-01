<?php

header('Content-Type:application/json');

//检测需调用的功能
if( !isset($_POST['type']) || empty($_POST['type']) ) {
	echo '{"success":false, "msg":"服务器开了小差！"}';
}
else if ($_POST['type'] == "loadFriend") {
	loadFriend();
}
else if ($_POST['type'] == "checkMsgNum") {
	checkMsgNum();
}
else if ($_POST['type'] == "loadAllRelation") {
	loadAllRelation();
}
else if ($_POST['type'] == "agreeFriend") {
	agreeFriend();
}
else if ($_POST['type'] == "refuseFriend") {
	refuseFriend();
}
else if ($_POST['type'] == "addFriend") {
	addFriend();
}
else if ($_POST['type'] == "delFriend") {
	delFriend();
}

function loadFriend(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) ) 
	{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	} 
	else {
		$cUser = $_POST['currentUser'];
		// $cUser = '20180076205';
		// $cUser = '20181004917';

		require_once"config.php";

		$result = mysqli_query($hd, "SELECT * FROM friend WHERE UID ='$cUser' AND relation = 1");

		$friArr = mysqli_fetch_all($result, MYSQLI_ASSOC);

		$arrlength = count($friArr);	

		if (!$arrlength) {
			echo '{"success":false, "msg":"no_fri"}';
		}
		else {
			for ($i = 0; $i < $arrlength; $i++) {

				$result_info = mysqli_query($hd, "SELECT user_name, portraitURL FROM user WHERE UID = ".$friArr[$i]["friendUID"]);
				$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);

				$friArr[$i]["fri_user_name"] = $info["user_name"];
				$friArr[$i]["fri_portraitURL"] = $info["portraitURL"];

			}

			echo '{"success":true, "msg":'. json_encode($friArr) .'}';
		}

		mysqli_close($hd);
	}
}

function checkMsgNum(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) ) 
	{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	} 
	else {
		$cUser = $_POST['currentUser'];
		// $cUser = '20180076205';
		// $cUser = '20181004917';

		require_once"config.php";

		$result = mysqli_query($hd, "SELECT friendUID FROM friend WHERE UID ='$cUser' AND relation = 1");

		$friArr = mysqli_fetch_all($result, MYSQLI_ASSOC);

		$arrlength = count($friArr);	

		if (!$arrlength) {
			echo '{"success":false, "msg":"no_fri"}';
		}
		else {
			for ($i = 0; $i < $arrlength; $i++) {

				$result_info = mysqli_query($hd, "SELECT count(msgIndex) as msgNum FROM msg WHERE UID2 = '$cUser' and UID1 = " . $friArr[$i]["friendUID"] . " and readed = 0");
				$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);

				$friArr[$i]["msgNum"] = $info["msgNum"];

			}

			echo '{"success":true, "msg":'. json_encode($friArr) .'}';
		}
		
		mysqli_close($hd);
	}
}

function loadAllRelation(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) ) 
	{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		// $cUser = '20180076205';
		// $cUser = '20181004917';

		require_once"config.php";

		$result = mysqli_query($hd, "SELECT * FROM friend WHERE (UID = '$cUser' and relation = 1) OR (friendUID = '$cUser' and relation = 0)");

		$friArr = mysqli_fetch_all($result, MYSQLI_ASSOC);

		$arrlength = count($friArr);	

		if (!$arrlength) {
			echo '{"success":false, "msg":"no_relation"}';
		}
		else {
			for ($i = 0; $i < $arrlength; $i++) {
				if ($friArr[$i]["relation"] == "1") {
					$result_info = mysqli_query($hd, "SELECT user_name, portraitURL FROM user WHERE UID = ".$friArr[$i]["friendUID"]);
				}
				else if ($friArr[$i]["relation"] == "0") {
					$result_info = mysqli_query($hd, "SELECT user_name, portraitURL FROM user WHERE UID = ".$friArr[$i]["UID"]);
				}
				// $result_info = mysqli_query($hd, "SELECT user_name, portraitURL FROM user WHERE UID = ".$friArr[$i]["friendUID"]);
				$info = mysqli_fetch_array($result_info, MYSQLI_ASSOC);

				$friArr[$i]["fri_user_name"] = $info["user_name"];
				$friArr[$i]["fri_portraitURL"] = $info["portraitURL"];

			}

			echo '{"success":true, "msg":'. json_encode($friArr) .'}';
		}

		mysqli_close($hd);
	}
}

function agreeFriend(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) 
		|| !isset($_POST['agreeUser']) || empty($_POST['agreeUser']) ) 
	{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		$aUser = $_POST['agreeUser'];
		// $cUser = '20180076205';
		// $aUser = '20181002792';

		require_once"config.php";

		$agree = mysqli_query($hd, "UPDATE friend SET relation = 1 WHERE UID = '$aUser' and friendUID = '$cUser'");
		$add = mysqli_query($hd, "INSERT INTO friend SET UID = '$cUser', friendUID = '$aUser', relation = 1");

		if ($agree && $add) {
			mysqli_query($hd, 'ALTER TABLE friend DROP findex');
			mysqli_query($hd, 'ALTER TABLE friend ADD findex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (findex)');
			echo '{"success":true, "msg":"添加成功！"}';
		} else {
			echo '{"success":false, "msg":"数据库开了小差！"}'.mysqli_error($hd);
		}

		mysqli_close($hd);
	}	
}

function refuseFriend(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) 
		|| !isset($_POST['refuseUser']) || empty($_POST['refuseUser']) ) 
	{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		$aUser = $_POST['refuseUser'];
		// $cUser = '20180076205';
		// $aUser = '20181002792';

		require_once"config.php";

		$refuse = mysqli_query($hd, "DELETE FROM friend WHERE UID = '$aUser' and friendUID = '$cUser'");

		if ($refuse) {
			mysqli_query($hd, 'ALTER TABLE friend DROP findex');
			mysqli_query($hd, 'ALTER TABLE friend ADD findex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (findex)');
			echo '{"success":true, "msg":"成功拒绝！"}';
		} else {
			echo '{"success":false, "msg":"数据库开了小差！"}';
		}

		mysqli_close($hd);
	}	
}

function addFriend(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) 
		|| !isset($_POST['addFriendphone']) || empty($_POST['addFriendphone']) ) 
	{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		$afphone = $_POST['addFriendphone'];
		// $cUser = '20180076205';
		// $afphone = '15902050204';

		require_once"config.php";

		$search = mysqli_query($hd, "SELECT UID FROM user WHERE phone = '$afphone'");

		$result = mysqli_fetch_array($search, MYSQLI_ASSOC);

		$arrlength = count($result);

		if (!$arrlength) {
			echo '{"success":false, "msg":"找不到用户！"}';
		} else {
			$aUser = $result["UID"];
			if ($aUser == $cUser) {
				echo '{"success":false, "msg":"大哥你加自己干嘛！"}';
			} else{
				$add = mysqli_query($hd, "INSERT INTO friend SET UID = '$cUser', friendUID = '$aUser'");
				if ($add) {
					mysqli_query($hd, 'ALTER TABLE friend DROP findex');
					mysqli_query($hd, 'ALTER TABLE friend ADD findex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (findex)');
					echo '{"success":true, "msg":"成功发出申请！"}';
				} else {
					echo '{"success":false, "msg":"数据库开了小差！"}';
				}	
			}					
		}

		mysqli_close($hd);
	}
}

function delFriend(){
	if( !isset($_POST['currentUser']) || empty($_POST['currentUser']) 
		|| !isset($_POST['delUser']) || empty($_POST['delUser']) ) 
	{
		echo '{"success":false, "msg":"服务器开了小差！"}';
	}
	else {
		$cUser = $_POST['currentUser'];
		$dUser = $_POST['delUser'];
		// $cUser = '20180076205';
		// $aUser = '20181002792';

		require_once"config.php";

		$del = mysqli_query($hd, "DELETE FROM friend WHERE (UID = '$cUser' and friendUID = '$dUser') or (UID = '$dUser' and friendUID = '$cUser')");

		if ($del) {
			mysqli_query($hd, 'ALTER TABLE friend DROP findex');
			mysqli_query($hd, 'ALTER TABLE friend ADD findex INT(10) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (findex)');
			echo '{"success":true, "msg":"删除好友成功！"}';
		} else {
			echo '{"success":false, "msg":"数据库开了小差！"}';
		}

		mysqli_close($hd);
	}	
}

?>