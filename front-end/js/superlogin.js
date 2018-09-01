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
//  | 管理员登录
//  +----------------------------------------------------------------------
	
	$('#superlogin_btn').on('click', function(){
		if ($('#superusername').val() && $('#superpwd').val()) {
			$.ajax({
				type: 'POST',
				url: IP + '/Campus2.0/php/manager.php',
				data: {
					zh: $('#superusername').val(),
					pwd: $('#superpwd').val(),
					type: 'superlogin'
				},
				dataType: "json",
				success: function(data){
					if (data.success) { 					
						kanpuAlert('登录成功！');
						setTimeout(function(){
							window.location.href = 'manager#user';
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
	

	
}