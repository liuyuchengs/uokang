app.controller("registerCtrl",["$scope","$http","$interval","Tool","Ajax",function($scope,$http,$interval,Tool,Ajax){
	$scope.phone=""; //手机号码
	$scope.password=""; //密码
	$scope.passwordAgian=""; //确认密码
	$scope.code=""; //验证码
	$scope.codeText="获取短信验证码";
	$scope.codeState = true; //验证码按钮是否可用
	$scope.disable = false;
	$scope.phoneCheckResult = false;

	/**
	 * 加载host
	 */
	$scope.init = function(){
		Ajax.loadHost($scope,function(){})
	}

	/*
	** 注册按钮处理函数
	*/
	$scope.register = function(){
		if($scope.check()){
			$scope.codeCheck($scope.registering);
		}
	}

	/*
	** 检查输入是否符合要求
	*/
	$scope.check = function(){
		if(/^1[3|4|5|7|8]\d{9}$/.test($scope.phone)&&$scope.password.length>=8&&$scope.password.length<=20&$scope.password==$scope.passwordAgian){
			return true;
		}else{
			if(!(/^1[3|4|5|7|8]\d{9}$/.test($scope.phone))){
				Tool.alert($scope,"手机号码错误，请仔细检查!");
				return false;
			}else if($scope.password.length<8|$scope.password.length>20){
				Tool.alert($scope,"密码长度不符合要求，请输入8-20位的密码!");
				return false;
			}else if($scope.password!=$scope.passwordAgian){
				Tool.alert($scope,"两次输入的密码不一致，请重新输入!");
				return false;
			}else{
				Tool.alert($scope,"手机号码或者密码错误，请重新输入!");
				return false;
			}
		}
	}

	/*
	** 验证码按钮处理函数
	*/
	$scope.getCode = function(){
		if($scope.codeState){
			if($scope.phoneCheckResult){
				/*
				** 发送短信验证码
				*/
				var url = $scope.host+"/wx/register/sendsmsregistercode";
				var data = "phone="+$scope.phone;
				$http.post(url,data,{
					headers: {
					   'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
					 }
				}).success(function(data){
					if(data.code==0){
						var time = 59;
						$scope.codeState = false;
						var interval = $interval(function(){
							$scope.codeText = (time+" S");
							time--;
						},1000,60).then(function(){
							$scope.codeText = "获取短信验证码";
							$scope.codeState = true;
							$interval.cancel(interval);
						})
					}else{
						Tool.alert($scope,data.message);
					}
				}).error(function(){
					Tool.alert($scope,"发送验证码失败，请稍后再试!");
				})
			}else{
				Tool.alert($scope,"请填写正确手机号码!");
			}
		}
	}

	/*
	** 检查手机号码是否可以注册
	*/
	$scope.phoneCheck = function(){
		if(/^1[3|4|5|7|8]\d{9}$/.test($scope.phone)){
			var url = $scope.host+"/wx/register/registercheck";
			var data = "name=phone&param="+$scope.phone;
			$http.post(url,data,{
				headers: {
				   'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
				 }
			}).success(function(data){
				if(data.code==0){
					$scope.phoneCheckResult = true;
				}else{
					Tool.alert($scope,data.message);
				}
			}).error(function(){
				Tool.alert($scope,"手机号码检查失败，请稍后再试!");
			})
		}else{
			Tool.alert($scope,"手机号码不正确！");
		}
	}

	/*
	** 验证短信验证码是否正确
	*/
	$scope.codeCheck = function(callback){
		var url = $scope.host+"/wx/register/registercheck";
		var data = "name=verifyCode&param="+$scope.code+"&p="+$scope.phone;
		$http.post(url,data,{
			headers: {
			   'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
			 }
		}).success(function(data){
			if(data.code==0){
				callback();
			}else{
				Tool.alert($scope,data.message);
			}
		}).error(function(){
			Tool.alert($scope,"验证码验证失败，请重试!");
		})
	}

	/*
	** 注册
	*/
	$scope.registering = function(){
		var url = $scope.host + "/wx/register/register";
		var data = "phone="+$scope.phone+"&verifyCode="+$scope.code+"&password="+$scope.password;
		$http.post(url,data,{
			headers: {
			   'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
			 }
		}).success(function(data){
			if(data.code==0){
				Tool.alert($scope,"注册成功!",function(){
					Tool.goPage("/new/htmls/login.html");
				})
			}else{
				Tool.alert(data.message);
			}
		}).error(function(){
			//失败
			return false;
		})
	}
}])
