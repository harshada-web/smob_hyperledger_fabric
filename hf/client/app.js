let app = angular.module('myApp', []);

app.controller('appCtrl', function($scope, $http) {


    $scope.getData = function(){

        $http.get("http://localhost:3000/api/getData").then(function(response) {
            $scope.datas = response.data;
            console.log($scope.datas);
        });

    }


    $scope.postData = function(car_key,color,make,model,owner){

        var data = JSON.stringify({
            Key: car_key,
            color : color,
            make : make,
            model : model,
            owner : owner
        });
      
      console.log(data);

      $http({
        url: 'http://localhost:3000/api/postData',
        method: 'POST',
        data: data
    }).then(function (httpResponse) {
        console.log('response:', httpResponse); 
        $scope.getData();
    })

    $scope.car_key ="";
    $scope.color ="";
    $scope.make ="";
    $scope.model ="";
    $scope.owner ="";

    }

});
