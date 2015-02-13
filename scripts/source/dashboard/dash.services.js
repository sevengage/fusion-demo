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
		return sync.$asObject();
	};


	this.getCoords = function(data){
		var pos, posArray = [];

		for(pos in data){
			posArray.push(data[pos].position);
		}

		return posArray;
	};

}]);


// var item, arr = [], 
// 			data = sync.$asObject();

// 		for(item in data.posts){
// 			dataArray.push(item)
// 		}


// 		return data;