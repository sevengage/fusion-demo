/*
	Google Maps Directive
------------------------------------------------------------------ */
fusionDashboard.directive("map", ["fusion", function (fusion){
	return{
		scope: {
			zoom: "=zoom",
			height: "=height",
			width: "=width",
			markers: "=markers"
		},
		restrict: "E",
		template: "<div id='googleMap'></div>",
		link: function($scope, element){
			var map, mapElement = document.getElementById('googleMap');


			// inital setup of the map.  Defaults the center to Atlanta, GA.
			function init(){
				var	mapOptions = {
					zoom: $scope.zoom,
					center: new google.maps.LatLng(33.7550, -84.3900)
				};
				
				$(mapElement).height($scope.height).width($scope.width);

				map = new google.maps.Map(mapElement, mapOptions);
			}



			// Adds markers to the Map
			function addMarkers(){
				var checkIns = $scope.markers.length, i, marker,
					latlngbounds = new google.maps.LatLngBounds();

				for (i = checkIns - 1; i >= 0; i-=1) {
					var latLng = new google.maps.LatLng($scope.markers[i].lat, $scope.markers[i].lon);

					marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: "Me"
					});

					latlngbounds.extend(latLng);
				}

				map.fitBounds(latlngbounds);
			}


			// removes the markers from the map
			function deleteMarkers(){
				var i;

				for (i = 0; i < $scope.markers.length; i++) {
					$scope.markers[i].setMap(null);
				}
			}


			// listens for the broadcast to refresh the map markers
			$scope.$watch("markers", function (newVal, oldVal){
				if(newVal !== oldVal){
					addMarkers();
				}
			});


			google.maps.event.addDomListener(window, 'load', init);

		}
	};
}]);



/*
	Notificaitons Directive
------------------------------------------------------------------ */
fusionDashboard.directive("notifications", ["$timeout", function ($timeout){
	return{
		restrict: "E",
		replace: true,
		template: ['<div id="notification" class="notification-module rounded-corners">',
						'<a href="" class="notification-close"><i class="icon-cross"></i></a>',
						'<div class="notification-status rounded-corners in"><i class="icon-dot-single"></i></div>',
						'<h3 class="notificaiton-name">Marshall Grant</h3>',
						'<p class="notificaiton-detail">Checked in at 10:03 PM</p>',
					'</div>'].join(" "),
		link: function($scope, element){

			$scope.$on("dataLoaded", function (event, data){
				if(data){
					animateNotification(true);

					$timeout(function(){
						animateNotification(false);
					}, 4000);
				}
			});


			// runs our animation
			function animateNotification(value){
				$(element).toggleClass("active", value);
			}


		}
	};
}]);




