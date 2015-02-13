
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


    function init(){
        $scope.$broadcast("dataLoaded", true);

        initMap();
        //initCharts();
    }
   


    // Initilize the Map after data has been loaded
    function initMap(){
        $scope.map.markers = InteractionService.getCoords($scope.interactionData.posts);
        return $scope.map.markers;
    }
   

    // Sets the total hours worked for each checked in person
    $scope.setWorkedHours = function(){
        var totalHours,
            timeIn = new Date(this.item.demoDate +" "+ this.item.timeIn);
            timeOut = new Date(this.item.demoDate +" "+ this.item.timeOut);

        totalHours = (timeOut - timeIn)/1000; /* get total seconds */
        totalHours = (totalHours/60)/60; /* get total minutes then hours */

        return totalHours < 0 ? 0 : totalHours.toFixed(2);
    };




	// bar chart
    $scope.barData = {
        labels: [],
        series: [
            //[5, 4, 3]
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