angular.module('smartAdd.services', [])

.factory('SharedService', function($rootScope, $ionicLoading , $q) {
	var SharedService = {};

	SharedService.CURRENTCAMPAIGNS;
	SharedService.CURRENTCAMPAIGN;
  SharedService.CURRENTUSERPROPERTY;
  SharedService.HIDEBACKBTN = true;
	SharedService.IMAGELIST = [];
  SharedService.mapURI = [{id:'0', url:'http://lastmileindia.com/tracker/functions.php'},
                          {id:'1', url:'http://lastmileindia.com/tracker/status_update.php'},
                          {id:'2', url:'http://lastmileindia.com/tracker/uploadImage.php'}];

	//loading
	SharedService.startLoading = function() {
	  $rootScope.loading = $ionicLoading.show({
	    template: '<img style="width:120px;" src="img/loading2.gif"></img>'
	  });
	};
	SharedService.stopLoading = function(){
	  $rootScope.loading.hide();
	};
	//loading
	return SharedService;
})

.factory('MockService', function($rootScope, $ionicLoading, $http, $q, SharedService){
	var MockService = {};
	
  MockService.orderStatus = [{id:0, title:"Status"}, {id:1, title:"New"}, {id:2, title:"Hold"}, {id:3, title:"Approved"}];

  MockService.loginType = [{id:0, title:"Select", type:"none"}, {id:1, title:"User", type:"client"}, {id:2, title:"Admin",type:"agent"}];

  MockService.doLogin = function(user){
      var defer = $q.defer();
      var entity = {};
      var url = SharedService.mapURI[0].url;
      entity = JSON.stringify(user);
      $http({method: 'POST', url: url, data: entity}).success(function (data, status, headers, config){
          var loginResponse = {status:"failed", message: "Some problem occured!"};
          if(data.msg=="Success"){
            if((user.userId == data.data.username) && (user.password == data.data.password)){
              loginResponse.status = "success";
              loginResponse.message = "Login Successfull."
              loginResponse.data = data.data;
            }
          }
          else{
            loginResponse = data;
          }
          setTimeout(function(){
            defer.resolve(loginResponse);
          }, 1000);
      }).error(function(data, status, headers, config){
          alert("Error in connection.");
          SharedService.stopLoading();
      });
      return defer.promise;
  }

  MockService.fetchBrands = function(user){
    var defer = $q.defer();
      var entity = {};
      var url = SharedService.mapURI[0].url;
      entity = JSON.stringify(user);
      $http({method: 'POST', url: url, data: entity}).success(function (data, status, headers, config){

          var loginResponse = {status:"failed", message: "Some problem occured!"};
          if(data.msg=="Success"){
            if(data.data.role == "agent"){
              loginResponse.data = {userId: data.data.username, password: data.data.password, coverImage: data.data.coverImage, role: data.data.role, userList:[]};
              //angular.forEach(data.data, function(usr, idx){
                if(data.data.brands!=undefined || data.data.brands != ''){
                  loginResponse.data.brandlist = data.data.brands;
                }
              //});
            }
            setTimeout(function(){
              defer.resolve(loginResponse);
            }, 1000);     
          }
      }).error(function(data, status, headers, config){
            alert("Error in connection.");
            SharedService.stopLoading();
        });
        return defer.promise;
  }

  MockService.updateState = function(update){
      var defer = $q.defer();
      var entity = {};
      var url = SharedService.mapURI[1].url;
      entity = JSON.stringify(update);
      $http({method: 'POST', url: url, data: entity}).success(function (data, status, headers, config){
        if(data.msg=="Success"){
          setTimeout(function(){
            defer.resolve(data);
          }, 1000);
        }
      }).error(function(data, status, headers, config){
          alert("Error in connection.");
          SharedService.stopLoading();
      });
      return defer.promise;
  }

  MockService.getorderDetails = function(details){
      SharedService.startLoading();
      var defer = $q.defer();
      var entity = {};
      var url = SharedService.mapURI[0].url;
      entity = JSON.stringify(details);
      $http({method: 'POST', url: url, data: entity}).success(function (data, status, headers, config){
        
        if(data.msg=="Success"){
          setTimeout(function(){
            defer.resolve(data);
          }, 1000);
        }
      }).error(function(data, status, headers, config){
          alert("Error in connection.");
          SharedService.stopLoading();
      });
      return defer.promise;
  }

  MockService.updateMedia = function(data){
      SharedService.startLoading();
      var defer = $q.defer();
      var entity = {};
      var url = SharedService.mapURI[0].url;
      entity = JSON.stringify(data);
      $http({method: 'POST', url: url, data: entity}).success(function (data, status, headers, config){
        
        if(data.msg=="Success"){
          setTimeout(function(){
            defer.resolve(data);
          }, 1000);
        }
      }).error(function(data, status, headers, config){
          alert("Error in connection.");
          SharedService.stopLoading();
      });
      return defer.promise;
  }
  
  	return MockService;
})

