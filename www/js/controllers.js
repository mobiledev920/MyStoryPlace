
MyStoryPlace

// -------------------------------------------------------  Side left Menu Controller ---------------------------------------------------------------- //

.controller('NavCtrl', function ($scope, $ionicLoading, $location, $state, $ionicSideMenuDelegate, $rootScope, $ionicSlideBoxDelegate, APIService, $ionicPopup) {
    
    // Side menu init Method
    $scope.init = function() {
                
        $scope.show_story = {};
        console.log ('Side Menu.....');
        $scope.storyImageUrl = {'story_file_name': '', 'story_file_type':''};
    }
    
    // Side menu toggleLeft method
    $rootScope.showMenu = function() {
        
        $scope.selectedStory = [];
        $scope.StoryItems = [];
        
        // Get Story Detail when user tapped the Map marker
        $rootScope.all_story.forEach(function(marker_files) {
            
            var glati = marker_files['story_location_lat'];
            var glongi = marker_files['story_location_long'];
            console.log(glati);
            console.log(glongi);
            console.log($rootScope.position.lat());
            console.log($rootScope.position.lng());
            if (Math.abs($rootScope.position.lat() - glati) < 0.00000001 && 
                Math.abs($rootScope.position.lng() == glongi) < 0.00000001) {
                    
                $scope.show_story = marker_files;
                $scope.selectedStory.push($scope.show_story);
                console.log(marker_files);
            }
        }, this);
        
        $scope.show_story = $scope.selectedStory[0];
        console.log($scope.selectedStory);
        $scope.show_story.story_files.forEach(function(mark_media) {
            
            if(mark_media.story_file_type != 'audio' && mark_media.story_file_type != 'text' && mark_media.story_file_type != 'video') {
                $scope.StoryItems.push(mark_media);
            }
        }, this);
        
        $scope.storyImageUrl = $scope.StoryItems[0];
        $scope.file_count = $scope.StoryItems.length;
        console.log($scope.storyImageUrl);
        
        $ionicSideMenuDelegate.toggleLeft();
    };
    
    // When user clicked the other story item, Showing the story
    $scope.showOtherStory = function(params) {
        $scope.show_story = params;
    }
    
    // Side menu toggleRight method
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
    
    // Go comment View when clicked comment button
    $scope.goComment = function() {
        
        $ionicSideMenuDelegate.toggleRight();
        
        $rootScope.flag1 = 1;
        $ionicLoading.show({
              template:'Loading...'
          });
          
        $scope.goGetStory('leave-comment');  // Get story Detail 
    };
    
    // Go ShowStories View when clicked show stories button
    $scope.showStories = function() {
        
        $ionicSideMenuDelegate.toggleRight();
        $rootScope.flag1 = 0;
    
        $ionicLoading.show({
            template: 'Loading...'
        });
        
        console.log($scope.show_story.story_id);
        $scope.goGetStory('showstories');
    };
    
    // Called get_story api of which user selected story
    $scope.goGetStory = function(params) {
        
        APIService.get_Story({'story_id': $scope.show_story.story_id}, function(result){
            
            console.log(result);
            $ionicLoading.hide();
            
            if(result.status==1){
                
                $rootScope.showStory = result;
                console.log('showStory',$rootScope.showStory);
                $state.go(params);
                
            } else {
                console.log(result);
                $ionicPopup.alert({
                    title: 'Error',
                    template: result.msg//JSON.stringify(err)
                });
            }
        }, function(error){
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Error',
                template: 'Loading error'//JSON.stringify(err)
            });
        });
    }
  
   // Showing story files in slide view of side menu
    t=0;
    $scope.showBackImage = function(){
        t--;
        if(t<1){ 
           t=0;
        }
        $scope.storyImageUrl = $scope.StoryItems[t];
    };
    $scope.showNextImage = function(){
        t++;
        if(t>$scope.file_count- 1){ 
            t=$scope.file_count - 1;
            console.log(t);
        }
        $scope.storyImageUrl = $scope.StoryItems[t];
    };   
})

