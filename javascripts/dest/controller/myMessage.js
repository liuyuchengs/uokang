define(function(){return function($scope,$rootScope,$location,Tool,Ajax){$scope.params={user:!1,doctor:!1,system:!1},$scope.queryParams={pageRows:10,currentPage:1},$scope.item="",$scope.messages=[],$scope.noProduct=!1,$scope.noProductText="",$scope.init=function(){$rootScope.hasBgColor=!1,Tool.checkLogin()?(Tool.loadUserinfo(),$scope.getQuery()):Tool.changeRoute("/user")},$scope.getQuery=function(){$location.search().item&&($scope.item=$location.search().item,$scope["switch"]($scope.item))},$scope["switch"]=function(item){for(var proto in $scope.params)proto==item?$scope.params[proto]=!0:$scope.params[proto]=!1;$scope.clearData(),"user"===item&&($scope.loadNext=function(){$scope.queryParams.currentPage++,$scope.queryUserMessage()},$scope.queryUserMessage()),"doctor"===item&&($scope.loadNext=function(){$scope.queryParams.currentPage++,$scope.queryDoctorMessage()},$scope.queryDoctorMessage())},$scope.clearData=function(){$scope.messages=[],$scope.noProduct=!1,$scope.queryParams.currentPage=1},$scope.queryUserMessage=function(){Ajax.post({url:Tool.host+"/wx/repliesMessage/myMessage",params:$scope.queryParams,headers:{accessToken:Tool.userInfo.accessToken}}).then(function(data){0==data.code?data.data.length<1?($scope.messages.length<1?$scope.noProductText="您还没有消息!":$scope.noProductText="已经没有了!",$scope.noProduct=!0):$scope.messages=$scope.messages.concat(data.data):Tool.alert("获取消息失败，请稍后再试!")})["catch"](function(){Tool.alert("获取消息失败，请稍后再试!")})["finally"](function(){$rootScope.loading=!1})},$scope.queryDoctorMessage=function(){var obj={pageRows:10,currentPage:$scope.queryParams.currentPage,accessToken:Tool.userInfo.accessToken};Ajax.post({url:Tool.host+"/wx/post/doctorMessage",params:obj,headers:{accessToken:Tool.userInfo.accessToken}}).then(function(data){0==data.code?data.data.length<1?($scope.messages.length<1?$scope.noProductText="您还没有消息!":$scope.noProductText="已经没有了!",$scope.noProduct=!0):($scope.mergeMessage(data.data),$scope.messages=$scope.messages.concat(data.data)):Tool.alert("获取消息失败，请稍后再试!")})["catch"](function(){Tool.alert("获取消息失败，请稍后再试!")})["finally"](function(){$rootScope.loading=!1})},$scope.mergeMessage=function(items){items.forEach(function(item){item.dataStr=item.createTimeStr.slice(5,10),item.postIntro="："+item.postIntro,1==item.postState?item.noReply=!1:item.noReply=!0})},window.onscroll=function(){if(!$rootScope.loading&&!$scope.noProduct){var body=document.body,html=document.documentElement,height=Math.max(body.scrollHeight,body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);height>window.innerHeight&&height-window.scrollY-window.innerHeight<100&&$scope.loadNext()}},$scope.detail=function(id){Tool.changeRoute("/interaction/detail","id="+id)},$scope.doctorDetail=function(id){Tool.changeRoute("/doctor/detail","id="+id)}}});