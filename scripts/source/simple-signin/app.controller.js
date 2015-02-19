/*===============================================================================================================
* Fusion Henkle Customer Interactions App
*
*	Purpose:
*		- Mobile App for associates when interacting with Custoemrs
*
*	Dependencies:
*		- Data: Submits via REST api to Firebase
*		- Libraries: AngularJS 1.2.6, jQuery 1.10.2, jQuery Mobile 1.4.2
*
*	Originally written by: Marshall Grant
* =================================================================================================================*/



/* ----------------------------------------------------
	Defacto Controllers that have some DOM interation
-------------------------------------------------------*/
!function (app, $){

	/* Show Hide Other Field
	-----------------------------------------*/
	function showHideOther(){
		var option = $("#location option:selected").val(),
			when = Boolean(option === "other");

		$("#whenOther, #whenOtherField").toggleClass('hide', !when);
	}


	/* Listners
	-----------------------------------------*/
	$(document)
		.on("change", "#location", showHideOther);

}(window.app, window.jQuery);







/* ----------------------------------------------------------------
	Login Auth Controller
------------------------------------------------------------------*/

	fusionApp.controller("LoginController", ["$scope", "$window", "utility", "loader", function ($scope, $window, utility, loader){
		var	config = app.config,
			msg = config.messages,
			ref = new Firebase(config.firebase),
			connectedRef = new Firebase(config.firebase + "/.info/connected");
		
		$scope.email = "";
		$scope.password = "";

		$scope.loginUser = function(){
			var fieldCheck = utility.loginCheck($scope, {
				username: "#email",
				password: "#pass"
			});

			if(fieldCheck){
				ref.authWithPassword({
					email: $scope.email,
					password: $scope.password
				
				}, function (error){
					if(error === null){
						
						$scope.$emit("login", {"email": $scope.email});

						//checks our internet connection
						connectedRef.on("value", function(snap) {
							if (snap.val() !== true) {
								$window.alert(msg.lost_internet_connection);
							}
						});

					}else{
						$window.alert(error);
						loader.init(false);
						return;
					}
				});

			}else{
				return;
			}
		};


	}]);





