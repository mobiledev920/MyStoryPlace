var MyStoryPlace = angular.module(
    'ionicApp',
     [
         'ionic',
         'angular-carousel',
         'ngTouch',
         'ionic.closePopup',
         'ngResource',
         'ngCordova',
         'ngStorage'
        //  'ngOpenFB'
     ]
 )
 
//  .run(function ($rootScope, ngFB) {
//     $rootScope.UrunDetay = {};
//     ngFB.init({appId: '1254088977952944'});
// })

.config(['$compileProvider' , function( $compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
}])
//.service() 

.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        // 'http://localhost/**'
        'http://54.77.2.144/**'
    ]);
})

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      
      .state('leave-comment',{
          url:'/leave-comment',
          templateUrl:"templates/comment.html",
          controller: "LeaveCommentCtrl"
      })
      .state('welcome',{
          url:'/welcome',
          templateUrl:"templates/welcome.html",
          controller: "UserCtrl"
      })   
       .state('single-map', {
            url: '/single-map',
            templateUrl: 'templates/single-map.html',
            controller: 'SingleMapCtrl'
       })
      .state('sharestory', {
          url: '/sharestory',
          templateUrl: 'templates/sharestory.html',
          controller: 'ShareStoryCtrl'
      })
      .state('finishstory',{
          url: '/finishstory',
          templateUrl: 'templates/finishstory.html',
          controller: 'FinishStoryCtrl'
      })
      .state('profile-edit',{
            url:'/profile-edit',
            templateUrl:"templates/profile-edit.html",
            controller: "ProfileEditCtrl"
      })
      .state('places',{
          url:'/places',
          templateUrl:'templates/places.html',
          controller:'PlacesCtrl'
      })
      .state('familie',{
          url:'/familie',
          templateUrl:'templates/familie.html',
          controller:'FamilieCtrl'
      })
      .state('maintain-places',{
          url:'/maintainplaces',
          templateUrl:"templates/maintainplaces.html",
          controller:"MaintainPlacesCtrl"
      })
      .state('add-comment',{
          url:'/add-comment',
          templateUrl:'templates/addcomment.html',
          controller:'AddCommentCtrl'
      })
      .state('showstories',{
          url:'/show-stories',
          templateUrl:'templates/showstories.html',
          controller:'ShowStoriesCtrl'
      })
      .state('place-map',{
          url:'/place-map',
          templateUrl:'templates/place-map.html',
          controller:'ShowPlaces'
      })
       .state('wheremap',{
           url:'/where-map',
           templateUrl:"templates/where-map.html",
           controller:"WhereMapCtrl"
       });
                

    

    $urlRouterProvider.otherwise("/welcome");

});