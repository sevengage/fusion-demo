/*===============================================================================================================
* Fusion Dashboard Constants
*
*	Purpose:
*		- Dashboard Constants
*
*
*	Originally written by: Marshall Grant
* =================================================================================================================*/

fusionDashboard.service('InteractionService', ["$firebase", "fusion", function ($firebase, fusion){
	var ref = new Firebase(fusion.config.firebase),
		sync = $firebase(ref);
		
	this.getSync = function(){
		return sync.$asArray();
	};


	this.getCoords = function(data){
		var pos, posArray = [];

		for(pos in data){
			if( typeof data[pos] === "object" ){
				if(data[pos].lat !== ""){
					posArray.push({
						lat: data[pos].lat,
						lon: data[pos].lon
					});
				}
			}
		}

		return posArray;
	};

}]);