// ----------------------------------------------------------   User signup and login Controller  ------------------------------------------------------------------------ //
.controller('UserCtrl', function($scope, $cordovaFacebook, $rootScope, $ionicPopup, $location, $stateParams, $state, $timeout, APIService, $cordovaGeolocation, UserService, $ionicLoading, $localStorage, $cordovaDevice) {

    // Init Method
    $scope.init = function() {
        
        $scope.user_detail = { 
            'signup_mode' : 1,
            'user_facebook_id' : '',
            "user_first_name" : '',
            "user_last_name" : '',
            "user_location_latitude" : '',
            "user_location_longitude" : '',
            "user_photo_url" : '',
            "user_apns_id" : '',
            "user_gcm_id" : ''
        };
        
        // Get user location
        // Called to navigate to the main app
        $scope.user_info = {};
        $rootScope.user_friend_list = [];
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        
        $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function(position){
           
            $rootScope.lat = position.coords.latitude;
            $rootScope.long = position.coords.longitude;
            console.log("% %",$rootScope.lat, $rootScope.long);
            console.log("User location get successfully");
        });
        
        if (UserService.getUser().isLogged) {        // User login status 
            
            $rootScope.lat = UserService.getUser().user_location_latitude;
            $rootScope.long = UserService.getUser().user_location_longitude;
            $state.go('single-map');
        } 
    };
    
    // Called to navigate to the main app
    $scope.goSingleMap = function () {
        
        if($scope.isChecked == true) {
            $scope.fbLogin();
        } else {
            $ionicPopup.alert({
                template: "Please agree terms and policy"
            });
        }
    };
            
    // This method is executed when the user press the "Login with facebook" button
    $scope.fbLogin = function() {
    
        // Get Device ID
        if( $cordovaDevice.getPlatform() == 'iOS') {
            $scope.user_detail.user_apns_id = $cordovaDevice.getUUID();
        } else {
            $scope.user_detail.user_gcm_id = $cordovaDevice.getUUID();
        }
        
        // User Facebook Login    
        try {
             $ionicLoading.show({
                template: 'Login...'
            });
            
            // Fetch the app already login 
            $cordovaFacebook.getLoginStatus()
            .then(function(success) {
                
                console.log(success);
                if(success.status == "connected"){      // User already logged in
                    
                    //Goto main page
                    $ionicLoading.hide();
                    $scope.getFBInfo();                 // get profile info
                    
                }else{
                    
                    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                    .then(function(success) {
                        
                        $ionicLoading.hide();
                        $scope.getFBInfo();      // get Profil info
                        
                    }, function (error) {
                        
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'FB Login first Cancelled',
                            template: error.errorMessage
                        });
                    });
                }
            }, function (error) {
                // error
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'FB Login second Cancelled',
                    template: error.errorMessage
                });
            });
        } catch (error){
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'FB Login third Cancelled',
                template: error.message
            });
        };
    };
    
    // Get Facebook Information of logged in users
    $scope.getFBInfo = function () {
        
        try{
            $ionicLoading.show({template: 'Fetching the user profile ...'});            
            $cordovaFacebook.api("me?fields=id,last_name,first_name,picture", [])
            .then(function(result){
                
                $ionicLoading.hide();
                console.log(result);
                $scope.user_info = result;
                $scope.user_photo = result["picture"]["data"]["url"];
                $scope.userSignUp(result);
                console.log(result.friends.data);
                
            }, function(error){
                $ionicLoading.hide();
                // Error message
                $ionicPopup.alert({
                    title: 'FB Login Cancelled',
                    template: error.errorMessage
                });
            });
            
        }catch (error){
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Alert',
                template: error.message
            });
        }
    };
    
    $rootScope.getFiends = function() {
        $ionicLoading.show({template: 'Loading...'});
        try{
            $cordovaFacebook.api("me/friends?fields=id,name", [])
            .then(function(result){
                $ionicLoading.hide();
                console.log(result);
                $rootScope.user_friend_list = result.data;
                                
            }, function(error){
                $ionicLoading.hide();
                // Error message
                $ionicPopup.alert({
                    title: 'Get Friend Cancelled',
                    template: error.errorMessage
                });
            });
            
        }catch (error){
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Alert',
                template: error.message
            });
        }
    }

    $scope.userSignUp = function(user) {
        
        $scope.user_detail['user_facebook_id'] = user['id'];
        $scope.user_detail['user_first_name'] = user['first_name'];
        $scope.user_detail['user_last_name'] = user['last_name'];
        $scope.user_detail['user_location_latitude'] = $rootScope.lat;
        $scope.user_detail['user_location_longitude'] = $rootScope.long;
        $scope.user_detail['user_photo_url'] = $scope.user_photo;
                
        $ionicLoading.show({
            template: 'Loading...'
        });
        
        APIService.register($scope.user_detail, function(result) {
            console.log(result);
                              
            if(result.status==1){
                
                $scope.user_info['user_id'] = result['user_id'];
                $scope.user_info['user_location_latitude'] = $rootScope.lat;
                $scope.user_info['user_location_longitude'] = $rootScope.long;
                $scope.user_info['isLogged'] = true;
                
                UserService.setUser($scope.user_info);
                console.log($scope.user_info);
                
                $timeout(function() {
                    $ionicLoading.hide();
                    $state.go('single-map');
                }, 3000);
                
            } else {
                console.log(result.status);
            }
        },function (err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Loading error'//JSON.stringify(err)
            });
        });
    }

})

