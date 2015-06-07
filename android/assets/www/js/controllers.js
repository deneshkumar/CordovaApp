angular.module('smartAdd.controllers', ['smartAdd.services'])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, SharedService) {
    $scope.isNavBtnVisible = false;

    $scope.doLogOut = function(){
      SharedService.CURRENTUSERPROPERTY = undefined;
      SharedService.CURRENTBRANDS = undefined;
      SharedService.CURRENTORDERS = undefined;
      $state.go('app.login');
    }
})

.controller('LoginCtrl', function($scope, $state, $timeout, SharedService, MockService) {
    $scope.$parent.isNavBtnVisible = false;
    $scope.user = {};
    $scope.errorMsg = "";
    $scope.loginTypes = MockService.loginType || [];

    $scope.doLogin = function(){
      SharedService.startLoading();
      MockService.doLogin($scope.user).then(function(response){
        if(response.status == "success"){
          SharedService.CURRENTUSERPROPERTY = response.data;
          if(response.data.role == "agent"){
            $state.go('app.userlist');
          }
          else{
            SharedService.CURRENTBRANDS = SharedService.CURRENTUSERPROPERTY.brands;
            $state.go('app.brandlist');
          }
        }
        else
          $scope.errorMsg = "Invalid UserId or Password!";
          SharedService.stopLoading();
      });
    }

    $scope.setLoginType = function(){
      $scope.loginType = $scope.loginTypes[0].id;
    }

    $scope.getLogin = function(data){
      $scope.user.type = $scope.loginTypes[data].type;
    }
})

.controller('BrandlistCtrl', function($scope, $state, SharedService, MockService) {
  if(!SharedService.CURRENTUSERPROPERTY)
    $state.go('app.login');    

  $scope.$parent.isNavBtnVisible = true;
  $scope.hideBackBtn = SharedService.HIDEBACKBTN;
  if(SharedService.CURRENTBRANDS){
    $scope.brandList = SharedService.CURRENTBRANDS;
  }
  else{    
    $state.go('app.login');
  }

  $scope.openCampaignList = function(brand){
    SharedService.CURRENTCAMPAIGNS = brand.campaigns;
    $state.go('app.campaignlist');
  }
})

.controller('CampaignlistCtrl', function($scope, $state, SharedService, MockService) {
  if(!SharedService.CURRENTUSERPROPERTY)
    $state.go('app.login');

  $scope.$parent.isNavBtnVisible = true;
  $scope.hideBackBtn = SharedService.HIDEBACKBTN;
  if(SharedService.CURRENTCAMPAIGNS)
    $scope.campaignList = SharedService.CURRENTCAMPAIGNS;
  else{
    /*SharedService.startLoading();
    MockService.getAllCampaigns().then(function(data){
      $scope.campaignList = data;
      SharedService.CURRENTCAMPAIGNS = data;
      SharedService.stopLoading();
    });*/
    $state.go('app.login');
  }

  $scope.openOrderList = function(campaign){
    SharedService.CURRENTORDERS = campaign.orders;
    $state.go('app.orderlist');
  }
})

.controller('OrderlistCtrl', function($scope, $state, SharedService, MockService) {
  if(!SharedService.CURRENTUSERPROPERTY)
    $state.go('app.login');

  $scope.$parent.isNavBtnVisible = true;
  $scope.filterOptions = MockService.orderStatus;

  if(SharedService.CURRENTORDERS)
    $scope.orderList = SharedService.CURRENTORDERS;
  else{
    $state.go('app.login');
  }
  $scope.filterOption = 0;
  $scope.$watch('filterOption',function(val,old){
    switch(val){
      case 0:
        $scope.orderList = SharedService.CURRENTORDERS;
        return;

      case 1:
        $scope.orderList = [];
        angular.forEach(SharedService.CURRENTORDERS, function(ord, idx){
          if(ord.status == "Reece Done")
            $scope.orderList.push(ord);
        });
        return;

      case 2:
        $scope.orderList = [];
        angular.forEach(SharedService.CURRENTORDERS, function(ord, idx){
          if(ord.status == "Hold")
            $scope.orderList.push(ord);
        });
        return;

      case 3:
        $scope.orderList = [];
        angular.forEach(SharedService.CURRENTORDERS, function(ord, idx){
          if(ord.status == "Approved")
            $scope.orderList.push(ord);
        });
        return;
    }
  });
})

