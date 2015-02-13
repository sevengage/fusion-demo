
!function (angular, app, $, fusionApp){
	var msg = app.config.messages;


	/* Check the user in and disable form
	-----------------------------------------------*/
	fusionApp.directive("checkInCheck", ["$window", "$timeout", function ($window, $timeout){
		return {
			restrict: "AC",
			template: '<a href="" class="ui-btn btn" id="checkMeIn">Check Me In</a>',
			link: function($scope, element){

				function checkInConfirm(){
					if($scope.App.staffid && $scope.App.storeNumber && $scope.App.inventory && $scope.App.price && $scope.App.demoLocation){
						$("#checkIn").find("input").attr("readonly", true).end()
							.find("select").selectmenu('disable');

						element.replaceWith("<div class='green ui-btn btn'>Thanks! You're in!</div>");

						$scope.checkedIn = true;

						$timeout(function(){
							$window.location.hash = "#report";
						}, 1000);

					}else{
						$window.alert(msg.havent_checked_in);
					}
				}

				//bind to the element
				element.click(function (){
					checkInConfirm();
				});

			}
		};
	}]);



	/* Adds new interactions to the list
	-----------------------------------------------*/
	fusionApp.directive("addInteractions", ["utility", "now", function (utility, now){
		return{
			restrict: "A",
			link: function($scope, element){
				element.click(function(){

					$scope.$apply(function(){

						$scope.App.interactions.push({
							type: $scope.type.value ? $scope.type.value : "",
							familiar: $scope.familiar ? $scope.familiar : "",
							krazyGlue: $scope.krazyGlue ? $scope.krazyGlue : "",
							gorillaGlue: $scope.gorillaGlue ? $scope.gorillaGlue : "",
							comments: $scope.comments ? $scope.comments : "",
							date: now.getDate(),
							time: now.getTime(),
						});

						$scope.App.numberOfInteractions = $scope.App.interactions.length;

						//resets the form data
						$scope.type = "";
						$scope.familiar = false;
						$scope.krazyGlue = false;
						$scope.gorillaGlue = false;
						$scope.comments = "";

						utility.resetForm("#add");

					});

				});
			}
		};
	}]);



	/* performs geo location and sets the map
	-----------------------------------------------*/
	fusionApp.directive("geoLocation", ["$window", function ($window){
		return{
			restrict: "E",
			template:	['<div id="userLocation">',
							'<p class="alert alert-error center geoloc-prompt lose-txt">For reporting accuracy, please allow this application to detect your current location.</p>',
						'</div>'].join(""),
			replace: true,
			link: function($scope, element){
				var geo_options = {
						enableHighAccuracy: true,
						maximumAge: 30000,
						timeout: 27000
					};

				if ("geolocation" in navigator) {
					navigator.geolocation.getCurrentPosition(function (position){
						var img, address, coords = {lat: position.coords.latitude, lon: position.coords.longitude};
						
						$scope.App.position = coords;
						
						img = new Image();
						img.src = app.config.googleApis.maps +"/staticmap?maptype=roadmap&zoom=18&size=900x200&markers=color:red|label:A|"+ coords.lat +","+ coords.lon +"&key="+ app.config.googleKey +"";
						img.style.width = "100%";
						$("#userLocation").html(img);


						$.get(app.config.googleApis.maps + "/geocode/json?latlng="+ coords.lat +","+ coords.lon +"&key="+ app.config.googleKey +"" , function(data){
							$scope.App.checkedInAddress = " Aprox. "+ data.results[0].formatted_address;
						});

					},geo_error, geo_options);
				}

				function geo_error() {
					$window.alert(msg.geo_position_error);
				}

			}
		};
	}]);



}(window.angular, window.app, window.jQuery, window.fusionApp);