// ----------------------------------------------------------------  Story Nearby View Controller  ------------------------------------------------------------------- //
.controller('SingleMapCtrl', function($scope, $location, $timeout, $rootScope, $state, $cordovaGeolocation, $cordovaSocialSharing, $localStorage, $ionicLoading, $ionicPopup, APIService, UserService, User, $ionicSideMenuDelegate, IonicClosePopupService) {
    
    // init function
    $scope.init = function () {
        // instance of Map
        $scope.mapT = {entity: null};
        $rootScope.files=[];
        
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    
    $scope.initStory = function(){

        // get all story
        $scope.user_detail = UserService.getUser();
        console.log(UserService.getUser().user_id);
        $scope.get_all_story = {'user_id': UserService.getUser().user_id};
        
        APIService.get_All_Story($scope.get_all_story, function(result) {
            
            console.log(result);
            $ionicLoading.hide();
                
            if(result.status==1){
                console.log("Success ... ");

                $scope.placeMarkers(result.story_list); // Called create Marker method
                console.log(result.story_list);
            } else {
                console.log(result);
            }},function (err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Loading error'//JSON.stringify(err)
                });
            });
    }
        
    // Create a Google Map                 
    $scope.mapCreated = function(map) {
        
        console.log("Create Map .....");
        $scope.mapT.entity = map;  // this sets the map we just created in our directive to the $scope
        console.log($rootScope.lat);
        // $scope.setMapCenter($rootScope.lat,$rootScope.long);
        $scope.setMapCenter(48,2);
        $scope.myPlaceMarker($rootScope.lat, $rootScope.long);
        $scope.initStory();       
    };
        
    // Set Map Camera of Google Map
    $scope.setMapCenter = function(glat, glong) {
        $scope.mapT.entity.setZoom(8);
        $scope.mapT.entity.setCenter(new google.maps.LatLng(glat, glong));
    };
    
    // User's location marker
    $scope.myPlaceMarker = function(glat, glong) {
        var markerPosition = new google.maps.LatLng(glat, glong);
            var marker = new google.maps.Marker({  // this creates a new google map marker 
                
                position: markerPosition, // it uses uses the marker position we set above
                clickable: false,
                animation: google.maps.Animation.DROP,
                map: $scope.mapT.entity,  // it grabs the $scope.map which is set to the map we created
            });
    }
    
    // Create the Story PlaceMark on Google Map    
    $scope.placeMarkers = function(params){ // this function will be responsible for setting the markers on the map
                
        params.forEach(function(markeritem) {
            
            $rootScope.all_story = params;
            console.log(markeritem);
            
            var glat = markeritem['story_location_lat'];
            var glong = markeritem['story_location_long'];
            console.log(glat, glong);
            
            var markerPosition = new google.maps.LatLng(glat, glong);
            var marker = new google.maps.Marker({  // this creates a new google map marker 
                position: markerPosition, // it uses uses the marker position we set above
                
                clickable: true,
                animation: google.maps.Animation.DROP,
                map: $scope.mapT.entity,  // it grabs the $scope.map which is set to the map we created
                icon: 'img/marker.png', // this is the google maps icon
                title: 'Hello World!'
            });
            
            // Show menu when tapped Marker                
            google.maps.event.addListener(marker, 'click', function(){  // this listens for click events on the markers
                
                console.log(marker.position.lat());
                $rootScope.position = marker.position;
                $rootScope.showMenu();
            });
        }, this);
    }
    
    // Show Menu
    $scope.showMenu = function(){
        $ionicSideMenuDelegate.toggleLeft();
    }; 
    
    // Go Share Story Page    
    $rootScope.flag2 = 0;
    $scope.goShareStory = function() {
        $rootScope.flag2 = 1;
        $state.go('sharestory');
    }
    
    $scope.checkList =  [
                            {text:"New Stories", checked:true}, 
                            {text:"When I'm close",checked:true},
                            {text:"Assign to new place", checked:true}
                        ];
    
    // Show PopUp View
    $scope.popUpSetting = function(){
        $scope.data = {};
        var settingPopup = $ionicPopup.show({
            templateUrl:'templates/popup.html',
            cssClass:'popup popup-head',
            scope:$scope
        });
        
        // Go profile Page when user click the profile button        
        $scope.goFBProfile = function(){
            settingPopup.close();
            $location.path('/profile-edit');
        };
        
        // Go Friend Page when user click the friends button        
        $scope.goFriends = function(){
            settingPopup.close();
            $location.path('/places');
        };
        
        // Go familie Page when user click the familie button        
        $scope.goFamilie = function(){
            settingPopup.close();
            $location.path('/familie');
        };
        
        settingPopup.then(function(res) {
            console.log('tapped!', res);
        });
        
        // Close popupview        
        IonicClosePopupService.register(settingPopup);
        
    };      
})

