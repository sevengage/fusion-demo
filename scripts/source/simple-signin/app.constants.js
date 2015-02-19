/* ---------------------------------------
	Global Settings
-----------------------------------------*/

//Global Namespace
var app = app || {};

var fusionApp = angular.module("fusion", ["ngTouch", "firebase"]);

//Global Configurations
app.config = {
	url: "http://appmanagr.net/mobile/index.php/api/rest",
	firebase: "https://fusion-signin-app.firebaseio.com/",
	googleApis: {
		maps: "https://maps.googleapis.com/maps/api"
	},
	type: "json?",
	loggedin: false,
	methods: {
		auth: "authenticate_username",
		create: "create_entry",
		read: "read_entry",
		registrationForm: "/includes/recap-submission-form",
		authUser: "/service/authenticate_username",
	},
	channel: "interactions",
	messages: {
		required: "Required Field!",
		use_last_saved: "Welcome back, friend! Hey, it looks like you have 1 autosaved report. Hit, OK to use it or hit Cancel to start with a fresh report?",
		login_error: "Sorry, but that is an invalid Username or Password.  Please try again.",
		checkout_confirm: "Are you sure you are ready to checkout?  Your checkout time will be autoset and cannot be undone",
		submit_success: "Sweet! Your report submitted succesfully!",
		checkout_already_set: "Hey, sorry!  You've already set your checkout time and this cannot be updated.",
		havent_checked_in: "My Bad, but you need to fill out all the check-in fields and be sure to hit the, 'Check me in' button.",
		not_saved: '<p class="alert alert-error">Report not saved. <a href="#notSaved">More &raquo;</a></p>',
		geo_position_error: "Whoa! We having an issue determining your position. Don't worry. Its cool.",
		cant_save_data: "Oh Snap! Something happned and we couldn't save your submission. Try again. Error:",
		lost_internet_connection: "Oh wow.  Looks like you just lost your internet connection. Please besure to reconnect soon.",
		already_checked_out: "Sweet! You've already checked out."
	},
	googleKey: "AIzaSyCJL4ZhaSPo0dib7Nlk1XoJEn1sNwWflJI",
	//https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCJL4ZhaSPo0dib7Nlk1XoJEn1sNwWflJI&location=34.0274273,-84.3225148&radius=500
	templates: {
		checked_in: '<div class="green ui-btn btn">Thanks! You&#39;re in!</div>',
		checked_out: '<div class="green ui-btn btn">Sweet! You&#39;re good!</div>',
	}
};


