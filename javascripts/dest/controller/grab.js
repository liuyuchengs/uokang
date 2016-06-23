define(function(){
	return function($scope,$http,$window,$location,Tool,Ajax,Weixin){
		$scope.queryParams = {
			dayDate:"",
			professionId:2,
			city:"深圳",
			currentPage:1,
			area:"",
		}
		$scope.grabs=[];

		//数据加载动画
		$scope.hasBg = false;
		$scope.noGrab = false;
		$scope.noProductText = "";
		$scope.loading = false;
		//菜单切换变量
		$scope.hasDate = false;
		$scope.hasArea = false;
		$scope.hasClass = false;
		$scope.hasBg = false;
		//是否显示分享窗口
		$scope.showTip = false;
		$scope.shareObj = {
			title:"悠康医生是信息就医平台。",
			desc:"用悠康，有健康。悠康医生为您提供各类优惠医疗项目，快来看看吧!",
			link:"https://www.uokang.com/new/htmls/home.html",
			imgUrl:"https://www.uokang.com/new/contents/img/logo.png",
			success:function(){
				Tool.setLocal("share","true");
				$scope.switchTip("close");
			},
			cancel:function(){}
		}
		//菜单项变量
		$scope.menuParams = {
			area:false,
			classes:false,
			date:false,
		}
		$scope.areaParams = {
			default:{has:true,val:""},
			futian:{has:false,val:"福田区"},
			nanshan:{has:false,val:"南山区"},
			luohu:{has:false,val:"罗湖区"},
			baoan:{has:false,val:"宝安区"},
			longhua:{has:false,val:"龙华新区"},
			longgang:{has:false,val:"龙岗区"},
			yantian:{has:false,val:"盐田区"},
		}
		$scope.dateParams={};
		$scope.classParams = {
			jieya:{has:true,id:2},
			meirong:{has:false,id:3},
			tuina:{has:false,id:6},
		}

		// 滚动监听
		window.onscroll = function(){
			if($scope.loading||$scope.noGrab){
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

		// 页面初始化
		$scope.init = function(){
			$scope.getQueryParams();
			Ajax.loadHost($scope,function(){
				$scope.loadDate($scope.loadData);
				Weixin.wxInit($scope);
				Weixin.wxConfig($scope);
			})
		}

		// 获取url参数
		$scope.getQueryParams = function(){
			if($location.search().item){
				if($location.search().item=="meirong"){
					$scope.queryParams.professionId = 3;
				}
			}
		}

		// 加载日期时间
		$scope.loadDate = function(callback){
			var url = $scope.host+"/wx/gift/querydate";
			$http.get(url)
			.success(function(data){
				for(var i in data){
					var item = data[i];
					if(i==0){
						$scope.dateParams[item.value] = {
							has:true,val:item.value
						}
						$scope.queryParams.dayDate = item.value;
					}else{
						$scope.dateParams[item.value]= {
							has:false,val:item.value
						};
					}
				}
				callback();
			}).error(function(){
				Tool.alert($scope,"时间加载异常，请稍后再试！",function(){
					$scope.hasTip = false;
				});
			})
		}

		// 切换下拉菜单
		$scope.switchMenu =function(menu){
			switch(menu){
				case "area":
					if($scope.hasDate){
						$scope.hasDate = false;
						$scope.menuParams.date = false;
					};
					if($scope.hasClass){
						$scope.hasClass = false;
						$scope.menuParams.classes = false;
					};
					$scope.hasArea = !$scope.hasArea;
					$scope.noGrab = false;
					if($scope.hasArea){
						$scope.menuParams.area = true;
					}else{
						$scope.menuParams.area = false;
					}
					break;
				case "date":
					if($scope.hasArea){
						$scope.hasArea = false;
						$scope.menuParams.area = false;
					};
					if($scope.hasClass){
						$scope.hasClass = false;
						$scope.menuParams.classes = false;
					};
					$scope.hasDate = !$scope.hasDate;
					$scope.noGrab = false;
					if($scope.hasDate){
						$scope.menuParams.date = true;
					}else{
						$scope.menuParams.date = false;
					}
					break;
				case "class":
					if($scope.hasDate){
						$scope.hasDate = false;
						$scope.menuParams.date = false;
					};
					if($scope.hasArea){
						$scope.hasArea = false;
						$scope.menuParams.area = false;
					};
					$scope.hasClass = !$scope.hasClass;
					$scope.noGrab = false;
					if($scope.hasClass){
						$scope.menuParams.classes = true;
					}else{
						$scope.menuParams.classes = false;
					}
					break;
			}
			if($scope.hasDate||$scope.hasArea||$scope.hasClass){
				$scope.hasBg = true;
			}else{
				$scope.hasBg = false;
			}
		}

		// 时间下拉菜单项点击
		$scope.dateSelect = function(params){
			Tool.select(params,$scope.dateParams);
			$scope.queryParams.dayDate = params;
			$scope.queryParams.currentPage = 1;
			$scope.grabs=[];
			$scope.loadData();
			$scope.switchMenu("date");
		}

		// 区域下拉菜单项点击
		$scope.areaSelect =function(params){
			Tool.select(params,$scope.areaParams);
			$scope.queryParams.area = $scope.areaParams[params].val;
			$scope.queryParams.currentPage = 1;
			$scope.grabs=[];
			$scope.loadData();
			$scope.switchMenu("area");
		}

		// 分类下拉菜单项点击
		$scope.classSelect = function(params){
			Tool.select(params,$scope.classParams);
			$scope.queryParams.professionId = $scope.classParams[params].id;
			$scope.queryParams.currentPage = 1;
			$scope.grabs=[];
			$scope.loadData();
			$scope.switchMenu("class");
		}

		// 加载数据
		$scope.loadData = function(){
			$scope.loading = true;
			var url = $scope.host+"/wx/gift/queryproduct";
			var params = Tool.convertParams($scope.queryParams);
			$http.post(url,params,{
				headers: {
				'Content-type':'application/x-www-form-urlencoded;charset=UTF-8',
				}
			}).success(function(data){
				if(data.length<1){
					if($scope.grabs.length<1){
						$scope.noProductText = "没有项目信息,请选择其他区域或者时间!";
					}else{
						$scope.noProductText = "已经没有项目了!";
					}
					$scope.noGrab = true;
				}else{
					$scope.merge(data);
					$scope.grabs = $scope.grabs.concat(data);
				}
				$scope.loading = false;
			})
		}

		// 加载下一页数据
		$scope.loadNext = function(){
			$scope.queryParams.currentPage++;
			$scope.loadData();
		}

		// 处理数据
		$scope.merge = function(items){
			items.forEach(function(item){
				if(item.amount==0|item.amount==null){
					item.noamount = true;
					item.btnMess = "抢光了";
				}else{
					item.noamount = false;
					item.btnMess = "立即抢";
				}
				if(item.smallImg==""||item.smallImg==null){
					item.smallImg = "../contents/img/p_default.png";
				}
			})
		}

		// 抢单按钮
		$scope.writeCode = function(noamount,productId,hospitalId){
			if(noamount){
				return
			}else{
				if(Tool.isLogin()){
					if(Tool.isUserInfoComplete()){
						if(Tool.getLocal("user")){
							var user = Tool.getLocal("user");
							if(user.giftCode==null||user.giftCode==0){
								Tool.alert($scope,"一个用户只能享受一次免费项目，您已经抢过了!",function(){
									$scope.hasTip = false;
								});
							}else{
								if(Tool.getLocal("share")){
									Tool.goPage("/new/htmls/grab-code.html#?productId="+productId+"&hospitalId="+hospitalId+"&dayDate="+$scope.queryParams.dayDate);
								}else{
									Weixin.wxShare($scope.shareObj);
									$scope.switchTip("open");
								}
							}
						}
					}else{
						Tool.comfirm($scope,"请完善个人信息!",function(){
							Tool.goPage("/new/htmls/userinfo.html");
						})
					}

				}else{
					Tool.comfirm($scope,"请先登录并完善个人信息!",function(){
						Tool.goPage("/new/htmls/login.html");
					})
				}
			}
		}

		// 问题按钮
		$scope.question = function(){
			Tool.alert($scope,"每个用户只可享受一次免费抢单，如需帮助请致电：0755-26905699",function(){
				$scope.hasTip = false;
			})
		}

		// 切换tip窗口
		$scope.switchTip = function(params){
			if(params==="close"){
				$scope.showTip = false;
			}
			if(params==="open"){
				$scope.showTip = true;
			}
		}
	}
})