// -------------------------------------------------------------------  Share Story View Controller  ----------------------------------------------------------------- //
.controller('ShareStoryCtrl', function($scope, $cordovaFile, $ionicLoading, $ionicPopup,IonicClosePopupService, $state, $stateParams, FileService, $ionicViewService, $rootScope, $cordovaCapture, $cordovaCamera, $ionicActionSheet) {
    
    $scope.init = function() {
        $scope.storyName = {text:""};
        $scope.media_data = {'story_file_type':'', 'story_file_name' : ''};
        $rootScope.finishStoryName = {
            'story_name':'',
            'story_location_lat' : '',
            'story_location_long' : '',
            'user_id' : '',         
            'story_files' : [],
            'story_description' : '',
            'story_address' : ''
        };
    }
    
    $scope.goBack= function() {
      if($rootScope.flag2 == 1){
          $state.go('single-map');
          $rootScope.flag2 = 0
      }else {
          $ionicViewService.getBackView().go();
        //   $state.go('showstories');
      }
    };
    
    $scope.goFinish = function(){
        $rootScope.finishStoryName.story_name = $scope.storyName.text;
        console.log("%",$rootScope.finishStoryName.story_name);
        $state.go('finishstory');
    };
        
    //  Take a Photo and Get image from photo gallery
    $scope.takePicture = function() {
        
        $scope.data = {};
        var settingPopup = $ionicActionSheet.show({
            buttons:[
                { text: "Take a Photo"},
                { text: "Take a image from Camera Roll"}
            ],
            cancelText: 'Cancel',
            cancel: function () {
                
            },
            buttonClicked: function(index) {
                if (index == 0) {               // Take a photo using Camera
                    
                    settingPopup();             // hide actionsheet                             
                    var options = { 
                        quality : 75, 
                        destinationType : Camera.DestinationType.DATA_URL, 
                        sourceType : Camera.PictureSourceType.CAMERA, 
                        allowEdit : true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 300,
                        targetHeight: 300,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };
                    
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.media_data = {
                            'story_file_type' : 'image',
                            'story_file_name' : imageData
                        };
                        $rootScope.finishStoryName.story_files.push($scope.media_data);
                        $rootScope.files.push(2);
                    }, function(err) {
                        // An error occured. Show a message to the user
                    });
                    
                }else if(index == 1){           // Get Image from Camera Roll
                    
                    settingPopup();
                    var options = { 
                        quality : 75, 
                        destinationType : Camera.DestinationType.DATA_URL, 
                        sourceType : 0, 
                        allowEdit : true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 300,
                        targetHeight: 300,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };
            
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.media_data = {
                            'story_file_type' : 'image',
                            'story_file_name' : imageData
                        };
                        $rootScope.finishStoryName.story_files.push($scope.media_data);
                        $rootScope.files.push(2);
                    }, function(err) {
                        // An error occured. Show a message to the user
                    });
                }
            }
        });
    };
    
    // Record Video
    $scope.recordVideo = function() {
       var options = {limit:1, duration:10, quality:1};
       var s = $rootScope.files.length;
       console.log("asdfasdf %d", s);
       
       $cordovaCapture.captureVideo(options).then(function (videoData) {
           $ionicLoading.show({
                template: 'loading'
            });
           console.log(videoData[0].fullPath);
           
           var fileDir = videoData[0].fullPath.replace(/[^\/]*$/, '');
           var fileName = videoData[0].fullPath.replace(/^.*[\\\/]/, '');
           console.log(fileDir);
           console.log(fileName);
           $cordovaFile.readAsBinaryString(fileDir, fileName).then(function(result) {
               $ionicLoading.hide();
               var story_file_video  = btoa(result);
               $scope.media_data = {
                    'story_file_type' : 'video',
                    'story_file_name' : story_file_video
                };
                console.log(story_file_video);
                $rootScope.finishStoryName.story_files.push($scope.media_data);
                $rootScope.files.push(3);
           }, function(error) {
               $ionicLoading.hide();
               console.log(error);
               return undefined;
           });

       }, function (err) {
           console.log(error);
       })
    };
    
    // Record Audio
    $scope.recordAudio = function() {
        var options = {limit:1, duration:10, quality:10};
        $cordovaCapture.captureAudio(options).then(function(AudioData) {
            $ionicLoading.show({
                template: 'loading'
            });
           var fileDir = AudioData[0].fullPath.replace(/[^\/]*$/, '');
           var fileName = AudioData[0].fullPath.replace(/^.*[\\\/]/, '');
           console.log(fileDir);
           console.log(fileName);
           window.plugins.Base64.encodeFile(AudioData[0].fullPath, function (base64) {
                $scope.media_data = {
                    'story_file_type' : 'audio',
                    'story_file_name' : base64
                };
                console.log(base64);
                $rootScope.finishStoryName.story_files.push($scope.media_data);
                $rootScope.files.push(1);
                $ionicLoading.hide();
            })
        }, function(err){
            
        });
    };
    
    // Show PopUp View
    $scope.addText = function(){
        $scope.data = {};
        var settingPopup = $ionicPopup.show({
            templateUrl:'templates/add_text.html',
            cssClass:'popup popup-head',
            scope:$scope,
            buttons:[
                    {
                        text:'<b> Done </b>', 
                        type:'button button-icon button-positive ion-checkmark',     
                        onTap: function(){
                            
                            $scope.media_data = {
                                'story_file_type' : 'text',
                                'story_file_name' : $scope.txtStory
                            };
                            console.log($scope.txtStory);
                            $rootScope.finishStoryName.story_files.push($scope.media_data);
                            $rootScope.files.push(1);
                        }
                    }
                ]
        });
        
        IonicClosePopupService.register(settingPopup);
        
    };

    $scope.editRmFile = function (params) {
        var editPopUp = $ionicPopup.alert({
            scope : $scope,
            buttons : [
                {
                    text:'<b> Edit </b>',
                    type: 'button button-positive',
                    onTap: function() {

                    }
                },
                {
                    text:'<b>Remove</b>',
                    type: 'button button-positive',
                    onTap: function() {
                        $rootScope.finishStoryName.story_files.splice(params);
                        $scope.files.splice(params);
                    }
                }
            ]
        })
    };      
    
})

