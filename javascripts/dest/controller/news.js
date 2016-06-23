/**
 * 资讯控制器
 */
define(function(){
	return function($scope,$http,Tool,Ajax){
		$scope.news = [];
		$scope.navValue = "all";
		$scope.currentPage = 1;
		$scope.pageRows = 10;
		$scope.loading = false;
		$scope.noProduct = false;
		$scope.noProductText = "";
		$scope.imgStyle = {
			"width":screen.width
		}
		$scope.navParam = {
			"all":{
				has:true,
				val:"综合"
			},
			"yake":{
				has:false,
				val:"牙科"
			},
			"meirong":{
				has:false,
				val:"美容"
			},
			"fck":{
				has:false,
				val:"妇产科"
			},
			"zhongyi":{
				has:false,
				val:"中医理疗"
			},
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
					$scope.initSwiper();
				}
			}
		}

		//初始化页面
		$scope.init = function(){
			Ajax.loadHost($scope,function(){
				$scope.loadNews();
			});
		}

		// 初始化图片轮播插件
		$scopeinitSwiper = function(){
			var myswiper = new Swiper(".swiper-container",{
				loop: true,
				pagination: '.swiper-pagination',
				autoplay: 5000,
				autoplayDisableOnInteraction:false,
			})
		}

		// 切换导航栏
		$scope.switch = function(type){
			if(type!=$scope.navValue){
				$scope.navValue = type;
				Tool.select(type,$scope.navParam);
				$scope.news = [];
				$scope.currentPage = 1;
				$scope.noProduct = false;
				$scope.loadNews();
			}
		}

		// 查询数据
		$scope.loadNews = function(){
			$scope.loading = true;
			var url = Tool.getSession("host")+"/wx/health/queryByType";
			var params = "type="+$scope.navParam[$scope.navValue].val+"&currentPage="+$scope.currentPage+"&pageRows="+$scope.pageRows;
			$http.post(url,params,{
				headers: {
				'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
				}
			}).success(function(data){
				if(data.code==0){
					if(data.data.length<1){
						if($scope.news.length<1){
							$scope.noProductText = "暂时没有资讯信息!";
						}else{
							$scope.noProductText = "已经没有项目了!";
						}
						$scope.noProduct = true;
					}else{
						$scope.mergeImg(data.data);
						$scope.news = $scope.news.concat(data.data);
					}
				}else{
					Tool.alert($scope,data.message);
				}
				$scope.loading = false;
			}).error(function(){
				$scope.loading = false;
				$scope.noProduct = true;
				Tool.alert("查询数据失败，请稍后再试!");
			})
		}

		// 分页查询，查询下一页
		$scope.loadNext = function(){
			$scope.currentPage++;
			$scope.loadNews();
		}

		// 图片为空时，设置默认图片
		$scope.mergeImg = function(items){
			items.forEach(function(item){
				if(item.picture==""||item.picture == null){
					item.picture = "../contents/img/p_default.png";
				}
			})
		}

		// 跳转到详细页面
		$scope.detail = function(id){
			Tool.goPage("/new/htmls/news-detail.html#?id="+id);
		}

		$scope.loading= false;
		$scope.detail = {};
		$scope.id = null;

		//初始化页面
		$scope.init = function(){
			Ajax.loadHost($scope,function(){
				$scope.id = $location.search().id;
				$scope.loadDetail();
			})
		}

		//加载资讯信息
		$scope.loadDetail = function(){
			$scope.loading = true;
			var url = $scope.host+"/wx/health/querydetail";
			var params = "id="+$scope.id;
			$http.post(url,params,{
				headers: {
				'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
				}
			}).success(function(data){
				if(data.code==0){
					$scope.detail = data.data;
				}else{
					Tool.alert($scope,"查询数据失败，请稍后再试!");
				}
				$scope.loading= false;
			}).error(function(){
				$scope.loading= false;
				Tool.alert($scope,"查询数据失败，请稍后再试!");
			})
		}
	}
})