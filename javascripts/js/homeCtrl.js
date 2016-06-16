app.controller("homeCtrl",["$scope","$http","Tool","Ajax","Weixin",function($scope,$http,Tool,Ajax,Weixin){
	$scope.host = "";
	$scope.loading =false;
	$scope.items = [];
	$scope.currentPage = 1;
	$scope.noProduct = false;
	$scope.noProductText = "";
	$scope.banners = [];
	$scope.hasHomeMenu = true;
	$scope.key = "LFQBZ-7UNCX-VDR44-T34PN-OX2VQ-M2BNI"; //个人私钥，后续可更换为企业密钥
	$scope.locationInfo ="定位中.."
	$scope.imgStyle = {
		"width":screen.width
	}
	$scope.gotoMenu = function(path){
		Tool.goPage(path);
	}

	$scope.init = function(){
		$scope.loading = true;
		Ajax.loadHost($scope,function(){
			$scope.loadRecommend();
			$scope.queryBanner();
			$scope.initSwiper();
			if(Tool.getSession("locationInfo")){
				$scope.locationInfo = Tool.getSession("locationInfo").city;
			}else{
				Weixin.wxInit($scope,$scope.getLocation);
				Weixin.wxConfig($scope);
			}
		});
	}

	//逆地址服务
	$scope.getLocation = function(latitude,longitude){
		var url = "https://apis.map.qq.com/ws/geocoder/v1/?output=jsonp&callback=JSON_CALLBACK&location="+latitude+","+longitude+"&key="+$scope.key;
		$http.jsonp(url).success(function(data){
			if(data.status==0){
				$scope.locationInfo = data.result.address_component.city;
				var locationInfo = Tool.getSession("locationInfo");
				locationInfo.city = data.result.address_component.city;
				Tool.setSession("locationInfo",locationInfo);
			}else{
				$scope.locationInfo = "定位失败";
			}
		}).error(function(){
			$scope.locationInfo = "定位失败";
		})

	}

	//滚动监听
	window.onscroll = function(){
		if($scope.loading||$scope.noProduct){
			return;
		}
		var body = document.body;
	    var html = document.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );
		if(height>window.innerHeight){
			if (height - window.scrollY - window.innerHeight < 100) {
				$scope.loadNext();
			}
		}
	}

	/*
	** 查询热门推荐
	*/
	$scope.loadRecommend = function(host){
		$scope.loading = true;
		var url = $scope.host+"/wx/product/queryrecommend";
		var params = "city=深圳&currentPage="+$scope.currentPage;
		$http.post(url,params,{
			headers:{
				'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
			}
		}).success(function(data){
			if(data.code==0){
				if(data.data.length<1){
					if($scope.items.length<1){
						$scope.noProductText = "暂时没有热门项目";
					}else{
						$scope.noProductText = "已经没有项目了!";
					}
					$scope.noProduct = true;
				}else{
					$scope.mergeProdcut(data.data);
					$scope.items = $scope.items.concat(data.data);
				}
			}
			$scope.loading = false;
		}).error(function(){
			Tool.alert($scope,"获取热门推荐数据失败，请稍后再试!");
			$scope.loading = false;
			$scope.noProduct = true;
		})
	}
	$scope.mergeProdcut = function(items){
		items.forEach(function(item){
			if(item.priceunit!=null&&item.priceunit!=""){
				item.preferPriceType = item.pricetype+"/"+item.priceunit;
			}else{
				item.preferPriceType = item.pricetype;
			}
			if(item.samllimg==""||item.samllimg==null){
				item.samllimg = "../contents/img/p_default.png";
			}
		})
	}

	/*
	** 获取图片轮播
	*/
	$scope.queryBanner = function(){
		var url = $scope.host+"/wx/banner/query";
		var params = "type=home_banner";
		$http.post(url,params,{
			headers:{
				'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
			}
		}).success(function(data){
			if(data.code==0){
				$scope.mergeBanner(data.data);
				$scope.banners = data.data;
			}
		}).error(function(){
			Tool.alert("获取主页图片失败，请稍后再试!");
		})
	}

	/*
	** 为图片轮播添加链接
	*/
	$scope.mergeBanner = function(items){
		for(var index in items){
			if(index==2){
				items[index].url="section/wrap-c.html";
			}else if(index==3){
				items[index].url="section/wrap-d.html";
			}else if(index==4){
				items[index].url="section/wrap-e.html";
			}else{
				items[index].url= "#";
			}
		}
	}

	/**
	** 初始化图片轮播插件
	*/
	$scope.initSwiper = function(){
		//初始化swiper
		var myswiper = new Swiper(".swiper-container",{
			loop:false,
			pagination: '.swiper-pagination',
			autoplay: 5000,
			autoplayDisableOnInteraction:false,
			observeParents:true,  //
			observer:true,
		})
	}

	/*
	** 跳转到详细页面
	*/
	$scope.detail = function(productId,hospitalId,flag){
		var url = "/new/htmls/product-detail.html#?flag=1&productId="+productId+"&hospitalId="+hospitalId;
		Tool.goPage(url);
	}

	/*
	** 分页查询，查询下一页
	*/
	$scope.loadNext = function(){
		$scope.currentPage++;
		$scope.loadRecommend();
	}

	/*
	** 底部按钮事件
	*/
	$scope.menuClick = function(value){
		Tool.menuClick($scope,value);
	}

	$scope.alert = function(mess){
		Tool.alert($scope,mess);
	}
}])