// --------------------------------------------------------------------  Finish Share story controller ------------------------------------------  //
.controller('FinishStoryCtrl', function($scope, $rootScope, $state, $stateParams, UserService, APIService, $ionicLoading, $ionicViewService, $ionicPopup, IonicClosePopupService) {
    
    $scope.init = function() {
        
        $scope.story_description = { 'text' : $rootScope.story_descript }; 
        $scope.where_selects = [];
        $scope.friendList = [];
        
        var user = UserService.getUser();
        var request_data = {'user_id' : user.user_id};
        $ionicLoading.show({
            template: 'loading'
        });
        
        APIService.get_places(request_data, function(result){
            
            if(result.status == 1) {
                
                console.log(result.msg);
                result.story_detail.forEach(function(place_item) {
                    $scope.where_selects.push({
                        value: place_item.story_address,
                        isChecked: false,
                        'story_location_lat': place_item.story_location_lat,
                        'story_location_long': place_item.story_location_long 
                    });
                }, this)
                if ($rootScope.finishStoryName.story_address != '') {
                    $scope.where_select = { 
                        value : $rootScope.finishStoryName.story_address, 
                        isChecked : true,
                        'story_location_lat': $rootScope.finishStoryName.story_address.story_location_lat,
                        'story_location_long': $rootScope.finishStoryName.story_address.story_location_long 
                    };
                    $scope.where_selects.push($scope.where_select);
                }
                
                $ionicLoading.hide();
            } else {
                console.log(result.msg);
                $ionicLoading.hide();
            }
        }, function(error){
            console.log(error.msg);
            $ionicLoading.hide();
        });
        
       
        $rootScope.user_friend_list.forEach(function(item) {
            item['Checked'] = false;
            $scope.friendList.push(item);
        }, this);
    }
    
    $scope.goBack = function(){
        $ionicViewService.getBackView().go();
    };
    $scope.goWhere = function(){
        $rootScope.story_descript = document.getElementById('story_description').value;
        $state.go('wheremap');
    };
    
    $scope.shareFriendType = [
        { text:"All assigned", checked:false},
        { text:"Spouse(bf/gf)", checked:false},
        { text:"Kids and grandkids", checked:false},
        { text:"Parents and grandparents", checked:false},
        { text:"Brothers and sisters", checked:false},
        { text:"Others", checked:false}
    ];
    
    $scope.selectWithFacebook = function(){
        $scope.data = {};
            var selectWithFacebook = $ionicPopup.show({
                title:"Select friends share with facebook", 
                templateUrl:'templates/selectwithfacebook.html',
                cssClass:'popup popup-head popup-body',
                scope:$scope,
                buttons: [
                    {
                        text:'<b> Done </b>', 
                        type:'button button-icon button-positive ion-checkmark',     
                        onTap: function(){
                            
                        }
                    }
                ]
            });
            
           IonicClosePopupService.register(selectWithFacebook);
    };
    
    $scope.goFinish = function() {
        
        $rootScope.finishStoryName.start_time = document.getElementById('whenStory_start').value;
        $rootScope.finishStoryName.end_time = document.getElementById('whenStory_end').value;
        $rootScope.finishStoryName.story_description = document.getElementById('story_description').value;
        var indexPath = document.getElementById('get_where').selectedIndex
        $rootScope.finishStoryName.story_address = $scope.where_selects[indexPath].story_address;
        $rootScope.finishStoryName.story_location_lat = $scope.where_selects[indexPath].story_location_lat;
        $rootScope.finishStoryName.story_location_long = $scope.where_selects[indexPath].story_location_long;
        
        console.log($scope.where_selects[indexPath].value);
        console.log(indexPath);
        var user = UserService.getUser();
        $rootScope.finishStoryName.user_id = user.user_id;
        
        var selectWithFacebook = $ionicPopup.show({
                template:"Share The Story",
                cssClass:'popup popup-head popup-body',
                scope:$scope,
                buttons: [
                    {
                        text:'<b> Done </b>', 
                        type:'button button-icon button-positive ion-checkmark',     
                        onTap: function(){
                            $ionicLoading.show({
                                template: 'loading'
                            });
                            
                            APIService.add_story( $rootScope.finishStoryName, function(result){
                                
                                console.log(result.msg);
                                
                                if (result.status == 1) {
                                    $ionicLoading.hide();
                                    $state.go('single-map');
                                } else {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        template: 'story add failed'
                                    });
                                }
                            }, function (error) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                        template: 'error.msg'
                                    });
                            });
                        }
                    }
                ]
            });
            
           IonicClosePopupService.register(selectWithFacebook);
    };

    editRmFile = function (params) {
        console.log(params);
        var editPopUp = $ionicPopup.alert({
            scope : $scope,
            buttons : [
                {
                    text:'<b> Edit </b>',
                    type: 'button button-positive',
                    onTap: function() {

                    }
                },
                {
                    text:'<b>Remove</b>',
                    type: 'button button-positive',
                    onTap: function() {
                        $rootScope.finishStoryName.story_files.splice(params);
                        $scope.files.splice(params);
                    }
                }
            ]
        })
    };
    
})

