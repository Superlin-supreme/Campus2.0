//  +----------------------------------------------------------------------
//  | Author: Supelrin
//  +----------------------------------------------------------------------

window.onload = function() {

//  +----------------------------------------------------------------------
//  | 后台接口地址
//  +----------------------------------------------------------------------
	var IP;
	IP = 'http://localhost:8080';
	// IP = 'http://192.168.165.23:8080';


//  +----------------------------------------------------------------------
//  | 前端路由
//  +----------------------------------------------------------------------
	var cPanel = '';

	var allnumTimer;
	var msgnumTimer;
	var AllRelationTimer;
	var checkmsgTimer;
	var checking = false;

	var currentInterval;

	window.addEventListener('hashchange',checkhash,false);

	function checkhash(){
		var chash = location.hash;
		if (! userLogined) {
			changePage('.home-panel, .ctt-rt');
		}else{
			if (/^#user([0-9]{11})$/.test(chash)) {
				var openUID = chash.substr(5,15);
				changeOtherUser(openUID);
				changePage('.other-user-panel, .ctt-rt');
				changeActive('');
				changeInterval('Interval1');
			} else {
				switch (chash) {
					case '':
					changePage('.home-panel, .ctt-rt');
					changeActive('home_btn');
					changeInterval('Interval1');
					break;
					case '#':
					changePage('.home-panel, .ctt-rt');
					changeActive('home_btn');
					changeInterval('Interval1');
					break;
					case '#list':
					changePage('.current-user-panel, .ctt-rt');
					changeActive('list_btn');
					changeInterval('Interval1');
					break;
					case '#home':
					changePage('.userhome-panel');
					changeActive('');
					changeInterval('Interval1');
					break;
					case '#msg':
					changePage('.chat-panel');
					changeActive('');
					changeInterval('Interval2');
					break;
					default:
					location.hash='';
					kanpuAlert('哥你想去哪？');
				}
			}			
		}
	}

	function changeInterval(Interval) {
		switch (Interval) {
			case 'Interval1':
			if (currentInterval != 'Interval1') {
				checkallnum();
				allnumTimer =  setInterval(checkallnum, 3000);
				clearInterval(msgnumTimer);
				clearInterval(AllRelationTimer);
				clearInterval(checkmsgTimer);
				$('.friend-username').html('选择好友开始聊天吧');
				$('.msg-list').html('');
				checking=false;
			}
			currentInterval = 'Interval1';
			break;
			case 'Interval2':
			if (currentInterval != 'Interval2') {
				$('.msg-all-num').html(null);
				checkmsgnum();
				msgnumTimer =  setInterval(checkmsgnum, 3000);
				AllRelationTimer =  setInterval(loadAllRelation, 5000);
				clearInterval(allnumTimer);
			}
			currentInterval = 'Interval2';
			break;
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
		switch (activeBtn) {
			case 'home_btn':
			$('.home_btn').attr('class', 'active home_btn');
			$('.list_btn').attr('class', 'list_btn');
			break;
			case 'list_btn':
			$('.home_btn').attr('class', 'home_btn');
			$('.list_btn').attr('class', 'active list_btn');
			break;
			case '':
			$('.home_btn').attr('class', 'home_btn');
			$('.list_btn').attr('class', 'list_btn');
			break;
		}
	}

	$('.list_btn').on('click',function(){
		if (!userLogined){
			kanpuAlert('兄dei你还没登录呢');
		} else {
			location.hash = '#list';
		}	
	})

	$('.userhome_btn1').on('click',function(){
		location.hash = '#home';
	})

	$('.msg_btn').on('click',function(){
		location.hash = '#msg';
	})

	$('.userhome_btn2').on('click',function(){
		if (!userLogined){
			kanpuAlert('兄dei你还没登录呢');
		} else {
			location.hash = '#home';
		}
	})

	$('.home_btn').on('click',function(){
		location.hash = '';
	})

	// 打开其他用户主页
	$('.container').on('click', '.open-other-user', function(ev){
		var target = $(ev.target);
		var otherUID = target.parents('.open-other-user').attr('UID') || target.attr('UID');
		if (!userLogined) {
			kanpuAlert('你还没登录哦');
		}
		else if (otherUID == currentUser) {
			location.hash = '#list';
		}
		else {
			location.hash = '#user'+otherUID;
		}		
	})


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

	//菜单按钮
	$('.menu_btn').on('click',function(){
		if ($('.userbtn2').css('display')=='block') {
			$('.login_small_btn').click();
		}
	})
	$('.login_small_btn').on('click',function(){
		if ($('.ntc').css('display')=='block') {
			$('.menu_btn').click();
		}
	})

	// 我的发布菜单按钮
	$('.user-panel').on('click', 'a', function(ev){
		var target = $(ev.target);
		target.parents('.user-panel').find('li').attr('class','');
		target.parents('li').attr('class','active');
		var status;
		switch (target.attr('id')) {
			case 'all-list-btn':
			$('#user-list').children().css('display','none');
			$('#user-list').children().fadeIn('fast');
			break;
			case 'not-list-btn':
			$('#user-list').children().css('display','none');
			$('#user-list').find("[status="+0+"]").fadeIn('fast');
			$('#user-list').find("[status="+1+"]").fadeIn('fast');
			break;
			case 'done-list-btn':
			$('#user-list').children().css('display','none');
			$('#user-list').find("[status="+2+"]").fadeIn('fast');
			break;
		}
	})


//  +----------------------------------------------------------------------
//  | 当前用户状态模块
//  +----------------------------------------------------------------------
	var currentUser;
	var currentUserName;
	var cportraitURL;
	var userLogined = false;

	// 检测用户是否登录
	checkLogin();

	// 检测登录
	function checkLogin() {
		$.ajax({
			type: 'POST',
				url: IP + '/Campus2.0/php/user.php',
				data:{
					type: 'checkLogin'
				},
				dataType: "json",
				success: function(data){
					if (data.checklogin) {
						//已登录则显示头像
						userLogined = true;
						currentUser = data.UID;
						currentUserName = data.msg.user_name;
						cportraitURL = data.msg.portraitURL;
						$('#cuserpic').attr('src', 'img/'+data.msg.portraitURL);
						$('.userpic, .msgbtn, .logined_btn').css('display', 'block');
						loaduserpost(currentUser);
						loadhomeinfo();
						checkhash();

						loadfriend();
						loadAllRelation();
					} else {
						//未登录显示登录和注册按钮
						$('.top_login, .join_kanpu').css('display', 'block');
						if(location.hash != '')	{
							location.hash = '';
						}else{
							checkhash();
						}
					}  
				},
				error: function(jqXHR){
					kanpuAlert("发生错误：" + jqXHR.status);
				}
		})
	}

	// 用户退出登录按钮
	$('.logout_btn').on('click', function(){
		$.ajax({
			type: 'GET',
			url: IP + '/Campus2.0/php/user.php',
			dataType: "json",
			success: function(data){
				if (data.success) {
					userLogined = false;
					window.location.href = 'user#login';
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

	// 立即登录按钮
	$('.top_login').on('click', function(){
		window.location.href = 'user#login';
	})

	// 加入侃噗按钮
	$('.join_kanpu').on('click', function(){
		window.location.href = 'user#register';
	})


//  +----------------------------------------------------------------------
//  | 当前用户信息模块
//  +----------------------------------------------------------------------
	
	// 加载当前用户信息
	function loadhomeinfo(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/user.php',
			data: {
				UID: currentUser,
				type: 'loadmyinfo'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) { 
					// console.log(data.msg);
					$('.cuserportrait').attr('src','img/'+ data.msg.portraitURL);
					$('.cusername').html(data.msg.user_name);
					$('.user-label').html(data.msg.userLabel);
					if (data.msg.sex == 1) {
						$('.sex').html('男');
					} else {
						$('.sex').html('女');
					}
					$('.age').html(data.msg.age);
					$('.wechat').html(data.msg.wechat);
					$('.phone').html(data.msg.phone);
					$('.email').html(data.msg.email);
					$('.dept_name').html(data.msg.dept_name);
					$('.dormitory').html(data.msg.dormitory);
				} else {
					kanpuAlert(data.msg);
				}  
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	// 检测号码和邮箱
	function testPhone(phone) {
		var mobile = phone;
		if (mobile && /^1(3\d|47|(5[0-3|5-9])|(7[0|7|8])|(8[0-3|5-9]))-?\d{4}-?\d{4}$/.test(mobile)) {
			if (mobile.length > 11 || mobile.length < 11) {
				return false;
			}
			return true;
		} else {
			return false;
		}
	}
	function checkEmail(Email){
		var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); 
		if (Email && reg.test(Email)) {
			return true;
		} else {
			return false;
		}
	}

	// 保存修改信息
	function changeInfo(data_attr, val){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/user.php',
			data: {
				data_attr: data_attr,
				val: val,
				type: 'changeinfo'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) { 
					kanpuAlert(data.msg);
					setTimeout(function(){
						window.location.reload();
					}, 500)
				} else {
					kanpuAlert(data.msg);
				}  
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		});
	}

	// 修改密码按钮
	$('#changepwd_btn').on('click',function(){
		if (! $('#oldpwd').val()) {
			kanpuAlert('请输入旧密码');
		}
		else if (! $('#newpwd1').val()) {
			kanpuAlert('请输入新密码')
		}
		else if (! $('#newpwd2').val()) {
			kanpuAlert('请再次输入新密码')
		}
		else if ($('#newpwd1').val() != $('#newpwd2').val()) {
			kanpuAlert("两次输入的密码不一致");
		}
		else {
			$.ajax({
				type: 'POST',
				url: IP + '/Campus2.0/php/user.php',
				data: {
					UID: currentUser,
					pwd: $('#oldpwd').val(),
					newpwd: $('#newpwd1').val(),
					type: 'changepwd'
				},
				dataType: 'json',
				success: function(data){
					if (data.success) {
						kanpuAlert(data.msg);
						$('#oldpwd, #newpwd1, #newpwd2').val(null);
						$('.changepwdModal-close').click();
					} else {
						kanpuAlert(data.msg);
					}  
				},
				error: function(jqXHR){
					kanpuAlert("发生错误：" + jqXHR.status);
				}
			})
		}
	})

	// 显示修改按钮
	$('.info-box').on('mouseover', function(){
		$(this).find('.change-btn').css('display', 'inline');
	})
	$('.info-box').on('mouseout', function(){
		$(this).find('.change-btn').css('display', 'none');
	})

	// 打开和关闭修改框
	$('.info-body').on('click', '.change-btn', function(){
		var info_box = 	$(this).parents('.info-box');
		info_box.off('mouseover');
		info_box.find('.info-ctt').fadeOut('fast');
		info_box.find('.change-btn').fadeOut('fast', function(){
			info_box.find('.input-group').slideToggle('fast');
		});
	})

	$('.info-body').on('click', '.cancel-btn', function(){
		var info_box = 	$(this).parents('.info-box');	
		info_box.find('.input-group').slideToggle('fast',function(){
			info_box.find('.info-ctt').fadeIn('fast', function(){
				info_box.on('mouseover', function(){
					$(this).find('.change-btn').css('display', 'inline');
				})
			});
		});
	})

	// 保存修改信息按钮
	$('.info-body').on('click', '.save-info', function(){
		var info_box = 	$(this).parents('.info-box');			
		// kanpuAlert(info_box.attr('data-attr'));
		var data_attr = info_box.attr('data-attr');
		if (data_attr == 'sex'){
			if ($("input[name='sexOptions']:checked").val() != null) {
				changeInfo(data_attr, $("input[name='sexOptions']:checked").val())
				// kanpuAlert(data_attr+ ' '+$("input[name='sexOptions']:checked").val());
			}
			else {
				kanpuAlert('兄dei请选择性别！');
			}
		} 
		else if (data_attr == 'dept_name') {
			if ($("#useredeptname").val() != -1) {
				changeInfo(data_attr, $("#useredeptname option:selected").text());
			}
			else {
				kanpuAlert('兄dei请选择学院！');
			}
		}
		else if (data_attr == 'phone') {
			var phonenum = info_box.find('.form-control').val();
			if ( !phonenum || !testPhone(phonenum) ) {
				kanpuAlert('兄dei请输入正确的手机号！');
			}
			else {
				changeInfo(data_attr, phonenum);
			}
		}
		else if (data_attr == 'email') {
			var emailstring = info_box.find('.form-control').val();
			if ( !emailstring || !checkEmail(emailstring) ) {
				kanpuAlert('兄dei请输入正确的邮箱！');
			}
			else {
				changeInfo(data_attr, emailstring);
			}
		}
		else {
			var form_control = info_box.find('.form-control');
			if (form_control.val()) {
				changeInfo(data_attr, form_control.val())
				// kanpuAlert(data_attr+' '+form_control.val());
			}
			else {
				kanpuAlert('兄dei你还没填完呢！');
			}
		}
	})

//  +----------------------------------------------------------------------
//  | 其他用户模块
//  +----------------------------------------------------------------------
	var otherUser;

	function changeOtherUser(otherUID) {
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/user.php',
			data: {
				cUID: currentUser,
				oUID: otherUID,
				type: 'loadotherinfo'
			},
			dataType: 'json',
			success: function(data) {
				otherUser = otherUID;
				otherUserPhone = data.msg.phone;
				$('.other-user-portrait').attr('src', 'img/'+data.msg.portraitURL);
				$('.other-user-name').html(data.msg.user_name);
				$('.other-user-label').html(data.msg.userLabel);
				if (data.friend) {
					$('.check_friend_btn').html('已添加');
					$('.check_friend_btn').attr('id', 'old_friend_btn');
					$('.talk_btn').attr('id', 'able_talk_btn');
				} else {
					$('.check_friend_btn').html('申请好友');
					$('.check_friend_btn').attr('id', 'new_friend_btn');
					$('.talk_btn').attr('id', 'unable_talk_btn');
				}
				loaduserpost(otherUID);
				// location.hash = '#user'+otherUID;
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})	
	}

	$('.other-user-btn').on('click', '#old_friend_btn', function(){
		kanpuAlert('您已经添加了这位朋友！');
	})

	$('.other-user-btn').on('click', '#new_friend_btn', function(){
		addFriend(otherUserPhone);
	})

	$('.other-user-btn').on('click', '#unable_talk_btn', function(){
		kanpuAlert('他不是你的好友，不能私信哦！');
	})

	$('.other-user-btn').on('click', '#able_talk_btn', function(){
		$('.friend-list').find("[fUID$="+otherUser+"]").click();
		location.hash="#msg";
	})



//  +----------------------------------------------------------------------
//  | 聊天和好友模块
//  +----------------------------------------------------------------------
	var friendUser;
	var friendUserName;
	var friendportraitURL
	var msgtop;
	var clenght;

	function checkallnum(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/msg.php',
			data: {
				currentUser: currentUser,
				type: 'checkallnum'
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					// kanpuAlert(data.msg);
					if (data.msg == 0) {
						$('.msg-all-num').html(null);
					} else {
						$('.msg-all-num').html(data.msg);
					}								
				} else {
					kanpuAlert(data.msg);
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function loadfriend(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/friend.php',
			data: {
				currentUser: currentUser,
				type: 'loadFriend'
			},
			dataType: 'json',
			success: function(data) {
				// console.log(data);				
				if (data.success) {
					var loadfriendhtml = '';
					for (var i = 0; i < data.msg.length; i++) {
						loadfriendhtml += '<li role="presentation"><a href="javascript:void(0)" class="open-other-friend" fUID="'
						+ data.msg[i].friendUID  + '"><img src="img/'
						+ data.msg[i].fri_portraitURL +'" class="user-portrait"><span class="username">'
						+ data.msg[i].fri_user_name +'</span><span class="badge pull-right new_msg_num"></span></a></li>';
					}
					$('.friend-list').html(loadfriendhtml);
					checkmsgnum();
					// setInterval(checkmsgnum, 3000);
				} else {
					if (data.msg == "no_fri") {
						// kanpuAlert('没朋友');
						$('.friend-list').html('<li><a href="javascript:void(0)"><span class="text-muted">赶紧找个朋友吧</span></a></li>');
					} else {
						kanpuAlert(data.msg );
					}
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function loadAllRelation(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/friend.php',
			data: {
				currentUser: currentUser,
				type: 'loadAllRelation'
			},
			dataType: 'json',
			success: function(data) {
				// console.log(data);				
				if (data.success) {
					var loadfriendhtml = '';
					if (clenght != data.msg.length){
						loadfriend();
					}
					for (var i = 0; i < data.msg.length; i++) {
						if (data.msg[i].relation == "1") {
							loadfriendhtml += '<li role="presentation"><a href="javascript:void(0)" rUID="'
							+ data.msg[i].friendUID +'"><img src="img/'
							+ data.msg[i].fri_portraitURL +'" class="user-portrait"><span class="username">'
							+ data.msg[i].fri_user_name +'</span><span class="pull-right"><span class="text-muted mr-10">已添加</span><button class="btn btn-default del_fri_btn" type="button">删除</button></span></a></li>';
						}
						else if (data.msg[i].relation == "0") {
							loadfriendhtml += '<li role="presentation"><a href="javascript:void(0)" rUID="'
							+ data.msg[i].UID + '"><img src="img/'
							+ data.msg[i].fri_portraitURL + '" class="user-portrait"><span class="username">'
							+ data.msg[i].fri_user_name + '</span><span class="pull-right"><button class="btn btn-success accept_btn" type="button">接受</button><button class="btn btn-default refuse_btn" type="button">拒绝</button></span></a></li>';
						}
					}
					$('.all-relation-list').html(loadfriendhtml);
				} else {
					if (data.msg == "no_relation") {
						// kanpuAlert('没朋友也没人找');
						$('.all-relation-list').html('<li><a href="javascript:void(0)"><span class="text-muted">赶紧找个朋友吧</span></a></li>');
					} else {
						kanpuAlert(data.msg);
					}
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function loadmsg(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/msg.php',
			data: {
				currentUser: currentUser,
				friendUser: friendUser,
				type: 'loadmsg'
			},
			dataType: 'json',
			success: function(data) {
				// console.log(data);
				
				if (data.success) {	
					if (checking) {
						clearInterval(checkmsgTimer);
						checking=false;
					}
					$('.friend-username').html(data.fUser.user_name);
					friendUserName = data.fUser.user_name;
					friendportraitURL = data.fUser.portraitURL;
					var loadmsghtml = '';			
					for (var i = 0; i < data.msg.length; i++) {
						if (data.msg[i].UID1 == currentUser){
							loadmsghtml = loadmsghtml + '<div class="msg-box text-right"><div class="msg-ctt cuser-msg">'
							+ data.msg[i].content + '</div><img src="img/'
							+ cportraitURL + '" class="user-portrait cuser-portrait"></div>'
						}
						else if (data.msg[i].UID1 == friendUser) {
							loadmsghtml = loadmsghtml + '<div class="msg-box"><img src="img/'
							+ data.fUser.portraitURL + '" class="user-portrait friend-portrait"><div class="msg-ctt friend-msg">'
							+ data.msg[i].content + '</div></div>'
						}
					}
					$('.msg-list').html(loadmsghtml);
					msgtop = $('.msg-list-box')[0].scrollHeight - $('.msg-list-box').height();
					$('.msg-list-box').scrollTop(msgtop);
					
					if (!checking) {
						checkmsgTimer =  setInterval(checkmsg, 2000);
						checking = true;
					}
					checkmsgnum();
				} else {
					if (data.msg == "no_msg") {
						if (checking) {
							clearInterval(checkmsgTimer);
							checking=false;
						}
						$('.friend-username').html(data.fUser.user_name);
						friendUserName = data.fUser.user_name;
						friendportraitURL = data.fUser.portraitURL;
						$('.msg-list').html("");
						if (!checking) {
							checkmsgTimer =  setInterval(checkmsg, 2000);
							checking = true;
						}
					} else {
						kanpuAlert(data.msg );
					}
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function checkmsg(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/msg.php',
			data: {
				currentUser: currentUser,
				friendUser: friendUser,
				type: 'checkmsg'
			},
			dataType: 'json',
			success: function(data) {
				// console.log(data);				
				if (data.success) {	
					var loadmsghtml = '';	
					for (var i = 0; i < data.msg.length; i++) {
						if (data.msg[i].UID1 == friendUser) {
							loadmsghtml = loadmsghtml + '<div class="msg-box"><img src="img/'
							+ friendportraitURL + '" class="user-portrait friend-portrait"><div class="msg-ctt friend-msg">'
							+ data.msg[i].content + '</div></div>'
						}
					}
					$('.msg-list').append(loadmsghtml);
					if ( msgtop ==  $('.msg-list-box').scrollTop() + 30) {
						msgtop = $('.msg-list-box')[0].scrollHeight - $('.msg-list-box').height();
						$('.msg-list-box').scrollTop(msgtop);
						// console.log(msgtop);
					}	else {
						msgtop = $('.msg-list-box')[0].scrollHeight - $('.msg-list-box').height();
					}		
				} else {
					if (data.msg == "no_new_msg") {
						// kanpuAlert('没有新消息');
					} else {
						kanpuAlert(data.msg );
					}

				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function checkmsgnum(){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/friend.php',
			data: {
				currentUser: currentUser,
				type: 'checkMsgNum'
			},
			dataType: 'json',
			success: function(data) {
				// console.log(data);				
				if (data.success) {
					// kanpuAlert('checkmsgnum');
					for (var i = 0; i < data.msg.length; i++) {
						var msgNumhtml;
						if (data.msg[i].msgNum == "0" || data.msg[i].friendUID == friendUser) {
							msgNumhtml = '';
						} else {
							msgNumhtml = data.msg[i].msgNum;
						}
						$('.friend-list').find("[fUID$="+data.msg[i].friendUID+"]").find(".new_msg_num").html(msgNumhtml);
					}
				} else {
					if (data.msg != "no_fri") {
						kanpuAlert(data.msg );
					}
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function addFriend(phone){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/friend.php',
			data: {
				currentUser: currentUser,
				addFriendphone: phone,
				type: 'addFriend'
			},
			dataType: 'json',
			success: function(data) {
				// console.log(data);
				if (data.success) {	
					kanpuAlert(data.msg);
					// loadfriend();
					// loadAllRelation();
				} else {
					kanpuAlert(data.msg);
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function agreeFriend(rUser){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/friend.php',
			data: {
				currentUser: currentUser,
				agreeUser: rUser,
				type: 'agreeFriend'
			},
			dataType: 'json',
			success: function(data) {
				// console.log(data);
				if (data.success) {	
					kanpuAlert(data.msg);
					loadfriend();
					loadAllRelation();
				} else {
					kanpuAlert(data.msg);
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function refuseFriend(rUser){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/friend.php',
			data: {
				currentUser: currentUser,
				refuseUser: rUser,
				type: 'refuseFriend'
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {	
					kanpuAlert(data.msg);
					loadfriend();
					loadAllRelation();
				} else {
					kanpuAlert(data.msg);
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	function delFriend(fUser){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/friend.php',
			data: {
				currentUser: currentUser,
				delUser: fUser,
				type: 'delFriend'
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {	
					kanpuAlert(data.msg);
					location.reload();
				} else {
					kanpuAlert(data.msg);
				}	
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	$('.friend-list').on('click', '.open-other-friend', function(ev){
		var target = $(ev.target);
		friendUser = target.attr('fUID')||target.parents('.open-other-friend').attr('fUID');
		loadmsg();
		// checkmsgnum();
	})

	$('.all-relation-list').on('click', '.accept_btn', function(ev){
		var target = $(ev.target);		
		agreeFriend(target.parents('a').attr('rUID'));
	})

	$('.all-relation-list').on('click', '.refuse_btn', function(ev){
		var target = $(ev.target);		
		refuseFriend(target.parents('a').attr('rUID'));
	})

	$('#addfriend_btn').on('click', function(){
		if (! $('#addfriend_phone').val() ) {
			kanpuAlert('输入手机号，哥');
		} else {
			addFriend($('#addfriend_phone').val());
			$('#addfriend_phone').val(null);
		}
	})

	$('.all-relation-list').on('click', '.del_fri_btn', function(ev){
		var target = $(ev.target);		
		delFriend(target.parents('a').attr('rUID'));
	})
	
	$('#send_msg_btn').on('click', function(){
		if (! $('#send_msg_ctt').val()) {
			kanpuAlert('消息内容呢兄弟？');
		}
		else {
			$.ajax({
				type: 'POST',
				url: IP + '/Campus2.0/php/msg.php',
				data: {
					currentUser: currentUser,
					friendUser: friendUser,
					content: $('#send_msg_ctt').val(),
					type: 'sendmsg'
				},
				dataType: 'json',
				success: function(data) {
					// console.log(data);				
					if (data.success) {
						$('.msg-list').append( '<div class="msg-box text-right"><div class="msg-ctt cuser-msg">'
							+ $('#send_msg_ctt').val() + '</div><img src="img/'
							+ cportraitURL + '" class="user-portrait cuser-portrait"></div>');
						$('#send_msg_ctt').val(null);
						$('.msg-list-box').scrollTop($('.msg-list-box')[0].scrollHeight - $('.msg-list-box').height())
					} else {
						if (data.msg == "sendfalse") {
							kanpuAlert('消息发送失败');
						} else {
							kanpuAlert(data.msg);
						}
					}	
				},
				error: function(jqXHR) {
					kanpuAlert("发生错误：" + jqXHR.status);
				}
			})
		}
	})


//  +----------------------------------------------------------------------
//  | 订单模块
//  +----------------------------------------------------------------------
	var postNum;
	var pageNum;
	var currentPage = 0;
	var lastPostIndex;

	// 获取单子总数
	getNum();

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
					postNum = data.msg;
					countPage(data.msg);
				} else {
					kanpuAlert(data.msg);
				}  
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}

	// 计算单子页数
	function countPage(num){
		if(num == 0){
			pageNum = 0;
			lastPostIndex = 0;
		}
		else if(num % 5 != 0){
			pageNum = parseInt(num / 5) +1;
			lastPostIndex = num % 5;
		}
		else{
			pageNum = num / 5;
			lastPostIndex = 5;
		}
		if (currentPage != pageNum) {
			currentPage++;
			loadPage(currentPage);
		}else{
			$('#loadmore_btn').css('display','none');
			$('#nomorepost').css('display','block');		
		}
	}

	// 加载某页的单子
	function loadPage(lPage){
		var bindex = postNum - 5*(lPage - 1);
		var eindex;
		if (lPage != pageNum){
			eindex = postNum + 1 - 5*lPage;
		}
		else{
			eindex = postNum + 1 - 5*(lPage - 1) - lastPostIndex;
		}
		// kanpuAlert(bindex);
		// kanpuAlert(eindex);

		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/post.php',
			data: {
				begin: bindex,
				end: eindex,
				type: 'loadpost'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) { 
					// console.log(data.msg);
					var loadnum = bindex - eindex;
					for (var i = loadnum; i >= 0; i--){
						var helpIcon, helpStatus , btnColor;
						switch (data.msg[i].status) {
							case '0':
								helpIcon = 'triangle-top';
								helpStatus = '帮Ta解决';
								btnColor = 'default';
								break;
							case '1':
								helpIcon = 'triangle-bottom';
								helpStatus = '正在解决';
								btnColor = 'default';
								break;
							case '2':
								helpIcon = 'ok';
								helpStatus = '已解决';
								btnColor = 'success';
								break;
						}
						var delbtn = '';
						if (data.msg[i].UID == currentUser) {
							delbtn = '<a href="javascript:void(0)" class="delpost-btn">删除</a>';
						}
						var userLabel = '';
						if (data.msg[i].hostInfo.userLabel) {
							userLabel = data.msg[i].hostInfo.userLabel;
						}
						// console.log(data.msg[i].hostInfo);
						var loadhtml = '<div class="panel panel-default host-box" UID="'
						+ data.msg[i].UID +'" PID="'
						+ data.msg[i].PID +'"><div class="panel-body host-body" loadedre="hello"><div class="host_info"><a href="javascript:void(0)" class="open-other-user" UID="'
						+ data.msg[i].UID +'"><img src="img/'
						+ data.msg[i].hostInfo.portraitURL + '"><span class="username">'
						+ data.msg[i].user_name +'</span></a><span class="usersign">'
						+ userLabel + '</span></div><div class="host_title"><strong>'
						+ data.msg[i].title + '</strong></div><div class="host_ctt"><p>'
						+ data.msg[i].content + '</p></div><div class="host_btm"><button type="button" status="'
						+ data.msg[i].status +'" class="help-btn btn btn-'
						+ btnColor +'" ><span class="glyphicon glyphicon-'
						+ helpIcon + '" aria-hidden="true"></span> '
						+ helpStatus +'</button><span class="host_time">'
						+ data.msg[i].time + '</span>'
						+ delbtn +'<a href="javascript:void(0)" class="open_comment"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span class="comment_num">'
						+ data.msg[i].replyNum +'条</span><span class="close_comment">收起</span>疑问</a></div></div></div>';
						$('#all-list').append(loadhtml);
						if (currentPage == pageNum) {
							$('#loadmore_btn').css('display','none');
							$('#nomorepost').css('display','block');
						}
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

	// 加载某用户的单子
	function loaduserpost(loaduid){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/post.php',
			data: {
				UID: loaduid,
				type: 'loaduserpost'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) { 
					// console.log(data.msg);
					if (loaduid == currentUser) {
						var loadlist = $('#user-list');
						$('#user-list-alert').html('没有更多帖子噜');
					} else {
						var loadlist = $('#other-user-list');
						$('#other-user-list-alert').html('没有更多帖子噜');
					}
					var loadnum = data.msg.length-1;
					var loadhtml = '';
					for (var i = loadnum; i >= 0; i--){
						var helpStatus, auserinfo;
						if (loaduid == currentUser) {
							switch (data.msg[i].status) {
								case '0':
								auserinfo = '';
								helpStatus = '未解决';
								break;
								case '1':
								auserinfo = '<div class="panel panel-default"><div class="panel-heading"> <h3 class="panel-title">已有人接单，请尽快联系！</h3> </div> <div class="panel-body"> <div class="comment_box"> <div class="comment_info"> <a href="javascript:void(0)" class="open-other-user" UID="'
								+ data.msg[i].aUID +'"><img src="img/'
								+ data.msg[i].aUserInfo.portraitURL +'"><span class="username">'
								+ data.msg[i].aUserInfo.user_name +'</span></a> <p class="mt-10">微信：'
								+ data.msg[i].aUserInfo.wechat +'</p> <p>电话：'
								+ data.msg[i].aUserInfo.phone +'</p> <p>邮箱：'
								+ data.msg[i].aUserInfo.email +'</p> </div> <form class="input-group"> <button class="btn btn-default end-post-btn" type="button">结束订单</button> </form> </div> </div> </div>' 
								helpStatus = '正在解决';
								break;
								case '2':
								auserinfo = '<div class="panel panel-default"><div class="panel-heading"> <h3 class="panel-title">订单已完成，感谢您的使用！</h3> </div> <div class="panel-body"> <div class="comment_box"> <div class="comment_info"> <a href="javascript:void(0)" class="open-other-user" UID="'
								+ data.msg[i].aUID +'"><img src="img/'
								+ data.msg[i].aUserInfo.portraitURL +'"><span class="username">'
								+ data.msg[i].aUserInfo.user_name +'</span></a> <p class="mt-10">微信：'
								+ data.msg[i].aUserInfo.wechat +'</p> <p>电话：'
								+ data.msg[i].aUserInfo.phone +'</p> <p>邮箱：'
								+ data.msg[i].aUserInfo.email +'</p> </div></div> </div> </div>' 
								helpStatus = '已解决';
								break;
							}
						} else {
							auserinfo = '';
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
						}
						var delbtn = '';
						if (data.msg[i].UID == currentUser) {
							delbtn = '<a href="javascript:void(0)" class="delpost-btn">删除</a>';
						}
						var userLabel = '';
						if (data.msg[i].hostInfo.userLabel) {
							userLabel = data.msg[i].hostInfo.userLabel;
						}
						// console.log(data.msg[i].hostInfo);
						loadhtml = loadhtml + '<div class="panel panel-default host-box" UID="'
						+ data.msg[i].UID +'" PID="'
						+ data.msg[i].PID +'" status='
						+ data.msg[i].status +'>'
						+ '<div class="panel-heading"><h3 class="panel-title">订单编号：<span class="post_PID">'
						+ data.msg[i].PID +'</spn><span class="ml-15">状态：</span><span class="host_status">'
						+ helpStatus + '</span></h3></div>' +'<div class="panel-body host-body" loadedre="hello"><div class="host_info"><a href="javascript:void(0)"><img src="img/'
						+ data.msg[i].hostInfo.portraitURL + '"></a><a href="javascript:void(0)" class="username">'
						+ data.msg[i].user_name + '</a><span class="usersign">'
						+ userLabel + '</span></div><div class="host_title"><strong>'
						+ data.msg[i].title + '</strong></div><div class="host_ctt"><p>'
						+ data.msg[i].content + '</p></div>'
						+ auserinfo +'<div class="host_btm"><span class="host_time">'
						+ data.msg[i].time + '</span>'
						+ delbtn +'<a href="javascript:void(0)" class="open_comment"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span class="comment_num">'
						+ data.msg[i].replyNum +'条</span><span class="close_comment">收起</span>疑问</a></div></div></div>';
						// $('#user-list').append(loadhtml);
					}
					loadlist.html(loadhtml);
				} else {
					if (data.msg == "no_post") {
						if (loaduid == currentUser) {
							$('#user-list-alert').html('兄弟你还没发过帖子呢！');
						}else{
							$('#other-user-list-alert').html('这家伙什么都没发过哦');
						}						
					} else {
						kanpuAlert(data.msg);
					}					
				}  
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})
	}


	// 加载下一页按钮
	$('#loadmore_btn').on('click',function(){
		if (currentPage != pageNum) {
			currentPage++;
			loadPage(currentPage);
		} else{
			$('#loadmore_btn').css('display','none');
			$('#nomorepost').css('display','block');
		}
	})

	// 发布单子按钮
	$('#announce_btn').on('click', function(){
		if (!userLogined) {
			kanpuAlert('你还没登录哦');
		}
		else if (!$('#newhosttitle').val() || !$('#newhostctt').val()) {
			kanpuAlert('兄dei你还没填完呢！');
		}else{
			$.ajax({
				type: 'POST',
				url: IP + '/Campus2.0/php/post.php',
				data: {
					cUID: currentUser,
					cUserName: currentUserName,
					newhosttitle: $('#newhosttitle').val(),
					newhostctt: $('#newhostctt').val(),
					status: 0,
					type: 'sendpost'
				},
				dataType: 'json',
				success: function(data) {
					kanpuAlert(data.msg);
					setTimeout(function(){
						window.location.href = 'index';
					},500)					
				},
				error: function(jqXHR) {
					kanpuAlert('发生错误：'+jqXHR.status);
				}
			})
		}
	})

	//删除单子按钮
	$('.host-list').on('click', '.delpost-btn', function(ev){
		var target = $(ev.target);
		var delPID = target.parents('.host-box').attr('PID');
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/post.php',
			data: {
				PID: delPID,
				type: 'delpost'
			},
			dataType: 'json',
			success: function(data) {
				kanpuAlert(data.msg);
				var chash = location.hash;
				switch (chash){
					case '':
						setTimeout(function(){
							window.location.href = 'index';
						},500);
						break;
					case '#list':
						setTimeout(function(){
							window.location.reload();
						},500);
						break;
				}
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})	
	})

	//结束单子按钮
	$('#user-list').on('click', '.end-post-btn', function(ev){
		var target = $(ev.target);
		var endPID = target.parents('.host-box').attr('PID');
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/post.php',
			data: {
				PID: endPID,
				type: 'endpost'
			},
			dataType: 'json',
			success: function(data) {
				kanpuAlert(data.msg);
				setTimeout(function(){
					window.location.reload();
				},500);
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})	
	})

	// 单子状态按钮
	$('.host-list').on('click', '.help-btn', function(ev){
		if (!userLogined) {
			kanpuAlert('你还没登录哦');
		}
		else {
			var target = $(ev.target);
			var status = target.attr('status');
			var pUID = target.parents('.host-box').attr('UID'); 
			if (pUID == currentUser) {
				kanpuAlert('亲，你不能接自己的单子!');
			} else {
				switch (status) {
					case '0':
					var aPID = target.parents('.host-box').attr('PID'); 
					$('#makepost_btn').attr('aPID', aPID);
					$('#makepostModal').modal();		
					break;
					case '1':
					kanpuAlert('你下手慢了哦');
					break;
					case '2':
					kanpuAlert('此订单已经结束了哦');
					break;
				}
			}			
		}
	});

	// 确定接单按钮
	$('#makepost_btn').on('click' ,function(){
		var aPID = $(this).attr('aPID');
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/post.php',
			data: {
				aUID: currentUser,
				PID: aPID,
				type: 'acceptpost'
			},
			dataType: 'json',
			success: function(data){
				kanpuAlert(data.msg);
				$('#makepostModal').modal('hide');
				setTimeout(function(){
					window.location.href = 'index';
				},800);
			},
			error: function(jqXHR){
				kanpuAlert("发生错误：" + jqXHR.status);
			} 
		});	
	})

//  +----------------------------------------------------------------------
//  | 回复模块
//  +----------------------------------------------------------------------
	// 初始回复类型
	var replyType = 0;
	// 回复用户
	var toUID;

	// 加载回复
	function loadReply(lPid){
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/reply.php',
			data: {
				loadPid: lPid,
				type: 'loadreply'
			},
			dataType: 'json',
			success: function(data){
				if (data.success) { 
					// console.log(data);
					reNum = data.replyNum;
					if (reNum != 0) {
						loadRehtml = ' <div class="panel panel-default comment-container"><div class="panel-heading"><h3 class="panel-title"><span class="comment-num">'
						+ reNum +'</span>条疑问</h3> </div><div class="panel-body"> ';

						for (var i = 0; i<reNum; i++) {
							var replyTypeMsg = '';
							if (data.msg[i].type == 1) {
								replyTypeMsg = '<span>回复</span> <a href="javascript:void(0)" class="ml-10"><img src="img/'
								+ data.msg[i].toInfo.portraitURL +'"></a> <a href="javascript:void(0)" class="tousername">'
								+ data.msg[i].toInfo.user_name +'</a> '
							}
							var rereplybtn =  '<a href="javascript:void(0)" class="reply2_btn">回复</a>';
							var delrebtn = '';
							if (data.msg[i].UID ==currentUser) {
								rereplybtn = '';
								delrebtn = '<a href="javascript:void(0)" class="delreply_btn">删除</a>'
							}

							loadRehtml = loadRehtml + ' <div class="comment_box" RID="'

							+ data.msg[i].RID +'" reUID="'

							+ data.msg[i].UID +'"> <div class="comment_info"> <a href="javascript:void(0)" class="open-other-user" UID="'

							+ data.msg[i].UID +'"><img src="img/'

							+ data.msg[i].reInfo.portraitURL + '"><span class="username">'

							+ data.msg[i].reInfo.user_name  +'</span></a> '

							+ replyTypeMsg +'</div> <div class="comment_ctt"> <p>'

							+ data.msg[i].answer + '</p> </div> <div class="comment_btm"> '

							+ rereplybtn +' <span class="comment_time">'

							+ data.msg[i].time + '</span> '

							+ delrebtn +'</div> </div>';
						}
						loadRehtml += '</div> <div class="panel-footer"> <form class="input-group"> <input type="text" class="form-control reply_ctt" placeholder="写下你的疑惑..."> <span class="input-group-btn"> <button class="btn btn-default cancel_reply" type="button">取消</button> <button class="btn btn-default send_replay" type="button">评论</button> </span> </form> </div> </div>';
						$("[PID$="+lPid+"]").find('.host-body').append(loadRehtml);
						$("[PID$="+lPid+"]").find('.host-body').attr('loadedre', 'bye');
						showComment(lPid);
					}
					else {
						loadRehtml = ' <div class="panel panel-default comment-container"><div class="panel-heading"><h3 class="panel-title">'
						+ '提出疑问</h3> </div>  <div class="panel-footer"> <form class="input-group"> <input type="text" class="form-control reply_ctt" placeholder="写下你的疑惑..."> <span class="input-group-btn"> <button class="btn btn-default cancel_reply" type="button">取消</button> <button class="btn btn-default send_replay" type="button">评论</button> </span> </form> </div> </div>';

						$("[PID$="+lPid+"]").find('.host-body').append(loadRehtml);
						$("[PID$="+lPid+"]").find('.host-body').attr('loadedre', 'bye');
						showComment(lPid);
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

	// 展示回复框
	function showComment(lPid){
		var ccbox = $("[PID$="+lPid+"]").find('.comment-container');
		var cnum = $("[PID$="+lPid+"]").find('.comment_num');
		var ccmm = $("[PID$="+lPid+"]").find('.close_comment');
		if (ccbox.css('display') == 'block'){
			cnum.css('display', 'inline');
			ccmm.css('display', 'none');
			ccbox.css('display', 'none');
		} else{
			cnum.css('display', 'none');
			ccmm.css('display', 'inline');
			ccbox.css('display', 'block');
		}
	}

	// 打开疑问按钮
	$('.host-list').on('click', '.open_comment', function(ev){
		var target = $(ev.target);
		var loadPid = target.parents('.host-box').attr('PID');
		if (target.parents('.host-body').attr('loadedre') == 'hello') {
			loadReply(loadPid);
		}
		else {
			showComment(loadPid);
		}
	})

	// 回复用户按钮
	$('.host-list').on('click', '.reply2_btn', function(ev){
		var target = $(ev.target);
		var cmmBox = target.parents('.comment_box');
		var cmmr = cmmBox.parents('.comment-container');

		cmmr.find('.reply_ctt').attr('placeholder', '回复'+cmmBox.find('.username').text());
		cmmr.find('.cancel_reply').css('display', 'inline');
		replyType = 1;
		toUID = cmmBox.attr('reUID');
	})

	// 取消回复用户按钮
	$('.host-list').on('click', '.cancel_reply', function(ev){
		var target = $(ev.target);
		var cmmr = target.parents('.comment-container');

		cmmr.find('.reply_ctt').attr('placeholder', '写下你的疑惑...');
		cmmr.find('.cancel_reply').css('display', 'none');
		replyType = 0;
		toUID = '';
	})

	//发送回复按钮
	$('.host-list').on('click', '.send_replay', function(ev){
		if (!userLogined) {
			kanpuAlert('你还没登录哦');
		}
		else {
			var target = $(ev.target);
			var cmmr = target.parents('.comment-container');
			var hbox = cmmr.parents('.host-box');

			if (!cmmr.find('.reply_ctt').val()){
				kanpuAlert('你还没填写内容哦');
			}
			else {
				// console.log('hehe');
				var rePID = hbox.attr('PID');
				var reContent = cmmr.find('.reply_ctt').val();
				if(!replyType){
					toUID = hbox.attr('UID');
				}
				$.ajax({
					type: 'POST',
					url: IP + '//Campus2.0/php/reply.php',
					data: {
						PID: rePID,
						UID: currentUser,
						content: reContent,
						rtype: replyType,
						toUID: toUID,
						type: 'sendreply'
					},
					dataType: 'json',
					success: function(data) {
						kanpuAlert(data.msg);
						setTimeout(function(){
							window.location.href = 'index';
						},800);
					},
					error: function(jqXHR) {
						kanpuAlert('哎呀网络出了小差：'+ jqXHR.status);
					}
				})
			}
		}		
	})

	// 删除回复按钮
	$('.host-list').on('click', '.delreply_btn', function(ev){
		var target = $(ev.target);
		var delRID = target.parents('.comment_box').attr('RID');
		$.ajax({
			type: 'POST',
			url: IP + '/Campus2.0/php/reply.php',
			data: {
				RID: delRID,
				type: 'delreply'
			},
			dataType: 'json',
			success: function(data) {
				kanpuAlert(data.msg);
				setTimeout(function(){
					window.location.reload();
				},500);
			},
			error: function(jqXHR) {
				kanpuAlert("发生错误：" + jqXHR.status);
			}
		})	
	})

//  +----------------------------------------------------------------------
//  | 未开放模块
//  +----------------------------------------------------------------------
	$('body').on('click', '.none_done_btn', function(){
		kanpuAlert('版区暂未开放!（真的肝不动了@_@）');
	})

}