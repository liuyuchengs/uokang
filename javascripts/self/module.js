var app = angular.module("myApp",[]);
//数据访问类服务
app.service("Ajax",["$http","Tool",function($http,Tool){
	this.loadHost = function(){
		var Localhost = Tool.getSession("host");
		if(Localhost){
			return;
		}else{
			$http.get("../contents/json/host.json").success(function(data){
				var host = data.host
				Tool.setSession("host",host);
			}).error(function(err){
				console.log(err);
				Tool.setSession("host","");
			});
		}
	}
}]);
//工具类服务
app.service("Tool",["$location",function($location,Ajax){
	this.getLocal = function(key){
		return localStorage.getItem(key);
	};
	this.setLocal = function(key,value){
		localStorage.setItem(key,value);
	};
	this.removeLocal = function(key){
		localStorage.removeItem(key);
	};
	this.getSession = function(key){
		return sessionStorage.getItem(key);
	}
	this.setSession = function(key,value){
		sessionStorage.setItem(key,value);
	}
	this.removeLocal = function(key){
		sessionStorage.removeItem(key);
	}
	this.goPage = function(path){
		if(this.getSession("host")){
			location.href = this.getSession("host")+path;
		}
	}
	this.getHost = function(){
		var host = "";
		if(this.getSession("host")){
			host = this.getSession("host");
		}
		return host;
	}
	this.isLogin = function(){
		var accessToken = this.getLocal("accessToken");
		if(accessToken){
			return true;
		}else{
			return false;
		}
	}
}])
