// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('smartAdd', ['ionic', 'smartAdd.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $compileProvider, $urlRouterProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);
  $stateProvider
    
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/main.html",
      controller: 'AppCtrl'
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.brandlist', {
      url: "/brandlist",
      views: {
        'menuContent' :{
          templateUrl: "templates/brandlist.html",
          controller: 'BrandlistCtrl'
        }
      }
    })

    .state('app.campaignlist', {
      url: "/campaignlist",
      views: {
        'menuContent' :{
          templateUrl: "templates/campaignlist.html",
          controller: 'CampaignlistCtrl'
        }
      }
    })

    .state('app.orderlist', {
      url: "/orderlist",
      views: {
        'menuContent' :{
          templateUrl: "templates/orderlist.html",
          controller: 'OrderlistCtrl'
        }
      }
    })

    .state('app.userlist',{
      url: "/userlist",
      views: {
        'menuContent' :{
          templateUrl: "templates/userlist.html",
          controller: 'UserlistCtrl'
        }
      }
    })

    .state('app.order', {
      url: "/orderlist/:orderId",
      views: {
        'menuContent' :{
          templateUrl: "templates/order-details.html",
          controller: 'OrderdetailCtrl'
        }
      }
    })

    .state('app.receeimage-upload', {
      url: "/receeimage-upload",
      views: {
        'menuContent' :{
          templateUrl: "templates/image-upload.html",
          controller: 'ReceeImageCtrl'
        }
      }
    })

    .state('app.installimage-upload', {
      url: "/installimage-upload",
      views: {
        'menuContent' :{
          templateUrl: "templates/image-upload.html",
          controller: 'InstallImageCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});