.controller('OrderdetailCtrl', function($scope, $state, $stateParams, $ionicModal, SharedService, MockService) {
  if(!SharedService.CURRENTUSERPROPERTY)
    $state.go('app.login');

  $scope.navSlide = function(index) {
        $ionicSlideBoxDelegate.slide(index, 500);
    }
    $scope.media = {};
  $scope.$parent.isNavBtnVisible = true;
  //$scope.order = SharedService.CURRENTORDERS[$stateParams.orderId];
  $scope.order = _.findWhere(SharedService.CURRENTORDERS, {"id": $stateParams.orderId});
  SharedService.CURRENTORDER = $scope.order;
  $scope.currentImg = {};
  $scope.currentUserProperty = SharedService.CURRENTUSERPROPERTY;
  $scope.order['type'] = 'orderdetails';  
  MockService.getorderDetails($scope.order).then(function(response){
    SharedService.stopLoading();
    if(response.msg == "Success"){
      response.data.order.id = $scope.order.id;
      response.data.order.orderEntryDate = $scope.order.orderEntryDate;
      response.data.order.retailerName = $scope.order.retailerName;
      $scope.media.orderQuantity = $scope.order.orderQuantity;
      $scope.media.orderHeight = $scope.order.orderHeight;
      $scope.media.orderWidth = $scope.order.orderWidth;
      $scope.media.orderArea = $scope.order.orderArea;
      response.data.order.status = $scope.order.status;
      $scope.order = response.data.order;
      $scope.media.mediaType = $scope.order.media[0].media_type_id;
      if($scope.currentUserProperty.role == 'agent'){
        $scope.order.role = 'agent';
      }
      SharedService.CURRENTORDER = $scope.order;
      $scope.currentImg = {};
      $scope.currentUserProperty = SharedService.CURRENTUSERPROPERTY;
      
    }
    else{
      $scope.errorMsg = "Invalid UserId or Password!";
      SharedService.stopLoading();
    }
  }); 

  $scope.showInModal = function(aImg,aHeight,aWidth,aName){
    $scope.currentImg = aImg;
    $scope.currentHeight = aHeight;
    $scope.currentWidth = aWidth;
    $scope.currentName = aName;
    $scope.openModal();
  }

  $scope.getMedia = function(data){
    var media = _.findWhere($scope.order.media, {"media_type_id": data});
    $scope.media.media_type_id = media.media_type_id;
    $scope.media.media_type_name = media.media_type_name;
    alert(update);
  }

  $scope.updateArea = function(){
    $scope.total=(parseInt($scope.media.orderHeight)*.08333)*(parseInt($scope.media.orderWidth)*.08333);
    $scope.media.orderArea = $scope.total.toFixed(2);
  }

    $scope.submitMedia = function(){
      debugger;
      var media = _.findWhere($scope.order.media, {"media_type_id": $scope.media.mediaType});
      $scope.media.media_type_id = media.media_type_id;
      $scope.media.media_type_name = media.media_type_name;
      $scope.media.id = SharedService.CURRENTORDER.id;
      $scope.media.type = "media";
      MockService.updateMedia($scope.media).then(function(response){
        SharedService.stopLoading();
        if(response.msg == "Success"){
          alert('Saved Successfully.');
        }
      })
    }

  //Image-modal
  $ionicModal.fromTemplateUrl('templates/image-preview.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  //Image-modal

  //Approve campaign
  $scope.approveOrder = function(){
    SharedService.startLoading();
    var updateStatus = {};
    updateStatus['type'] = SharedService.CURRENTUSERPROPERTY.role;
    updateStatus['id'] = SharedService.CURRENTORDER.id;
    updateStatus['state'] = 'Approved';

    MockService.updateState(updateStatus).then(function(data){
      SharedService.stopLoading();
      var update = _.findWhere(SharedService.CURRENTORDERS, {"id": updateStatus.id});
      update.status = "Approved";
      
    });
    $state.go('app.orderlist');
  };
  //Approve campaign

  //Hold campaign
  $scope.holdOrder = function(){
    SharedService.startLoading();
    var updateStatus = {};
    updateStatus['type'] = SharedService.CURRENTUSERPROPERTY.role;
    updateStatus['id'] = SharedService.CURRENTORDER.id;
    updateStatus['state'] = 'Hold';

    MockService.updateState(updateStatus).then(function(data){
      SharedService.stopLoading();
      var update = _.findWhere(SharedService.CURRENTORDERS, {"id": updateStatus.id});
      update.status = "Hold";
    });
    $state.go('app.orderlist');
  };
  //Hold campaign

  //Reject campaign
  $scope.rejectOrder = function(){
    SharedService.startLoading();
    var updateStatus = {};
    updateStatus['type'] = SharedService.CURRENTUSERPROPERTY.role;
    updateStatus['id'] = SharedService.CURRENTORDER.id;
    updateStatus['state'] = 'Reject';

    MockService.updateState(updateStatus).then(function(data){
      SharedService.stopLoading();
      var update = _.findWhere(SharedService.CURRENTORDERS, {"id": updateStatus.id});
      update.status = "Reject";
    });

    $state.go('app.orderlist');
  };
  //Reject campaign
})


.controller('UserlistCtrl', function($scope, $state, SharedService,MockService){
  if(!SharedService.CURRENTUSERPROPERTY)
    $state.go('app.login');
  
  $scope.$parent.isNavBtnVisible = true;
  if(SharedService.CURRENTUSERPROPERTY){
    $scope.clientList = SharedService.CURRENTUSERPROPERTY.client;
    
  }
  else{    
    $state.go('app.login');
  }

  $scope.openBrandList = function(client){
    client['type']='fetchBrands';
    SharedService.startLoading();
    MockService.fetchBrands(client).then(function(data){
        SharedService.stopLoading();
        SharedService.CURRENTBRANDS = data.data.brandlist;
        SharedService.HIDEBACKBTN = false;
        $state.go('app.brandlist');
    })
    
  }
})


.controller('ReceeImageCtrl', function($scope, $stateParams, SharedService, ImageUtilService) {
  $scope.$parent.isNavBtnVisible = false;
  $scope.order = SharedService.CURRENTORDER;
  $scope.currentImages = $scope.order.receeImages;
  ImageUtilService.setImageList($scope.currentImages);
  $scope.order['imgType'] = "receeImages";

  $scope.getPhotoFromDevice = function(){
    ImageUtilService.getPhotoFromDevice().then(function(){
      $scope.currentImages = ImageUtilService.imageList;
      $scope.order.receeImages = $scope.currentImages;
      ImageUtilService.updateImage($scope.order).then(function(data){
         SharedService.stopLoading();
      })
    });
    
  } 

  $scope.getPhotoFromCamera = function(){
    ImageUtilService.getPhotoFromCamera().then(function(){
      $scope.currentImages = ImageUtilService.imageList;
      $scope.order.receeImages = $scope.currentImages;
      ImageUtilService.updateImage($scope.order).then(function(data){
         SharedService.stopLoading();
      })
    });
    
  }

  $scope.removeImg = function(idx){
    ImageUtilService.removeImg(idx);
    $scope.currentImages = ImageUtilService.imageList;
    $scope.order.receeImages = $scope.currentImages;
  }
})

.controller('InstallImageCtrl', function($scope, $stateParams, SharedService, ImageUtilService) {
  $scope.$parent.isNavBtnVisible = false;
  $scope.order = SharedService.CURRENTORDER;
  $scope.currentImages = $scope.order.installImages;
  ImageUtilService.setImageList($scope.currentImages);
  $scope.order['imgType'] = "installImages";
  $scope.getPhotoFromDevice = function(){
    ImageUtilService.getPhotoFromDevice().then(function(){
      $scope.currentImages = ImageUtilService.imageList;
      $scope.order.installImages = $scope.currentImages;
      ImageUtilService.updateImage($scope.order).then(function(data){
         SharedService.stopLoading();
      })
    });
    
  } 

  $scope.getPhotoFromCamera = function(){
    ImageUtilService.getPhotoFromCamera().then(function(){
      $scope.currentImages = ImageUtilService.imageList;
      $scope.order.installImages = $scope.currentImages;
      ImageUtilService.updateImage($scope.order).then(function(data){
         SharedService.stopLoading();
      })
    });
  }

  $scope.removeImg = function(idx){
    ImageUtilService.removeImg(idx);
    $scope.currentImages = ImageUtilService.imageList;
    $scope.order.installImages = $scope.currentImages;
  }
});