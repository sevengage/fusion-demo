!function (angular, app, $, fusionApp){
	var config = app.config;


	/* ---------------------------------------
		Helper Methods
	-----------------------------------------*/

	// For todays date;
	Date.prototype.today = function () {
		return( (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "-" + ((this.getDate() < 10) ? "0" : "") + this.getDate()) + "-" + this.getFullYear();
	};

	// For the time now
	Date.prototype.timeNow = function () {
		return((this.getHours() < 10) ? "0" : "") + ((this.getHours() > 12) ? (this.getHours() - 12) : this.getHours()) + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds() + ((this.getHours() > 12) ? (' PM') : ' AM');
	};



	/* Firebase handler
	----------------------------------------------------*/
	fusionApp.service('firebaseService', ["$firebase", function ($firebase){
		var ref = new Firebase(config.firebase),
			sync = $firebase(ref),
			self = this;


		// fetches firebase data
		self.getSync = function(){
			return sync.$asObject();
		};


		// requests firebase data & returns a promise
		self.getData = function(){
			var data = self.getSync();

			return data.$loaded(function(){
				return data;
			});
		};


		/*
			Determines which key in data is for the logged in user based off of email
			args = {email:"", data:""}
		-----------------------------------------------------------*/
		self.getUserData = function(args){
			var userData = {};

			for(var person in args.data){
				if( args.data[person].email === args.email ){
					userData = args.data[person];
					userData.fireBaseKey = person;

					return userData;
				}
			}
		};


		// updates the firebsase record for this user
		self.update = function(data){
			return sync.$update(data.fireBaseKey, data);
		};

	}]);




	/* LocalStorage Service for backups and autosave
	----------------------------------------------------*/
	fusionApp.service('locStorage', ["$window", function ($window){

		//saves the fusionHenkle object
		this.save = function(data){
			$window.localStorage.fusionHenkle = data;
			return "saved";
		};

		//gets the fusionHenkle object
		this.get = function(){
			var itemStored = $window.localStorage.fusionHenkle;
			return (itemStored === undefined) ? 0 : itemStored;
		};

		//removes the saved object
		this.delete = function(){
			$window.localStorage.fusionHenkle = "";
			return "deleted";
		};
		
	}]);



	/* Ajax loader Service
	----------------------------------------------------*/
	fusionApp.service("loader", ["$window", function ($window){
		this.init = function(yes){
			var where = ($window.location.hash === "") ? "#login" : $window.location.hash,
				what = '<div class="ajax-loading"><img src="http://appmanagr.net/mobile/apps/fusion-henkle/assets/ajax-loader.gif"></div>';

			return (yes) ? $(where).append(what) : $(".ajax-loading").remove();
		};
	}]);




	/* Utility services to help yall out
	----------------------------------------------------*/
	fusionApp.service('utility', ["$timeout", "$window", "loader", function ($timeout, $window, loader){

		this.checkedIn = function(element){
			$(element).replaceWith(app.config.templates.checked_in);
			$timeout(function(){
				$window.location.hash = "#report";
			}, 2000);
		};


		this.hasCheckedOut = function(){
			$("#SendReport").replaceWith('<div class="green ui-btn btn">Sweet! You&#39;re good!</div>');
		};

		//if user allows, gets the position of the user
		this.getGeoPosition = function(){
			if ("geolocation" in navigator) {
				var coords = navigator.geolocation.getCurrentPosition(function (position){
					return position.coords.latitude;
				});

				return coords;
			}
		};


		// Sets the total hours worked for each checked in person
		this.setWorkedHours = function(args){
			var totalHours, timeIn, timeOut;

			timeIn = new Date(args.date +" "+ args.start);
			timeOut = new Date(args.date +" "+ args.end);

			totalHours = (timeOut - timeIn)/1000; /* get total seconds */
			totalHours = (totalHours/60)/60; /* get total minutes then hours */

			return totalHours < 0 ? 0 : totalHours.toFixed(2);
		};


		/* resets form's UI with context
		-----------------------------------------------*/
		this.resetForm = function(where){
			$("input", where).siblings("label").removeClass("ui-checkbox-on").addClass("ui-checkbox-off");
			$("select", where).siblings('span').html("&nbsp;");
		};


		//MOBILE: scroll past the nav bar to hide
		this.broswerScrollTo = function () {
			return (/mobile/i).test(navigator.userAgent) && !location.hash && setTimeout(function () {
				window.scrollTo(0, 1);
			}, 1000);
		};


		//Message to show at the top of the page when a save occurs
		this.showSavedMessage = function(){
			var nowTime = new Date().timeNow(),
				nowDate = new Date().today();

			$("p.saved-message").text("Last saved at " + nowTime);
		};


		//checks login and registration fields
		this.loginCheck = function($scope, context){
			var auth = {
				email: ($scope.email !== ""),
				pass: ($scope.password !== ""),
				confirm_pass: ($scope.confirm_password !== "")
			};

			$(context.username +","+ context.password +","+ context.confirm_password).removeClass("error");

			if(!auth.email){
				$(context.username).addClass("error").attr("placeholder", config.messages.required);
			}

			if(!auth.pass){
				$(context.password).addClass("error").attr("placeholder", config.messages.required);
			}

			if(context.conf !== ""){
				$(context.confirm_password).addClass("error").attr("placeholder", config.messages.required);
			}

			if(auth.email && auth.pass){
				loader.init(true);
			}

			return (auth.email === false || auth.pass === false || auth.confirm_password === false) ? false : true;
		};

	}]);




	/* Now service sets the current device date and time
	--------------------------------------------------------*/
	fusionApp.service('now', function(){
		return {
			getTime: function(){
				var nowTime = new Date().timeNow();
				return nowTime;
			},

			getDate: function(){
				var nowDate = new Date().today();
				return nowDate;
			},

			getTimeDate: function(){
				var nowTime = new Date().timeNow(),
					nowDate = new Date().today();
				return nowDate +" "+ nowTime;
			}
		};
	});


}(window.angular, window.app, window.jQuery, window.fusionApp);

