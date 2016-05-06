app.controller("userCtrl",["$scope","Tool","Ajax",function($scope,Tool,Ajax){
	$scope.message;
	$scope.goto = function(path){
		if(Tool.isLogin()){
			Tool.goPage(path);
		}else{
			Tool.goPage("/new/htmls/login.html");
		}
	};
	$scope.load = function(){
		Ajax.loadHost();
		if(Tool.isLogin()){
			let name = JSON.parse(Tool.getLocal("user")).realname
			if(name){
				$scope.message = name;
			}else{
				$scope.message = "您还没有填写名字";
			}
		}else{
			$scope.message = "点击登录注册";
		}
	}
}])