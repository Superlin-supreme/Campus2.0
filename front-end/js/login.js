window.onload = function () {
	var IP;
	IP = 'http://localhost:8080';
	// IP = 'http://192.168.165.23:8080';

	var userLogined = false;

	$('a').attr('href', 'javascript:void(0)');

	checkLogin();
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
						userLogined = true;
						$('#cuserpic').attr('src', 'img/'+data.msg.portraitURL);
						$('#cusername').html(data.msg.user_name);
						if(location.hash != '#logined')	{
							location.hash = '#logined';
						}else{
							checkhash();
						}					
						// $('.logined_panel').fadeIn('slow');
						// kanpuAlert('当前用户为：'+data.UID);
					} else {
						checkhash();
						// kanpuAlert(data.msg);
						// location.hash = '#login';
						// $('.login_panel').fadeIn('slow');
					}  
				},
				error: function(jqXHR){
					kanpuAlert("发生错误：" + jqXHR.status);
				}
		})
	}

	function pageAnimation(box1, box2){
		$(box1).fadeOut('fast', function(){
			$(box2).fadeIn('fast');
		})
	}

	var cPanel = '';
	function changePage(showPanel) {
		if (cPanel == '') {
			$(showPanel).fadeIn('fast');
		}
		else {
			pageAnimation(cPanel, showPanel);
		}
		cPanel = showPanel;
	}

	function checkhash(){
		var chash = location.hash;
		if (userLogined) {
			changePage('.logined_panel');
		}else{
			switch (chash) {
				case '#register':
					changePage('.register_panel');
					break;
				case '#login':
					changePage('.login_panel');
					break;
				case '#logined':
					location.hash = '#login';
					break;
				case '':
					location.hash = '#login';
					break;
			}
		}
		
	}

	//前端路由
	window.addEventListener('hashchange',checkhash,false);

	$('#register_btn').on('click', function(){
		// changePage();
		location.hash = '#register';
	});
	$('#return_login_btn').on('click', function(){
		// changePage();
		location.hash = '#login';
	});

	$('#login_btn').on('click', function(){
		if ($('#username').val() && $('#password').val()) {
			$.ajax({
				type: 'POST',
				url: IP + '/Campus2.0/php/user.php',
				data: {
					zh: $('#username').val(),
					pwd: $('#password').val(),
					type: 'Login'
				},
				dataType: "json",
				success: function(data){
					if (data.success) { 					
						kanpuAlert('登录成功！');
						setTimeout(function(){
							window.location.href = 'index';
						},500);
					} else {
						kanpuAlert(data.msg);
					}  
				},
				error: function(jqXHR){
					kanpuAlert("发生错误：" + jqXHR.status);
				}
			})
		}
		else{
			kanpuAlert("用户名或密码不能为空");
		}
	})

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


	$('#rg_btn').on('click', function(){
		// kanpuAlert($("input[name='sexOptions']:checked").val());
		// kanpuAlert(typeof($("#useredeptname").val()));
		// if ($("#useredeptname").val() == -1) {
		// 	kanpuAlert('hehe');
		// }
		// kanpuAlert($("#useredeptname option:selected").text());
		if ($('#newpwd1').val() != $('#newpwd2').val()){
			kanpuAlert("两次输入的密码不一致");
		}
		else if (! testPhone($('#userphone').val()) ){
			kanpuAlert("请输入正确的手机号码");
		}
		else if (! checkEmail($('#useremail').val()) ){
			kanpuAlert("请输入正确的邮箱");
		}
		else if ($('#newname').val() 
			&& $("input[name='sexOptions']:checked").val() != null 
			&& $("#useredeptname").val() != -1
			&& $('#userphone').val() 
			&& $('#useremail').val() 
			&& $('#newpwd1').val() 
			&& $('#newpwd2').val() ) {
			var portraitURL;
			var age;
			if ($("input[name='sexOptions']:checked").val() == 1) {
				portraitURL = 'boy.png';
			} else {
				portraitURL = 'girl.png';
			}
			if ($('#userage').val()) {
				age = $('#userage').val();
			}else {
				age = 0;
			}
			$.ajax({
				type: 'POST',
				url: IP + '/Campus2.0/php/user.php',
				data: {
					user_name: $('#newname').val(),
					age: age,
					sex: $("input[name='sexOptions']:checked").val(),
					wechat: $("#userwechat").val(),
					phone: $('#userphone').val(),
					em: $('#useremail').val(),
					dormitory: $('#useredormitory').val(),
					dept_name: $("#useredeptname option:selected").text(),
					pwd: $('#newpwd1').val(),
					portraitURL: portraitURL,
					type: 'register'
				},
				dataType: "json",
				success: function(data){
					if (data.success) { 
						kanpuAlert('注册成功, 请登录！');
						location.hash = '#login';
					} else {
						kanpuAlert("出现错误：" + data.msg);
					}  
				},
				error: function(jqXHR){
					kanpuAlert("发生错误：" + jqXHR.status);
				}
			})
		}
		else{
			kanpuAlert("注册信息不全!");
		}
	});

	$('#enterindex').on('click', function(){
		window.location.href = 'index';
	});

	$('#logout_btn').on('click', function(){
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
	});

	$('#visitor_btn').on('click', function(){
		window.location.href = 'index';
	})

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

}