.factory('ImageUtilService', function($rootScope, $ionicLoading , $http, $q, SharedService){
	var ImageUtilService = {};

	//image-capture
  	ImageUtilService.imageList = [];
  	var pictureSource = '';
  	var destinationType = '';

  	try{
    	pictureSource = navigator.camera.PictureSourceType;
    	destinationType = navigator.camera.DestinationType;
  	}
  	catch(e){
    	alert('Camera not supported!');
  	}

    ImageUtilService.updateImage = function(obj){
      
      var defer = $q.defer();
        var entity = {};
        var update = {};
        if(obj.imgType == 'receeImages'){
          update['receeImages'] = ImageUtilService.imageList;
          update['id'] = obj.id;
        }
        else{
          update['installImages'] = ImageUtilService.imageList;
          
          update['id'] = obj.id;
        }
        var url = SharedService.mapURI[2].url;
        entity = JSON.stringify(update);
        $http({method: 'POST', url: url, data: entity}).success(function (data, status, headers, config){
          alert(data.img+" "+data.id);

          if(data.msg=="Success"){
            setTimeout(function(){
              defer.resolve(data);
            }, 1000);
          }
      }).error(function(data, status, headers, config){
          alert("Error in connection.");
          SharedService.stopLoading();
      });
      return defer.promise;
    }

  	ImageUtilService.getPhotoFromDevice = function() {
    	var defer = $q.defer();
      function wrapCallback(imageUri){
        onPhotoURISuccess(imageUri);
        defer.resolve();
      }
      try{
      		navigator.camera.getPicture(wrapCallback, onFail, { quality: 50, destinationType: destinationType.DATA_URL, sourceType: pictureSource.SAVEDPHOTOALBUM });
    	}
    	catch(e){
      		alert(e);
    	}
      return defer.promise;
  	}

  	ImageUtilService.getPhotoFromCamera = function() {
      var defer = $q.defer();
      function wrapCallback(imageUri){
        onPhotoURISuccess(imageUri);
        defer.resolve();
      }
    	try{
    	  	navigator.camera.getPicture(wrapCallback, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
    	}
    	catch(e){
      		alert(e);
    	}
      return defer.promise;
  	}  

  	function onPhotoURISuccess(imageUri) {
      var ImageURI = "data:image/jpeg;base64," + imageUri;
    	ImageUtilService.imageList=ImageURI;
  	}


  	function onFail(message) {
    	alert('Failed because: ' + message);
  	}


  	ImageUtilService.removeImg = function(idx){
    	ImageUtilService.imageList.splice(idx, 1);
  	}
  	//image-capture


  	ImageUtilService.getImageList = function(){
  		return ImageUtilService.imageList;
  	}

  	ImageUtilService.setImageList = function(imageList){
  		ImageUtilService.imageList = imageList;
  	}

	return ImageUtilService;
});