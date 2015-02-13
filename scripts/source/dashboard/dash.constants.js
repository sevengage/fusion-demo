/*===============================================================================================================
* Fusion Dashboard Constants
*
*	Purpose:
*		- Dashboard Constants
*
*
*	Originally written by: Marshall Grant
* =================================================================================================================*/

var fusionDashboard = angular.module("dashboard", ["angular-chartist", "firebase"]);

/*
	Static Constants
--------------------------- */
fusionDashboard.constant('fusion', {
	config: {
		firebase: "https://glaring-inferno-2943.firebaseio.com/",
		googleApis: {
			key: "AIzaSyCJL4ZhaSPo0dib7Nlk1XoJEn1sNwWflJI",
			maps: "https://maps.googleapis.com/maps/api"
		}
	}
});