//  --------------------------------------------------------------------- WhereMapCtrl ------------------------------------------------------- //
.controller('WhereMapCtrl', function($scope, $rootScope, $location, $stateParams, $state, $ionicViewService) {
    
    $scope.goBack = function() {
        $ionicViewService.getBackView().go();
    };
    
    $scope.mapT = {entity: null};
    var input = document.getElementById('pac-input')

    $scope.mapCreated = function(map) {

        var glat = $rootScope.lat;
        var glong = $rootScope.long;
        
        $scope.mapT.entity = map;  // this sets the map we just created in our directive to the $scope
        // $scope.setMapCenter(glat, glong);
        $scope.setMapCenter(glat, glong);
        var marker = $scope.placeMarkers(); // we *can* initialize the map with markers if we need to here
        google.maps.event.addListener(map, 'click', function(event){
            
            console.log('asdgasfgasdfasdfasdfasdf', event.latLng.lat(), event.latLng.lng());
            // $scope.placeMarkers();
            marker.setPosition(new google.maps.LatLng(event.latLng.lat(),event.latLng.lng()));
            console.log('asdgasfgasdfasdfasdfasdf', marker);
            $scope.getGeoCode(event.latLng.lat(), event.latLng.lng());
        });
    };
    
    $scope.getGeoCode = function(latitude, longitude) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        
        geocoder.geocode({'location' : latlng}, function(result, status) {
           console.log("Geocode result" , result); 
           $rootScope.finishStoryName['story_address'] = result[0].address_components[1].long_name;
           $rootScope.finishStoryName['story_location_lat'] = latitude;
           $rootScope.finishStoryName['story_location_long'] = longitude;
           
           console.log("Geocode result" , $rootScope.finishStoryName);
        });
    };

    $scope.setMapCenter = function(glat, glong) {
        $scope.mapT.entity.setZoom(12);
        $scope.mapT.entity.setCenter(new google.maps.LatLng(glat, glong));
    };
    
    $scope.placeMarkers = function(){ // this function will be responsible for setting the markers on the map
        
        // var glat = $rootScope.lat;
        // var glong = $rootScope.long;
        var glat = 48;
        var glong = 2;
        var markerPosition = new google.maps.LatLng(glat, glong); // this is the google api code that takes a latitude and longitude position
        
        var image = {
            url: 'https://lh3.ggpht.com/FyJy3O3mzyRTLegsANXWynqySqfI0ujExkGTjjkkdPGzfnBFNAdRAYS-UjMQJ6pQRA=w300',
            size: new google.maps.Size(25, 25),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 10)
        };

        var marker = new google.maps.Marker({  // this creates a new google map marker 
            position: markerPosition, // it uses uses the marker position we set above
            
            clickable: true,
            animation: google.maps.Animation.DROP,
            map: $scope.mapT.entity,  // it grabs the $scope.map which is set to the map we created
            icon: 'img/marker.png', // this is the google maps icon
            title: 'Hello World!'
        });
        
        //add event listener for marker
        google.maps.event.addListener(marker, 'click', function(){  // this listens for click events on the markers
        console.log('asdf');
            if($scope.openInfoWindow){
            $scope.openInfoWindow.close();
            }
        
            $scope.openInfoWindow.open($scope.mapT.entity, marker);
        });
        
        return marker;
    }
})
.controller('ProfileEditCtrl', function($scope, $location, $stateParams, $state, $ionicViewService, $ionicSlideBoxDelegate) {

  $scope.goBack = function(){
    $state.go('single-map');
  }

})
.controller('PlacesCtrl', function($scope, $location, $stateParams, $state, APIService, UserService, $ionicViewService, $ionicLoading, $ionicPopup) {
    
    $scope.init = function () {
        var user = UserService.getUser();
        $scope.placeItems = [];
        $ionicLoading.show({
            template: 'Loading...'
        })
        APIService.get_whereplace({'user_id': user.user_id}, function(result) {
            if(result.status == 1) {
                $scope.placeItems = result.story_detail;
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    template:result.msg
                });
            }
        }, function(error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                template:error.msg
            });
        });
    }
    
      $scope.goMaintainPlaces = function(){
          $state.go("maintain-places");
      };
      $scope.goBack = function(params){
          $rootScope.lat1 = params.story_location_lat;
          $rootScope.long1 = params.story_location_long;
           $state.go("single-map");
      };
      $scope.goMap = function(){
          $state.go('place-map');
      }
})
.controller('FamilieCtrl', function($scope, $location, $stateParams, $state, $ionicViewService){
    $scope.placeItems = [
                        { 
                            "imgUrl":"img/Sport-1.jpeg"
                            ,"adminName":"Alice Thora Nilsen"
                        }
                        ,{
                            "imgUrl":"img/Sport-2.jpeg"
                            ,"adminName":"Soren Vittrup"    
                        }
                        ,{
                            "imgUrl":"img/Sport-3.jpeg"
                            ,"adminName":"Morten Hjorth Nilsen"
                        }
                        ,{
                            "imgUrl":"img/Sport-3.jpeg"
                            ,"adminName":"Alice Thora Nilsen"
                        }];
    $scope.goBack = function(){
        
        $state.go("single-map");
    };
    $scope.goMaintainPlaces = function(){
          $location.path("sharestory");
      };
})
.controller('MaintainPlacesCtrl', function($scope, $location, $rootScope, $stateParams, $state, $ionicViewService, $ionicSlideBoxDelegate, $ionicPopup, IonicClosePopupService, UserService) {

  $scope.goBack = function(){
     $ionicViewService.getBackView().go();
  };
   $scope.goWhere = function(){
     $state.go('wheremap');
  };
  
  $scope.init = function() {
      $scope.friendList = [];
      $rootScope.getFiends();
      
      $rootScope.user_friend_list.forEach(function(item) {
          item['Checked'] = false;
          $scope.friendList.push(item);
      }, this)
      
  }
  $scope.selectWithFacebook = function(){
        $scope.data = {};
            var selectWithFacebook = $ionicPopup.show({
                title:"Select friends share with facebook", 
                templateUrl:'templates/selectwithfacebook.html',
                cssClass:'popup popup-head popup-body',
                scope:$scope,
                buttons: [
                    {
                        text:'<b> Done </b>', 
                        type:'button button-icon button-positive ion-checkmark',     
                        onTap: function(){
                            
                        }
                    }
                ]
            });
            IonicClosePopupService.register(selectWithFacebook);
    };
})
.controller('ShowStoriesCtrl', function($scope, $location, $state, $ionicViewService, $rootScope) {
   
   // init function
   $scope.init = function(){
       $scope.storyDetail = $rootScope.showStory.story_detail;
       console.log("asdfsdfsad---",$scope.storyDetail);
   }
   
   // back function when clicked back button in nav bar
    $scope.goBack = function(){
        $state.go('single-map');
    }
    
    // add comment button clicked
    $scope.goAddComment = function(){
        $state.go('add-comment');
    }
    
    // comment detail button clicked
    $scope.goComment = function(){
        $scope.a = 0;
        $location.path('leave-comment');
    }
    
})

