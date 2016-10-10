MyStoryPlace
/**
 * For test, we use proxy
  */
    .constant('ApiEndpoint', {
        // url: 'http://localhost/backend_memoryLane/api'
        url: 'http://54.77.2.144/mhn_old/backend_memoryLane/api'
    })
   
    .service('ModalService', function($ionicModal, $rootScope) {


        var init = function(tpl, $scope) {

            var promise;
            $scope = $scope || $rootScope.$new();

            promise = $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                return modal;
            });

            $scope.openModal = function() {
                $scope.modal.show();
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            return promise;
        }

        return {
            init: init
        }

    })
    .service('UserService', function() {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function(user_data) {
        window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function(){
        return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
        getUser: getUser,
        setUser: setUser
    };
    })
    .factory('APIService', function ($resource,ApiEndpoint) { // Using ngResource service ,good
        var data = $resource(
            ApiEndpoint.url,
            {},
            {
                get_whereplace: {
                    url: ApiEndpoint.url + '/get_whereplace',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    }
                },
                get_places: {
                    url: ApiEndpoint.url + '/get_places',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    }
                },
                add_story: {
                    url: ApiEndpoint.url + '/add_story',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    }
                },
                add_comment: {
                    url: ApiEndpoint.url + '/add_comment',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    }
                },
                get_story_comment: {
                    url: ApiEndpoint.url + '/get_story_comment',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    }
                },
                get_All_Story: {
                    url: ApiEndpoint.url + '/all_story',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    }
                },
                get_Story: {
                    url: ApiEndpoint.url + '/get_story',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    }
                },
                register: {
                    url: ApiEndpoint.url + '/user_signup',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    } 
                },
                login: {
                    url: ApiEndpoint.url + '/user_login',
                    method:'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8',
                        'api-key' : 'j05wd2ae49d212578ef13cb607cef64b'
                    } 
                },              
               
                orderNow: {
                    url: ApiEndpoint.url + '/pages/orderNow',
                    method:'POST'
                }
            });
        return data;
    })
    .service('FileService', function($cordovaFile) {
       this.readFile = function(path) {
           
        //    var fileDir = path.match(/([^\/]*)\/*$/)[1];
        //    var fileName = path.replace(/^.*[\\\/]/, '');
           $cordovaFile.readFile(path).then(function(result) {
               return 'data:video/mp4;base64,' + result;
               
           }, function(error) {
               return undefined;
           });
       }; 
    })
    .service('Session', ['$cookieStore', function ($cookieStore) {
        var localStoreAvailable = typeof (Storage) !== "undefined";
        this.store = function (name, details) {
            if (localStoreAvailable) {
                if (angular.isUndefined(details)) {
                    details = null;
                } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                    details = angular.toJson(details);
                };
                sessionStorage.setItem(name, details);
            } else {
                $cookieStore.put(name, details);
            };
        };

        this.persist = function(name, details) {
            if (localStoreAvailable) {
                if (angular.isUndefined(details)) {
                    details = null;
                } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                    details = angular.toJson(details);
                };
                localStorage.setItem(name, details);
            } else {
                $cookieStore.put(name, details);
            }
        };

        this.get = function (name) {
            if (localStoreAvailable) {
                return getItem(name);
            } else {
                return $cookieStore.get(name);
            }
        };

        this.destroy = function (name) {
            if (localStoreAvailable) {
                localStorage.removeItem(name);
                sessionStorage.removeItem(name);
            } else {
                $cookieStore.remove(name);
            };
        };

        var getItem = function (name) {
            var data;
            var localData = localStorage.getItem(name);
            var sessionData = sessionStorage.getItem(name);

            if (sessionData) {
                data = sessionData;
            } else if (localData) {
                data = localData;
            } else {
                return null;
            }

            if (data === '[object Object]') { return null; };
            if (!data.length || data === 'null') { return null; };

            if (data.charAt(0) === "{" || data.charAt(0) === "[" || angular.isNumber(data)) {
                return angular.fromJson(data);
            };

            return data;
        };

        return this;
    }])
    
    .factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
        var self = this;

        // Handle query's and potential errors
        self.query = function (query, parameters) {
            parameters = parameters || [];
            var q = $q.defer();

            $ionicPlatform.ready(function () {
                $cordovaSQLite.execute(db, query, parameters)
                    .then(function (result) {
                        q.resolve(result);
                    }, function (error) {
                        //console.warn('I found an error');
                        //console.warn(error);
                        q.reject(error);
                    });
            });
            return q.promise;
        }

        // Proces a result set
        self.getAll = function(result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
        }

        // Proces a single result
        self.getById = function(result) {
            var output = null;
            output = angular.copy(result.rows.item(0));
            return output;
        }

        return self;
    })
    .factory('Cart', function ($localStorage) {
        var self = this;
        var localStoreAvailable = typeof (Storage) !== "undefined";
        // Set cart list
        self.storeAll = function (list) {
            if(localStoreAvailable){
                if(list && list.length > 0){
//console.log("*****************"+$localStorage);
                    $localStorage.cartList = JSON.stringify(list);
                    return list.length;
                }else{
                    return false;
                }
            }
        }

        /***
         *
         * @param id = {'netPrice','deliveryPrice','taxesPrice','grandTotalPrice'}
         * @param value
         */
        self.store = function (id, value) {
            $localStorage[id] = value;
        }

        self.fetch = function (id) {
            if(id){
                return $localStorage[id];
            }
            return false;
        }

        // Get cart list
        self.list = function () {
            if(localStoreAvailable){
                var c = [];
                if($localStorage.cartList){
                    c = JSON.parse($localStorage.cartList);
                }
                return c;
            }
        }

        // Get cart
        self.cart = function (id) {
            if(localStoreAvailable){
                var c = self.list();
                for(var k=0;k<c.length;k++){
                    if(c[k].Dish.id == id){
                        return c[k];
                    }
                }
                return false;
            }
        }

        // Replace item
        self.replace = function (item) {
            if(localStoreAvailable){
                var c = self.list();
                for(var k=0;k<c.length;k++){
                    if(c[k].Dish.id == item.Dish.id){
                        c[k] = item;
                    }
                }
                self.storeAll(c);
                return self.list();
            }
        }
        
        // Add cart
        self.add = function (item) {
            if(localStoreAvailable){
                var e = self.list();
                e.push(item);
                if(self.storeAll(e)){
                    return self.list();
                }else{
                    return false;
                }
            }
        }
        
        // Remove cart
        self.remove = function (id) {
            if(localStoreAvailable){
                var a = [],b = self.list();
                for(var k=0;k < b.length;k++){
                    if(b[k].Dish.id != id){
                        a.push(b[k]);
                    }
                }
                $localStorage.cartList = JSON.stringify(a);
                return a;
            }
        }
        
        // Remove all
        self.removeAll = function () {
            if(localStoreAvailable){
                delete $localStorage.cartList;
                return true;
            }
        }

        return self;
    })
    .factory('User', function ($localStorage, $rootScope, $state, $ionicLoading, $ionicPopup, APIService, $cordovaFacebook, $cordovaGooglePlus, $location ,Cart) {
        /***
         * User status manage variables
         var user = {
             id: 0,
             user_firstname: '',
             user_lastname: '',
             user_email: '',
             user_password: '',
             confirm_password: '',
             user_phoneNo: '',
             user_city: '',
             user_state: '',
             country: '',
             user_address: '',
             user_image: '',
             logintype_id: '',
             register_type: '',
             is_validatePhoneNo: '',
             is_active: ''
         };
         * $localStorage.loggedIn => bool
         * $localStorage.profile => user profile
         * $localStorage.loginType => Guest,Email,Fb,Google
         * $localStorage.guestId => Guest user id
         */
        var self = this;
        var localStoreAvailable = typeof (Storage) !== "undefined";

        self.isLoggedIn = function () {
            if(localStoreAvailable){
                if($localStorage.loggedIn){
                    return $localStorage.loggedIn;
                }else{
                    return false;
                }
            }
            return false;
        }

        // Get user profile
        self.profile = function () {
            var p = {
                id: 0,
                user_full_name: '',
              
                user_email: '',
                user_password: '',
                confirm_password: '',
                user_phoneNo: '',
                user_city: '',
                user_state: '',
                country: '',
                user_address: '',
                user_image: '',
                logintype_id: '',
                register_type: '',
                is_validatePhoneNo: '',
                is_active: ''
            };
            if(localStoreAvailable){
                if($localStorage.profile){
                    p = JSON.parse($localStorage.profile);
                }
            }
            return p;
        }

        // Store profile
        /**
         * How to use :
         *
         *  User.store(profile,'Guest'); // profile = { id: <guest_id> };
         *  User.store(profile,'Email');
         *  User.store(profile,'Fb');
         *  User.store(profile,'Google');
         *
         * @param profile
         * @param loginType
         * @returns {boolean}
         */
        self.store = function (profile,loginType) {
            if(localStoreAvailable){
                $localStorage.profile = JSON.stringify(profile);
                $localStorage.loggedIn = true;
                $localStorage.loginType = loginType || 'Guest';
                return true;
            }
        }

        // Remove user profile
        self.logout = function (callback) {

            $ionicLoading.show('Logout..');
            //User related
            var loginType = self.getLoginType();
            if(loginType === 'Fb'){
                // Facebook logout
                $cordovaFacebook.logout()
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                        $ionicPopup.alert({
                            title: 'Error',
                            template:'facebook logout error'
                        });
                    });
            }else if(loginType === 'Google'){
                // Google+ logout
                $cordovaGooglePlus.logout();
            }

            //if(localStoreAvailable){
            //    //delete $localStorage.profile;
            //    //delete $localStorage.loginType;
            //    //delete $localStorage.loggedIn;
            //    $localStorage.$reset();
            //    $ionicHistory.clearCache();
            //    $ionicHistory.clearHistory();
            //}

            $localStorage.$reset();
            // $ionicHistory.clearCache();
            // $ionicHistory.clearHistory();

            if(callback){
                callback();
            }else{
                $rootScope.$broadcast('user:logout',self.profile());
                setTimeout(function () {
                    $ionicLoading.hide();
                    $location.path("/welcome");
                },1000);
            }
        }

        // Get login type
        self.getLoginType = function () {
            if(localStoreAvailable){
                var p = 'Guest';
                if($localStorage.loginType){
                    p = $localStorage.loginType;
                }
                return p;
            }
        }

        // Set login type
        self.storeLoginType = function (type) {
            if(localStoreAvailable){
                var p = type || 'Guest';
                $localStorage.loginType = p;
                return true;
            }
        }

        // Get guest id
        self.getGuestId = function () {
            if(localStoreAvailable){
                var p = 'Guest';
                if($localStorage.guestId){
                    p = $localStorage.guestId;
                }
                return p;
            }
        }

        // Set guest id
        self.setGuestId = function (id) {
            if(localStoreAvailable){
                $localStorage.guestId = id;
                return true;
            }
        }

        // Login
        /**
            data = {
                user_email: '',
                user_password: '',
                register_type: 'Email',
                logintype_id: ''
            };
            data = {
                user_email: '',
                user_password: '',
                register_type: 'Fb',
                logintype_id: ''
            };
         * @param data
         */
        self.login = function (data,loginType, succCallback, errCallback) {
            try{
                $ionicLoading.show({template:'Login...'});
                APIService.login(
                    data,
                    function (result) {
                        $ionicLoading.hide();
                        // Do success
                        if(result.status){
                            //sucess
                            self.store(result.current_user,loginType);
                            succCallback && succCallback();
                        }else{
                            //error
                            errCallback && errCallback(result);
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title:'Info',
                            template: 'Login error!'//JSON.stringify(err)
                        });
                    }
                );
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }

        self.register = function (data,loginType,succCallback,errCallback) {
            try{
                $ionicLoading.show({template: 'Registering'});
                APIService.register(
                    data,
                    function(result){
                        $ionicLoading.hide();
                        if(result.status){
                            self.store(result.current_user,loginType);
              //              Cart.removeAll();
                            succCallback && succCallback(result);
                        }else{
                            errCallback && errCallback(result);
                        }
                    },
                    function (err) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Register Error',
                            template: 'Server connect error'//JSON.stringify(err)
                        });
                    }
                );
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }

        self.registerGuest = function (succCallback,errCallback) {
            try{
                $ionicLoading.show({
                    template: 'Logging in as guest'
                });
                APIService.getGuestId(
                    {},
                    function (result) {
                        $ionicLoading.hide();
                        if(!result.description.error){
                            self.store(
                                {
                                    id: result.description.data,
                                    register_type: 'Guest'
                                },
                                'Guest'
                            );
                            succCallback && succCallback();
                        }else{
                            $ionicPopup.alert({
                                title: 'Error',
                                template: result.description.error
                            });
                            errCallback && errCallback();
                        }
                    },
                    function (err) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Server connect error'//JSON.stringify(err)
                        });
                    }
                );
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }

        self.forgotPassword = function (data,succCallback) {
            try{
                $ionicLoading.show({template:'Sending...'});
                APIService.forgotPassword(
                    data,
                    function (succ) {
                        $ionicLoading.hide();
                        // Do success
                        if(!succ.description.error){
                            //sucess
                            $ionicPopup.alert({
                                title:succ.message,
                                template: succ.description
                            });
                            succCallback && succCallback();
                        }else{
                            //error
                            $ionicPopup.alert({
                                title:succ.message,
                                template: succ.description.error
                            });
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title:'Info',
                            template: 'Server connect error'//JSON.stringify(err)
                        });
                    }
                );
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }
        /**
         * Check user login data is valid or not
         * @param data
         * @returns {boolean}
         */
        self.isValidInfo = function(data){
            if(!data)return false;
            if(!data.user_name || !data.user_password){
                return false;
            }else{
                return true;
            }
        }

        self.confirmExit = function (callback) {
            $ionicPopup.confirm({
                title: 'Warning',
                template: 'Do you want to exit and close the application? All data will be lost'
            }).then(function(res) {
                callback && callback(res);
            })
        }

        return self;
    })
 .directive('map', function() {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
                },
            link: function ($scope, $element, $attr) {
                function initialize() {
                        var mapOptions = {
                            // center: new google.maps.LatLng(48.1149103,-1.672612),
                            zoom: 15,
                            zoomControl:false,
                            mapTypeControl:false,
                            scaleControl:false,
                            streetViewControl:false,
                            mapTypeId: google.maps.MapTypeId.Roadmap
                         };
                     var map = new google.maps.Map($element[0], mapOptions);
                     
        //               var marker = new google.maps.Marker({  // this creates a new google map marker 
        //     position: new google.maps.LatLng(48.1149103,-1.672612), // it uses uses the marker position we set above
        //     map: map,  // it grabs the $scope.map which is set to the map we created
        //     // icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' // this is the google maps icon
        //     title: 'Hello World!'
        //   });
                     
                     $scope.onCreate({map: map});
                            // Stop the side bar from dragging when mousedown/tapdown on the map
                     google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
                     e.preventDefault();
                     return false;
                 });
                }
                if (document.readyState === "complete") {initialize();
                } else {
                     google.maps.event.addDomListener(window, 'load', initialize);
                }
            }
        }
    })

    .factory('xmlParser', function () {
        var x2js = new X2JS();
        return {
            xml2json: function (args) {
                return angular.bind(x2js, x2js.xml2json, args)();
            },
            xml_str2json: function (args) {
                return angular.bind(x2js, x2js.xml_str2json, args)();
            },
            json2xml_str: function (args) {
                return angular.bind(x2js, x2js.json2xml_str, args)();
            }
        }
    })
    .factory('Payment',function ($localStorage, $http, $ionicLoading, $ionicPopup, User, ConvergeEndpoint,xmlParser) {
        var self = this,
            loginType = User.getLoginType();

        // Get profile payment
        self.getProfile = function () {
            var profile = User.get();

            return {
                //profile vars
                first_name:profile.user_firstname,
                last_name:profile.user_lastname,
                phone:profile.phone,
                email:profile.user_email,
                address:profile.user_address,
                city:profile.user_city,
                state:profile.user_state,
                zipcode:profile.zipcode,
                country:profile.country,
                //order details relate vars
                resort_id:'',
                restraurent_id:'',
                items:null,
                user_type:loginType,
                user_id:profile.id,
                //payment relate vars
                room_no:'',
                driver_tip:0,
                orderstatus:'0',
                payment_status:'',//"Pending"
                payment_type:'',//"Paypal"
                transaction_id:''//"xldokr8dkmkfmpl"
            };
        }

        // Payment submit to converge
        self.submitToConverge = function(form_data,succCallback,errCallback){
            var d = {
                ssl_merchant_id: '005457',
                ssl_user_id: 'webpage',
                ssl_pin: '2M2E64',
                ssl_transaction_type: 'ccsale',
                ssl_test_mode: true,
                ssl_card_number: '378282246310005',
                ssl_exp_date: '1216',
                ssl_amount: '61.11',
                ssl_description:'Test Transaction',
                products: 'Test ::1::001 Transaction::',
                ssl_cvv2cvc2_indicator:'1',
                ssl_cvv2cvc2:'0005',
                ssl_first_name:'test',
                ssl_last_name:'tester',
                ssl_company:'Test Company',
                ssl_avs_address:'666 champain hwp',
                ssl_city:'Knoxvilie',
                ssl_state:'TN',
                ssl_country:'USA',
                ssl_avs_zip:'37920',
                ssl_phone:'905-555-1234',
                ssl_email:'test@wjsskanyo.com'
            }
            //$http.post(ConvergeEndpoint.url, {
            //    params: d
            //})
            //$http({
            //    method: 'POST',
            //    url: ConvergeEndpoint.url
            //})
            //    .success(function(data) {
            //        alert("SUCCESS!" + JSON.stringify(data));
            //    })
            //    .error(function(data) {
            //        alert("ERROR" + JSON.stringify(data));
            //    });
            $ionicLoading.show({
                template: 'Submitting...'
            });
            var xml = '<txn><ssl_merchant_id>007126</ssl_merchant_id><ssl_pin>32968K</ssl_pin><ssl_user_id>webpage</ssl_user_id><ssl_test_mode>false</ssl_test_mode><ssl_transaction_type>ccsale</ssl_transaction_type><ssl_card_number>378282246310005</ssl_card_number><ssl_exp_date>0916</ssl_exp_date><ssl_amount>60.12</ssl_amount><ssl_description>Test Description</ssl_description><products>60.12::1::001::Test Description::</products><ssl_cvv2cvc2_indicator>1</ssl_cvv2cvc2_indicator><ssl_cvv2cvc2>005</ssl_cvv2cvc2><ssl_first_name>First</ssl_first_name><ssl_last_name>Last</ssl_last_name><ssl_company>TestCompany</ssl_company><ssl_avs_address>TEst address</ssl_avs_address><ssl_city>Paris</ssl_city><ssl_state>Paris</ssl_state><ssl_country>France</ssl_country><ssl_avs_zip>32487</ssl_avs_zip><ssl_phone>905-112-3332</ssl_phone><ssl_email>test@tt.com</ssl_email></txn>';
            var xml1 = '<txn><ssl_merchant_id>007126</ssl_merchant_id><ssl_user_id>webpage</ssl_user_id><ssl_pin>32968K</ssl_pin><ssl_test_mode>false</ssl_test_mode><ssl_transaction_type>ccsale</ssl_transaction_type><ssl_card_number>378282246310005</ssl_card_number><ssl_exp_date>0916</ssl_exp_date><ssl_amount>10.10</ssl_amount><ssl_cvv2cvc2_indicator>1</ssl_cvv2cvc2_indicator><ssl_first_name>Test</ssl_first_name><ssl_partial_auth_indicator>1</ssl_partial_auth_indicator></txn>';
            $http.post(ConvergeEndpoint.xml_url, xml1)
                .success(function(data) {
                    $ionicLoading.hide();
                    var dd = xmlParser.xml_str2json(data);
                    succCallback && succCallback(dd.txn);
                })
                .error(function(data) {
                    $ionicLoading.hide();
                    errCallback && errCallback(data);
                });
        }
        return self;
    })
;
