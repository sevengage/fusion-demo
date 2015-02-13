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
	Main App Controller
------------------------------------------------------------------*/

!function (angular, app, $, Firebase){

	//run add to home screen prompt
	window.addToHomescreen();


	/* App Controller
	----------------------------------------------------*/
	fusionApp.controller("FusionAppController", ["$scope", "$interval", "$window", "locStorage", "now", "utility", "loader", function ($scope, $interval, $window, locStorage, now, utility, loader){

		var count = 1, autoSave,
			useSaved = false,
			showOnce = 0,
			config = app.config,
			msg = config.messages,
			ref = new Firebase(config.firebase),
			presenceRef = new Firebase(config.firebase +'/disconnectmessage'),
			connectedRef = new Firebase(config.firebase + "/.info/connected");

		$scope.checkedIn = false;

		$scope.email = "";
		$scope.password = "";
		$scope.confirm_password = "";

		//Demo Controller Array for better formatting
		$scope.demos = [
			{label: "Rubber Hose Demo", value: "Rubber Hose Demo"},
			{label: "Dispenser Demo", value: "Dispenser Demo"},
			{label: "Drip Control Demo", value: "Drip Control Demo"},
			{label: "Strength Test Demo", value: "Strength Test Demo"}
		];

		/* Main App Model Data
		----------------------------------------*/
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

			if($scope.checkedIn){

				time = now.getTime();

				checkoutCheck = $window.confirm(msg.checkout_confirm);
				
				//make sure its only setting once
				if(count === 1 && Boolean(time) && checkoutCheck === true){
					$scope.App.timeOut = time;
					document.getElementById("timeOut").value = time;
					count += 1;
				}

				if(checkoutCheck === false){
					$window.location.hash = "#report";
				}

			}else{
				$window.alert(msg.havent_checked_in);
				$window.location.hash = "#checkIn";
			}


		};


		
		/* Checks localstorage to see if the user has a saved report
		----------------------------------------------------------------*/
		$scope.checkStorage = function(){
			var lastVersion;

			if( Boolean($window.localStorage.fusionHenkle) && useSaved === false){
				useSaved = $window.confirm(msg.use_last_saved);

				//If the person said yes, populate form from saved version in local storage
				if(useSaved === true){
					lastVersion = locStorage.get();

					lastVersion = $.parseJSON(lastVersion);

					$scope.$apply(function(){
						var items, i;

						//pushes saved items to the scope except for interactions
						for(items in lastVersion){
							if(items !== "interactions"){
								$scope.App[items] = lastVersion[items];
							}
						}

						//itterates though the saved interactions and pushes them to the scope
						for (i = lastVersion.interactions.length - 1; i >= 0; i -= 1) {
							$scope.App.interactions.push(lastVersion.interactions[i]);
						}
					});

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

				postsRef.push($scope.App, function (error){
					if(error === null){
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

					}else{
						$window.alert(msg.cant_save_data, error);
					}

				});

			}else{
				$window.alert(msg.havent_checked_in);
				$window.location.hash = "#checkIn";
			}

		};



		/* ----------------------------------------------------------------
			Login Auth Controller
		------------------------------------------------------------------*/

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
						app.config.loggedin = true;
						$window.location.hash = "#checkIn";

						$scope.startAutoSave();
						$scope.checkStorage();

						//checks our internet connection
						connectedRef.on("value", function(snap) {
							if (snap.val() !== true) {
								$window.alert(msg.lost_internet_connection);
							}
						});

					}else{
						$window.alert(error);
						loader.init(false);
						return false;
					}
				});

			}else{
				return false;
			}
			
		};


	}]);


}(window.angular, window.app, window.jQuery, window.Firebase);


