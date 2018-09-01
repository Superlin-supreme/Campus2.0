//  +----------------------------------------------------------------------
//  | Author: Supelrin
//  +----------------------------------------------------------------------

window.onload = function () {

//  +----------------------------------------------------------------------
//  | 后台接口地址
//  +----------------------------------------------------------------------
	var IP;
	IP = 'http://localhost:8080';
	// IP = 'http://192.168.165.23:8080';


//  +----------------------------------------------------------------------
//  | 全局样式、功能或按钮功能
//  +----------------------------------------------------------------------
	
	// 修改<a>标签默认的跳转功能
	$('a').attr('href', 'javascript:void(0)');

	// 自定义警告框接口
	var alertNum = 0;
	function kanpuAlert(msg){
		$('body').append('<div class="alert alert-danger kanpu-alert" id="kalert'
			+ alertNum + '" role="alert"><strong class="alert-msg">'
			+ msg + '</strong></div>');
		$('#kalert'+alertNum).fadeIn('fast');
		((function(alertNum){
			setInterval(function(){
				$('#kalert'+alertNum).fadeOut('fast');
			},2000)
		}(alertNum)));
		alertNum++;
	}


//  +----------------------------------------------------------------------
//  | 前端路由
//  +----------------------------------------------------------------------
	var cPanel = '';
	var cActive = 'user_panel_btn';

	window.addEventListener('hashchange',checkhash,false);

	// checkhash();
	function checkhash(){
		var chash = location.hash;
		switch (chash) {
			case '':
				location.hash= '#user';
			break;
			case '#':
				location.hash= '#user';
			break;
			case '#user':
				changePage('.user-panel');
				changeActive('user_panel_btn');
			break;
			case '#post':
				changePage('.post-panel');
				changeActive('post_panel_btn');
			break;
			default:
				location.hash='#user';
				kanpuAlert('哥你想去哪？');
		}
	}
	
	function changePage(showPanel) {
		if (cPanel == '') {
			$(showPanel).fadeIn('fast');
		}
		else {
			pageAnimation(cPanel, showPanel);
		}
		cPanel = showPanel;
	}

	function pageAnimation(box1, box2){
		$(box1).fadeOut('fast', function(){
			$(box2).fadeIn('fast');
		})
	}

	function changeActive(activeBtn){
		$('.'+cActive).attr('class', cActive);
		$('.'+activeBtn).attr('class', 'active '+activeBtn);
		cActive = activeBtn;
	}


	$('.user_panel_btn').on('click', function(){
		location.hash = '#user';
	})

	$('.post_panel_btn').on('click', function(){
		location.hash = '#post';
	})


//  +----------------------------------------------------------------------
//  | 检测管理员登录
//  +----------------------------------------------------------------------
	
	var currentManager;
	var currentManagerName;
	var managerLogined = false;

	// 检测用户是否登录
	checkLogin();

	// 检测登录
	function checkLogin() {
		$.ajax({
			type: 'POST',
				url: IP + '/Campus2.0/php/manager.php',
				data:{
					type: 'checkLogin'
				},
				dataType: "json",
				success: function(data){
					if (data.checklogin) {
						//已登录则显示名称
						managerLogined = true;
						currentManager = data.MID;
						currentManagerName = data.msg.admin_name;
						$('.logined_name').html(data.msg.admin_name);
						$('.logined_btn').css('display', 'block');
						checkhash();
						// 获取单子总数并加载单子
						getNum();
						loaduser();

					} else {
						//未登录退到登录界面
						window.location.href = 'superuser';
						
					}  
				},
				error: function(jqXHR){
					kanpuAlert("发生错误：" + jqXHR.status);
				}
		})
	}

	// 管理员退出登录按钮
	$('.logout_btn').on('click', function(){
		$.ajax({
			type: 'GET',
			url: IP + '/Campus2.0/php/manager.php',
			dataType: "json",
			success: function(data){
				if (data.success) {
					userLogined = false;
					window.location.href = 'superuser';
				}
				else {
					kanpuAlert('未知错误');
				}
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	})



//  +----------------------------------------------------------------------
//  | 用户管理模块
//  +----------------------------------------------------------------------
	
	//加载用户
	function loaduser(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/manager.php',
			data: {
				type: 'loaduser'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) { 
					console.log(data);
					for (var i= 0; i < data.msg.length; i++){
						if (data.msg.sex == 1) {
							var sex = '男';
						} else {
							var sex = '女';
						}
						var userhtml = '<tr uid="'
						+ data.msg[i].UID +'"><td>'
						+ data.msg[i].UID +'</td> <td>'
						+ data.msg[i].user_name +'</td> <td>'
						+ data.msg[i].userLabel +'</td> <td>'
						+ data.msg[i].pwd +'</td> <td>'
						+ sex +'</td> <td>'
						+ data.msg[i].age +'</td> <td>'
						+ data.msg[i].wechat +'</td> <td>'
						+ data.msg[i].phone +'</td> <td>'
						+ data.msg[i].email +'</td> <td>'
						+ data.msg[i].dept_name +'</td> <td>'
						+ data.msg[i].dormitory +'</td> <td><button class="btn btn-default open-deluser-btn">删除</button></td> </tr>';
						$('.user-list').append(userhtml);
					}
				} else {					
					kanpuAlert(data.msg);					
				}  
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	// 打开删除用户确定框按钮
	$('.user-panel').on('click', '.open-deluser-btn', function(ev){
		
			var target = $(ev.target);
			var dUID = target.parents('tr').attr('UID');
			// kanpuAlert(dUID);
			$('#deluser_btn').attr('dUID', dUID);
			$('#deluserModal').modal();			
			
	});

	// 确定删除用户按钮
	$('#deluser_btn').on('click' ,function(){
		var dUID = $(this).attr('dUID');
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/manager.php',
			data: {
				UID: dUID,
				type: 'deluser'
			},
			dataType: 'json',
			success: function(data){
				kanpuAlert(data.msg);
				$('#deluserModal').modal('hide');
				setTimeout(function(){
					location.reload();
				},500);
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			} 
		});	
	})

//  +----------------------------------------------------------------------
//  | 订单管理模块
//  +----------------------------------------------------------------------	
	var postNum;

	// 单子总数
	function getNum(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/post.php',
			data:{
				type: 'countpost'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) { 
					// console.log(data);
					postNum = data.msg;
					loadpost(data.msg);
				} else {
					kanpuAlert(data.msg);
				}  
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	//加载所有单子
	function loadpost(postNum){

		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/post.php',
			data: {
				begin: postNum,
				end: 1,
				type: 'loadpost'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) {
					// console.log(data);
					for (var i = 0; i < data.msg.length; i++){
						var helpStatus;
						switch (data.msg[i].status) {
							case '0':
								helpStatus = '未解决';
								break;
							case '1':
								helpStatus = '正在解决';
								break;
							case '2':
								helpStatus = '已解决';
								break;
						}

						var aUIDhtml = '无';

						if (data.msg[i].aUID != null) {
							aUIDhtml = data.msg[i].aUID;
						}

						var posthtml =  '<tr pid= "'
						+ data.msg[i].PID + '"> <td>'
						+ data.msg[i].PID + '</td> <td>'
						+ data.msg[i].UID +'</td> <td>'
						+ data.msg[i].user_name +'</td> <td>'
						+ data.msg[i].title + '</td> <td>'
						+ data.msg[i].content +'</td> <td>'
						+ data.msg[i].replyNum +'</td> <td>'
						+ helpStatus + '</td> <td>'
						+ aUIDhtml + '</td> <td><button class="btn btn-default open-delpost-btn">删除</button></td> </tr>';
						
						$('.post-list').append(posthtml);
						
					}
				} else {
					kanpuAlert(data.msg);
				}  
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	// 打开删除订单确定框按钮
	$('.post-panel').on('click', '.open-delpost-btn', function(ev){
		
			var target = $(ev.target);
			var dPID = target.parents('tr').attr('PID');
			// kanpuAlert(dPID);
			$('#delpost_btn').attr('dPID', dPID);
			$('#delpostModal').modal();			
			
	});

	// 确定删除订单按钮
	$('#delpost_btn').on('click' ,function(){
		var dPID = $(this).attr('dPID');
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/manager.php',
			data: {
				PID: dPID,
				type: 'delpost'
			},
			dataType: 'json',
			success: function(data){
				// kanpuAlert(data.msg);
				$('#delpostModal').modal('hide');
				setTimeout(function(){
					location.reload();
				},500);
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			} 
		});	
	})
}