/* ----------------------------------------------------------------
	Main App Controller
------------------------------------------------------------------*/

	fusionApp.controller("FusionAppController", ["$scope", "$interval", "$window", "firebaseService", "locStorage", "now", "utility", "loader", function ($scope, $interval, $window, firebaseService, locStorage, now, utility, loader){

		var count = 1, autoSave,
			useSaved = false,
			showOnce = 0,
			config = app.config,
			msg = config.messages,
			ref = new Firebase(config.firebase);

		$scope.App = {};
		$scope.checkedIn = false;


		// listens for login
		$scope.$on("login", function (event, data){
			$scope.email = data.email;

			app.config.loggedin = true;

			$scope.App = firebaseService.getData();

			$scope.App.then(init);
		});


		//Demo Controller Array for better formatting
		$scope.demos = [
			{label: "Rubber Hose Demo", value: "Rubber Hose Demo"},
			{label: "Dispenser Demo", value: "Dispenser Demo"},
			{label: "Drip Control Demo", value: "Drip Control Demo"},
			{label: "Strength Test Demo", value: "Strength Test Demo"}
		];

		/* Main App Model Data
		----------------------------------------
		$scope.App = {
			title: "Fusion-Henkle",
			//checkin
			staffid: "",
			storeNumber: "",
			demoDate: now.getDate(),
			timeIn: now.getTime(),
			inventory: "",
			price: "",
			demoLocation: "",
			otherLocation: "",
			//checkout
			managerName: "",
			managerReaction: "",
			insights: "",
			pics_of_table: "",
			pics_of_display_demo_start: "",
			pics_of_interaction: "",
			pics_of_display_demo_end: "",
			timeOut: "",
			//client interactions
			interactions: [],
			numberOfInteractions: ""
		};

		*/

		function init(data){
			$scope.App = firebaseService.getUserData({
				email: $scope.email,
				data: data
			});

			if($scope.App.start === ""){
				angular.extend($scope.App, {
					date: now.getDate(),
					start: now.getTime(),
					//interactions: [],
					lat: $scope.lat,
					lon: $scope.lon,
					location: $scope.checkedInAddress
				});
				
			}else{
				$scope.checkedIn = true;
				utility.checkedIn(".checkInCheck");
			}

			$window.location.hash = "#checkIn";

			//$scope.startAutoSave();
			//$scope.checkStorage();

			console.log($scope.App);
		}
		


		//hide the browser
		utility.broswerScrollTo();


		//checks to see if you are in a session.  if not you will be redirected to the login screen
		if(!app.config.loggedin){
			$window.location.hash = "#login";
		}

		


		/* sets the checkout time on the checkout hash
		----------------------------------------------------------------*/
		$scope.setCheckOut = function(){
			var time, checkoutCheck;

			if($scope.App.start !== ""){

				if($scope.App.end === ""){
					
					time = now.getTime();

					checkoutCheck = $window.confirm(msg.checkout_confirm);
					
					//make sure its only setting once
					if(count === 1 && Boolean(time) && checkoutCheck === true){
						$scope.App.end = time;
						//document.getElementById("timeOut").value = time;
						count += 1;
					}

					$scope.App.hours = utility.setWorkedHours({
						date: $scope.App.date,
						start: $scope.App.start,
						end: $scope.App.end,
					});

					if(checkoutCheck === false){ $window.location.hash = "#report"; }

				}else{
					utility.hasCheckedOut();
				}
				

			}else{
				$window.alert(msg.havent_checked_in);
				$window.location.hash = "#checkIn";
			}


		};


		
		/* Checks localstorage to see if the user has a saved report
		----------------------------------------------------------------*/
		$scope.checkStorage = function(){
			var lastVersion, items, i;

			if( Boolean($window.localStorage.fusionHenkle) && useSaved === false){
				useSaved = $window.confirm(msg.use_last_saved);

				//If the person said yes, populate form from saved version in local storage
				if(useSaved === true){
					lastVersion = locStorage.get();

					lastVersion = $.parseJSON(lastVersion);

					//pushes saved items to the scope except for interactions
					for(items in lastVersion){
						if(items !== "interactions"){
							//$scope.App[items] = lastVersion[items];
						}
					}

					//itterates though the saved interactions and pushes them to the scope
					for (i = lastVersion.interactions.length - 1; i >= 0; i -= 1) {
						$scope.App.interactions.push(lastVersion.interactions[i]);
					}
					

				}else{
					localStorage.delete();
				}

				showOnce = 1;
			}
			
		};


		/* Auto Saves every 60 secons via the storage service
		----------------------------------------------------------------*/
		$scope.startAutoSave = function(){
			autoSave = $interval(function(){
				var currentlySaved = locStorage.get(),
					scopeStr = $scope.App;

				scopeStr = JSON.stringify(scopeStr);

				//if what is in local storage is smaller than what is currently in the form or empty, save what is in the form, otherwise dont overwrite
				if(currentlySaved.length <= scopeStr.length || currentlySaved === 0){
					locStorage.save(scopeStr);
				}
				
				utility.showSavedMessage();
			}, 60000);

		};




		/* stops the Auto Save
		----------------------------------------------------------------*/
		$scope.stopAutoSave = function(){
			if (angular.isDefined(autoSave)) {
				$interval.cancel(autoSave);
				autoSave = undefined;
			}
		};



		/* Build the data URL and Submit
		----------------------------------------------------------------*/
		$scope.submitReport = function(){
			var postsRef = ref.child("posts");

			if($scope.checkedIn){
				loader.init(true);
				firebaseService.update($scope.App).then(updateSuccess, updateFail);

			}else{
				$window.alert(msg.havent_checked_in);
				$window.location.hash = "#checkIn";
			}


			function updateSuccess(){
				loader.init(false);

				$window.alert(msg.submit_success);

				//delete saved report in local storage
				locStorage.delete();

				//stop the auto save
				$scope.stopAutoSave();

				//reset form controls
				utility.resetForm("#checkOut, #checkIn");

				//log the user out
				config.loggedin = false;

				//refresh the browser
				$window.location.href = $window.location.pathname;
			}


			function updateFail(){
				$window.alert(msg.cant_save_data, error);
			}



		};


	}]);