.controller('AddCommentCtrl', function($scope, $location, $state, $ionicLoading, $ionicPopup, UserService, $ionicActionSheet, APIService, $ionicViewService, $rootScope, $cordovaCamera){
    
    $scope.init = function () {
        $scope.imageString = '';
        $scope.story_detail = $rootScope.showStory.story_detail;
    };
    
    $scope.goBack = function() {
         $ionicViewService.getBackView().go();
        // $state.go('leave-comment')
    };
    $rootScope.flagImage=0;
    $scope.add_comment_data = {};
    $scope.takePicture = function() {
        
        $scope.data = {};
        var settingPopup = $ionicActionSheet.show({
            buttons:[
                { text: "Take a Photo"},
                { text: "Take a image from Camera Roll"}
            ],
            cancelText: 'Cancel',
            cancel: function () {
                
            },
            buttonClicked: function(index) {
                if (index == 0) {
                    settingPopup();
                    var options = { 
                        quality : 75, 
                        destinationType : Camera.DestinationType.DATA_URL, 
                        sourceType : Camera.PictureSourceType.CAMERA, 
                        allowEdit : true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 300,
                        targetHeight: 300,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };
                    $rootScope.flagImage=0;
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.imageString = imageData;
                        $rootScope.files.push(2);
                        $rootScope.flagImage=1;
                    }, function(err) {
                        // An error occured. Show a message to the user
                    });
                }else if(index == 1){
                    settingPopup();
                    var options = { 
                        quality : 75, 
                        destinationType : Camera.DestinationType.DATA_URL, 
                        sourceType : 0, 
                        allowEdit : true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 300,
                        targetHeight: 300,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };
                    $rootScope.flagImage=0;
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.imageString = imageData;
                        $rootScope.files.push(2);
                        $rootScope.flagImage=1;
                    }, function(err) {
                        // An error occured. Show a message to the user
                    });
                }
            }
        });
    };
    
    $scope.addComment = function() {
        $scope.add_comment_data['story_comments'] = document.getElementById('txtComment').value;
        $scope.add_comment_data['story_comment_photo'] = $scope.imageString;
        $scope.add_comment_data['user_id'] = UserService.getUser().user_id;
        $scope.add_comment_data['story_id'] = $rootScope.showStory.story_detail.story_id;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        // var today = dd+'/'+mm+'/'+yyyy;
        $scope.add_comment_data['story_comment_date'] = today;
        
        console.log($scope.add_comment_data);
        
        $ionicLoading.show({
            template: 'loading....'
        });
        
        APIService.add_comment($scope.add_comment_data, function(result){
           console.log(result);
           if(result.status == 1) {
               console.log(result.msg);
               $ionicPopup.alert({
                    template: 'Comment add successfully'
                });
               $ionicLoading.hide();
           } else {
               $ionicLoading.hide();
               console.log(result.msg);
               $ionicPopup.alert({
                    template: 'Add Comment failed'
                });
           }
        }, function(error){
            $ionicLoading.hide();
            console.log(error.msg);
            $ionicPopup.alert({
                template: error.msg
            });
        });
        
    };
    
})
.controller('LeaveCommentCtrl', function($scope, $rootScope, APIService, $location, $stateParams, $state, $ionicSlideBoxDelegate, $ionicViewService ,$ionicPopup) {
  
  
  $scope.init = function() {
      var story_Detail = $rootScope.showStory.story_detail;
      $scope.request_comment = {'story_id': story_Detail.story_id};
      $scope.view_title = story_Detail.story_address;
      $scope.view_timeRange = story_Detail.start_itme + story_Detail.end_time;
      
      console.log('request_comment',$scope.request_comment);
      
      APIService.get_story_comment($scope.request_comment, function(result){
          console.log(result);
          
          if (result.status == 1) {
             $scope.story_comments = result.story_detail;
             console.log($scope.story_comments); 
          } else {
              
          }}, function(error) {
          
      });
  };
 
 
 
  $scope.goBack= function() {
      if($rootScope.flag1 == 1){
          $state.go('single-map');
          $rootScope.flag1 == 0;
      }else {
        //   $ionicViewService.getBackView().go();
          $state.go('showstories');
      }
    
  };
  $scope.goAddComment = function(){
      $state.go('add-comment');
  };  
})
.controller('ShowPlaces', function($scope, $rootScope, $ionicViewService, $location, $stateParams, $state){
    $scope.goBack = function() {
        $ionicViewService.getBackView().go();
    };
    
    $scope.mapT = {entity: null};
    
    $scope.mapCreated = function(map) {

        var glat = $rootScope.lat;
        var glong = $rootScope.long;
        
        $scope.mapT.entity = map;  // this sets the map we just created in our directive to the $scope
        // $scope.setMapCenter(glat, glong);
        $scope.setMapCenter(glat, glong);
        var marker = $scope.placeMarkers(); // we *can* initialize the map with markers if we need to here
        
    };
    
    $scope.setMapCenter = function(glat, glong) {
        $scope.mapT.entity.setZoom(12);
        $scope.mapT.entity.setCenter(new google.maps.LatLng(glat, glong));
    };
    
    $scope.placeMarkers = function(){ // this function will be responsible for setting the markers on the map
        
        var glat = $rootScope.lat1;
        var glong = $rootScope.long1;
        
        var markerPosition = new google.maps.LatLng(glat, glong); // this is the google api code that takes a latitude and longitude position
        
        var image = {
            url: 'https://lh3.ggpht.com/FyJy3O3mzyRTLegsANXWynqySqfI0ujExkGTjjkkdPGzfnBFNAdRAYS-UjMQJ6pQRA=w300',
            size: new google.maps.Size(25, 25),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 10)
        };

        var marker = new google.maps.Marker({  // this creates a new google map marker 
            position: markerPosition, // it uses uses the marker position we set above
            
            clickable: true,
            animation: google.maps.Animation.DROP,
            map: $scope.mapT.entity,  // it grabs the $scope.map which is set to the map we created
            icon: 'img/marker.png', // this is the google maps icon
            title: 'Hello World!'
        });
        
        return marker;
    }
});

