let app = angular.module("myApp", []);

app.controller('mainCtrl',['$scope','$interval', ($scope,$interval) => {

    $scope.height = 500;
    $scope.width = 500;
    $scope.data = [1, 2, 3, 4, 5, 6];

    $scope.barHoveredData = '';

    $scope.hovered = (data) => {
        $scope.barHoveredData = data;
        $scope.$apply();
    };

    $interval(() => {
        $scope.data = d3.range(~~(Math.random() * 50) + 1)
            .map((d, i) => ~~(Math.random() * 1000));
    }, 5000, 10);

}]);
