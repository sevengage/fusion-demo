
/*===============================================================================================================
* Fusion Dashboard Controller
*
*	Purpose:
*		- Dashboard Controller to observe user submissions
*
*
*	Originally written by: Marshall Grant
* =================================================================================================================*/

fusionDashboard.filter("reverse", function(){
    return function (items){
        return items.slice().reverse();
    };
});


fusionDashboard.controller('DashboardController', ["$scope", "fusion", "InteractionService", function ($scope, fusion, InteractionService){
    
    // Map defaults
    $scope.map = {
        zoom: 10,
        height: "400px",
        width: "100%",
    };


    // Sync data between Firebase and our App
    $scope.interactionData = InteractionService.getSync();

    //after our data is synced fire off our promises
    $scope.interactionData.$watch(init);


    function init(event){
        //console.log( $scope.interactionData);
        //console.log(event)

        if(event.event === "child_changed"){
            $scope.$broadcast("dataLoaded", {key: event.key});
        }
        
        initMap();
        //initCharts();
    }
   


    // Initilize the Map after data has been loaded
    function initMap(){
        $scope.map.markers = InteractionService.getCoords($scope.interactionData);
        return $scope.map.markers;
    }
   




	// bar chart
    $scope.barData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
            [120, 190, 170, 250, 230,]
        ]
    };

    $scope.barOptions = {
        seriesBarDistance: 10,
        //low: 0,
        showArea: true
    };

    // donut chart
    $scope.donutOptions = {
        donut: true
    };

    // pie chart
    $scope.pieData = {
        labels: ["Satisfied", "Very Satisfied", "Neutral", "No Comment"],
        series: [20, 10, 30, 40]
    };

    $scope.demos = {
        labels: ["Rubber Hose", "Dispenser", "Drip Control", "Strenth"],
        series: [50, 5, 35, 10]
    };


    function initCharts(){
        var staff = [],
            interactions = [],
            entries = $scope.interactionData.posts;

        for(var item in entries){
             staff.push(entries[item].staffid);
             interactions.push(entries[item].numberOfInteractions);
        }

        // add dates
        $scope.barData.labels = staff;
        $scope.barData.series.unshift(interactions);

    }

}]);