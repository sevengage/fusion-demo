/*===============================================================================================================
* Fusion Henkle Registration Controller
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


!function (angular, app, $){


	/* App Controller
	----------------------------------------------------*/
	fusionApp.controller("RegistrationController",
		["$scope", "$firebase", "$firebaseAuth", "$window", "utility", "loader",
		function ($scope, $firebase, $firebaseAuth, $window, utility, loader){

		var count = 1, autoSave,
			useSaved = false,
			showOnce = 0,
			config = app.config,
			ref = new Firebase(config.firebase),
			presenceRef = new Firebase(config.firebase +'/disconnectmessage'),
			sync = $firebase(ref),
			sessionData = $firebase(ref).$asObject();

		$scope.checkedIn = false;

		$scope.email = "";
		$scope.password = "";
		$scope.confirm_password = "";


		//hide the browser
		utility.broswerScrollTo();


		/* ----------------------------------------------------------------
			Login Auth Controller
		------------------------------------------------------------------*/
		$scope.authObj = $firebaseAuth(ref);



		/* User Registration
		----------------------------------------------------------------*/
		$scope.registerUser = function(){
			var fieldCheck = utility.loginCheck($scope, {
				username: "#regEmail",
				password: "#regPass",
				confirm_password: "#regConfirmPass"
			});


			if(fieldCheck){
				ref.createUser({
					email: $scope.email,
					password: $scope.password

				}, function (error){
					if(error === null){
						$window.location.href = "/index2.html";
						
					}else{
						$window.alert(error);
					}
				});

			}else{
				return false;
			}
		};



		/* Forgot Password
		----------------------------------------------------------------*/
		$scope.forgotUser = function(){
			ref.resetPassword({
				email : $scope.forgot_email

			}, function(error) {
				if (error === null) {
					$window.alert("Password reset email sent successfully");
					$window.location.hash = "#resetPassword";
				} else {
					$window.alert("Error sending password reset email:", error);
				}
			});
		};



		/* Change Password
		----------------------------------------------------------------*/
		$scope.changePassword = function(){
			ref.changePassword({
				email       : $scope.forgot_email,
				oldPassword : $scope.old_password,
				newPassword : $scope.new_password

			}, function (error) {
				if (error === null) {
					$window.alert("Password changed successfully");
					$window.location.href = "/index2.html";

				} else {
					$window.alert("Error changing password:", error);
				}
			});
		};

	}]);


}(window.angular, window.app, window.jQuery);


