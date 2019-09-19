let app = angular.module('myApp', ['angular-cryptos', 'ngRoute', '720kb.datepicker']);

app.config(function ($cryptoProvider) {
    $cryptoProvider.setCryptographyKey('123456');
});


app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            controller: "loginCtrl"
        })
        .when("/about", {
            templateUrl: "aboutus.html"
        })
        .when("/contact", {
            templateUrl: "contact_us.html"
        })
        .when("/dashboard", {
            templateUrl: "dashboard.html",
            controller: "dashCtrl"
        })
        .when("/req_sent", {
            templateUrl: "req_sent.html",
            controller: "reqSentCtrl"
        })
        .when("/req_track", {
            templateUrl: "req_track.html",
            controller : "reqTrackCtrl"
        })
        .when("/retailer_sent", {
            templateUrl: "retailer_sent.html",
            controller : "retailer_sent"
        })
        .when("/retailer_track", {
            templateUrl: "retailer_track.html",
            controller : "retailer_track"
        })
        .when("/supplier_dashboard", {
            templateUrl: "supplier_dashboard.html",
            controller : "supplier_dashboard"
        })
        .when("/supplier_request", {
            templateUrl: "supplier_request.html",
            controller : "supplier_request"
        })
        .when("/supplier_request_track", {
            templateUrl: "supplier_request_track.html",
            controller : "supplier_request_track"
        })
        .when("/retailer_dashboard", {
            templateUrl: "retailer_dashboard.html",
            controller : "retailer_dashboard"
        })
        .when("/retailer_request", {
            templateUrl: "retailer_request.html",
            controller : "retailer_request"
        })
        .when("/retailer_request_track", {
            templateUrl: "retailer_request_track.html",
            controller : "retailer_request_track"
        })
        .when("/logistic", {
            templateUrl: "logistic.html",
            controller: "logisticCtrl"
        });
});



// ============================ SMOB LOGIN CONTROLLER ==========================

app.controller('loginCtrl', function ($scope, $rootScope, $http, $crypto, $location, $filter) {

    //$scope.log = 0;
    $scope.email;
    $scope.password;

    $scope.register = function () {

        let cipher = $crypto.encrypt($scope.password);

        var data = JSON.stringify({
            email: $scope.email,
            password: cipher
        });

        console.log(data);

        $http({
            url: 'http://localhost:3000/smob/login/data/reg',
            method: 'POST',
            data: data
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
            //$rootScope.$emit("CallParentMethod", {});
        })

        $scope.email = "";
        $scope.password = "";

    }


    $scope.login = function () {


        $http.get("http://localhost:3000/smob/login/data/" + $scope.email)
            .then(function (response) {
                $scope.datas = response.data;
                encipher = $scope.datas[0].password;
                let decipher = $crypto.decrypt(encipher);
                //console.log(`Encrypted Pass ${encipher} : Original Pass ${decipher}`);
                if ($scope.password === decipher) {
                    alert("Login Success");

                    //$scope.log = 1;

                    $scope.user = $scope.datas[0].user_name;
                    sessionStorage.setItem("log", 1);
                    $rootScope.$emit("CallParentMethod", {});

                    sessionStorage.setItem("userName", $scope.datas[0].user_name);
                    sessionStorage.setItem("userAddress", $scope.datas[0].address);
                    sessionStorage.setItem("userEmail", $scope.datas[0].email);
                    sessionStorage.setItem("userPhone", $scope.datas[0].phone);

			        if($scope.password === "manufacturer"){
                        $location.path('dashboard');
			        }
                    else if($scope.password === "retailer"){
                        $location.path('retailer_dashboard');
                    }
                    else if($scope.password === "logistic"){
                        $location.path('logistic');
                    }
                    else{
                        $location.path('supplier_dashboard');
                    }


                } else {
                    alert("Login Fail");
                }
                //console.log($scope.datas);

                $scope.email = "";
                $scope.password = "";
            });

    }

});


// ============================ INDEX PAGE NAVBAR CONTROLLER ==========================

app.controller('navCtrl', function ($rootScope, $scope, $location, $route) {

    let new_date = new Date();
    let current_date = `${new_date.getDate()}/${(new_date.getMonth())+1}/${new_date.getFullYear()}`;
    sessionStorage.setItem("Current_Date",current_date);

    $rootScope.$on("CallParentMethod", function () {
        $scope.login();
    });

    $scope.userName = sessionStorage.getItem("userName");
    //sessionStorage.setItem("log", 0);
    $scope.log = sessionStorage.getItem("log");

    $scope.login = function () {
        $scope.log = 1;
    }

    $scope.logout = function () {
        sessionStorage.setItem("log", 0);
        $scope.log = 0;
        $location.path('/');
	sessionStorage.setItem("userName","");
    }

});


// ============================ MANUFACTURER DASHBOARD PAGE CONTROLLER ==========================

app.controller('dashCtrl', function ($rootScope, $scope, $http, $timeout) {

    $scope.userAddress = sessionStorage.getItem("userAddress");
    $scope.userName = sessionStorage.getItem("userName");

    $scope.supplier_quantity;
    $scope.supplier_name;
    $scope.supplier_address;
    $scope.new_request_id;

    $scope.initFunction = function(){
        $scope.showData();
        $scope.getHyperledger();
    }

    $scope.showData = function () {
        $http.get("http://localhost:3000/smob/dashboard/inventory/data")
            .then(function (response) {
                $scope.allItems = response.data;
            });
    }
    
    $http.get("http://localhost:3000/smob/dashboard/req/data")
            .then(function (response) {
                $scope.datas = response.data;
                $scope.new_request_id = parseInt($scope.datas[response.data.length-1].req_id)+1;
                $scope.new_request_id = $scope.new_request_id.toString();
            });


    $scope.getSingle = function (data) {

        $scope.sup_id;
        //console.log(id);
        $http.get("http://localhost:3000/smob/dashboard/inventory/data/" + data.item_id)
            .then(function (response) {
                $scope.datas = response.data;
                $scope.sup_id = $scope.datas[0].supplier_id;
                $scope.supplier_quantity = $scope.datas[0].quantity;
                $timeout(callAtTimeout, 100);
                //console.log($scope.datas);
            });


        function callAtTimeout() {

            $http.get("http://localhost:3000/smob/dashboard/supplier/data/" + $scope.sup_id)
                .then(function (response) {
                    $scope.supplier_data = response.data;
                    $scope.supplier_name = $scope.supplier_data[0].user_name;
                    $scope.supplier_address = $scope.supplier_data[0].address;
                    //console.log($scope.supplier_data);
                });
        }

    }


    
$scope.request = function (data, quantity, quote_date) {

        let new_date = new Date();
        let current_date = `${new_date.getDate()}/${(new_date.getMonth())+1}/${new_date.getFullYear()}`;

        if (quantity < 1 || quantity > $scope.supplier_quantity || quantity == null) {
            alert("Request Failed");
        } else {
            alert("Request Done");

            let post_data = JSON.stringify({
                req_id: $scope.new_request_id,
                item_id: data.item_id,
                item_name: data.item_name,
                quantity: quantity,
                current_date: current_date,
                quotation_date: quote_date,
                raised_by: $scope.userName,
                status: "pending",
                address: $scope.userAddress,
                supplier_name: $scope.supplier_name
            });

            //console.log(post_data);

            $http({
                url: 'http://localhost:3000/postData/request',
                method: 'POST',
                data: post_data
            }).then(function (httpResponse) {
                console.log('response:', httpResponse);
            })

        }
    }

// @@@@@@@@@@@@@@@@@@@@ Manufacturer Dashboard Hyperledger @@@@@@@@@@@@@@@@

    $scope.getHyperledger = function(){
        $http.get("http://localhost:3000/api/hf/getData").then(function(response) {
                    $scope.hfData = response.data;
                    console.log($scope.hfData);
                });
        }


});


// ============================ MANUFACTURER REQUEST CONTROLLER ==========================

app.controller('reqSentCtrl', function ($scope, $rootScope, $http, $location) {

    $scope.showData = function () {
        $http.get("http://localhost:3000/smob/dashboard/req/data")
            .then(function (response) {
                $scope.datas = response.data;
            });
    }

    $scope.SingleRequest = function(data){

        sessionStorage.setItem("Request", data.req_id);
        $location.path('/req_track');
    }

});



// ============================MANUFACTURER REQUEST TRACK CONTROLLER ==========================

app.controller('reqTrackCtrl', function ($rootScope, $scope, $http, $timeout, $location) {

$scope.current_date = sessionStorage.getItem("Current_Date");
$scope.req_id = sessionStorage.getItem("Request");
$scope.new_order_id;
$scope.new_invoice_id;

$scope.quote = 0;
$scope.order= 0;
$scope.invoice = 0;
$scope.logistic = 0;
$scope.payment = 0;

$scope.PO_btn = 0;
$scope.Invoice_btn = 0;
$scope.payment_btn = 0;
$scope.totalPrice = sessionStorage.getItem("totalPrice");

//  Hyperledger
$scope.hfitem_name;
$scope.hfraised_by;
$scope.hfquantity;

// GEOLOCATION

$scope.lat;
$scope.long;

$scope.geoLocation = function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showLocation);
    } else{
        alert("Sorry, browser does not support geolocation!");
    }
}

function showLocation(position) {
    $scope.lat = position.coords.latitude;
    $scope.long = position.coords.longitude;
 }


    $http.get("http://localhost:3000/smob/dashboard/req/data/" +$scope.req_id)
        .then(function (response) {
            $scope.req_datas = response.data;

            // HF
            $scope.hfquantity = $scope.req_datas[0].quantity;
			$scope.hfitem_name = $scope.req_datas[0].item_name;
            $scope.hfraised_by = $scope.req_datas[0].supplier_name;

            if($scope.req_datas[0].status == "order delivered"){
                $scope.payment_btn = 1;
            }

        });

    $http.get("http://localhost:3000/smob/dashboard/req/quotation/" +$scope.req_id)
        .then(function (response) {
            $scope.quo_datas = response.data;
            if($scope.quo_datas.length > 0){
                $scope.quote = 1;
                $scope.PO_btn = 1;
            }
            //console.log(response.data.length);
        });

    $http.get("http://localhost:3000/smob/dashboard/req/order/"+$scope.req_id)
        .then(function (response) {
            $scope.order_datas = response.data;
            //console.log($scope.order_datas);
            if($scope.order_datas.length > 0){
                $scope.order = 1;
                $scope.PO_btn = 0;
                
                $scope.new_order_id = $scope.order_datas[0].order_id;
                $timeout(timeoutInvoice, 100);
            }
        });
        

    function timeoutInvoice(){

    $http.get("http://localhost:3000/smob/dashboard/req/invoice/" +$scope.new_order_id)
        .then(function (response) {
            $scope.invoice_datas = response.data;
            //console.log($scope.invoice_datas);
            if($scope.invoice_datas.length > 0){
               $scope.invoice = 1;

               $scope.new_invoice_id = $scope.invoice_datas[0].invoice_id;
               $timeout(timeoutLogistic, 100);
            }
        });

    }

    function timeoutLogistic(){
    $http.get("http://localhost:3000/smob/logistic/data/" +($scope.req_id + '777'))
            .then(function (response) {
                $scope.logistic_datas = response.data;
                if($scope.logistic_datas.length > 0 && $scope.invoice == 1){
                   $scope.logistic = 1;
                   $timeout(timeoutPayment, 100);
                }
            });
        }

    function timeoutPayment(){

    $http.get("http://localhost:3000/smob/dashboard/req/payment/" +$scope.new_invoice_id)
        .then(function (response) {
            $scope.pay_datas = response.data;
            //console.log($scope.pay_datas);
            if($scope.pay_datas.length > 0){
                $scope.payment = 1;

                $scope.Invoice_btn = 0;
                $scope.payment_btn = 0;
            }
        });

    }

// ==========================================================================
    $scope.PORaised = function(id,date){

        var postdata = JSON.stringify({
            req_id: id,
            order_id : id,
            order_date : date
      });

      //console.log(postdata);

      $http({
        url: 'http://localhost:3000/postData/smob/manufacturer/track',
        method: 'POST',
        data: postdata
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
        alert("Purchase Order Raised !");
        $scope.PODone();
        $scope.initLogistics();
    })   

    $scope.PODone = function(){
    let updatedData = { req_id:$scope.req_id, status:"purchase order accepted" };
      $http.put('http://localhost:3000/smob/updateData', updatedData).then(function (response) {
       console.log("1 DOCUMENT UPDATED");
       $timeout(Done, 100);
      });
    }

    function Done(){
        $location.path('req_sent');
    }

    }

//======================================================================
    $scope.Invoice_Accepted = function(){
        $scope.Invoice_btn = 0;
        $scope.payment_btn = 1;
    }

    $scope.Invoice_Rejected = function(){
        $scope.Invoice_btn = 0;
    }


// ============================== Logistics =========================================================

   $scope.initLogistics = function(){

    let id = $scope.req_id + '777';
    let requester = sessionStorage.getItem("userName");
    let address = sessionStorage.getItem("userAddress");

    var postdata = JSON.stringify({
        id: id,
        current_date: $scope.current_date,
        expected_date : "Will be Updated Soon!",
        requester : requester,
        shipping_address : address,
        status : "order processing",
        lat: $scope.lat,
        long: $scope.long
    });

    //console.log(postdata);

    $http({
        url: 'http://localhost:3000/postData/smob/logistic/data',
        method: 'POST',
        data: postdata
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    })

}


//===========================================================================

    $scope.paymentDone = function(id,pay_mode){

        let new_date = new Date();
        let current_date = `${new_date.getDate()}/${(new_date.getMonth())+1}/${new_date.getFullYear()}`;
        
        var postdata = JSON.stringify({
            payment_id: id,
            invoice_id : id,
            pay_date : current_date
      });

      console.log(postdata);

      $http({
        url: 'http://localhost:3000/postData/smob/manufacturer/payment/track',
        method: 'POST',
        data: postdata
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
        alert("Payment Done !");
        $scope.paymentDone();
     })

     $scope.paymentDone = function(){
        let updatedData = { req_id:$scope.req_id, status:"request approved" };
        $http.put('http://localhost:3000/smob/updateData', updatedData).then(function (response) {
         console.log("1 DOCUMENT UPDATED");
         $timeout(Done, 100);
         $scope.HyperledgerPost();
        });
     }

     function Done(){
         $location.path('req_sent');
     }

//=====================================================================
     $scope.HyperledgerPost = function(){

        let price = sessionStorage.getItem("totalPrice");
        let userName = sessionStorage.getItem("userName");
        //let txid = 'TXNS' + $scope.req_id + '777';(+new Date())
        let txid = 'TXNS' + (+new Date());

        var hfdata = JSON.stringify({
            txn_id : txid,
            id: $scope.req_id,
            material : $scope.hfitem_name,
            quantity : $scope.hfquantity.toString(),
            sender : $scope.hfraised_by,
            receiver : userName,
            date : $scope.current_date,
            price: price
        });

        $http({
            url: 'http://localhost:3000/api/hf/postData',
            method: 'POST',
            data: hfdata
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
            alert("Hyperledger Updated !");
          })

    }


    }



});


// ============================ MANUFACTURER -> RETAILER REQUEST CONTROLLER ==========================

app.controller('retailer_sent', function ($scope, $http, $location) {

    $scope.showData = function () {
        $http.get("http://localhost:3000/smob/dashboard/retailer/req/data")
            .then(function (response) {
                $scope.allItems = response.data;
            });
    }

    $scope.SingleRequest = function(data){

        sessionStorage.setItem("Request", data.req_id);
        $location.path('/retailer_track');
    }

});

// ============================MANUFACTURER -> RETAILER REQUEST TRACK CONTROLLER ==========================

app.controller('retailer_track', function ($scope, $http, $location, $timeout) {

    $scope.current_date = sessionStorage.getItem("Current_Date");
    $scope.req_id = sessionStorage.getItem("Request");
    $scope.quote = 0;
    $scope.order = 0;
    $scope.invoice = 0;
    $scope.logistic = 0;
    $scope.payment = 0;

    $scope.acpt_btn = 0;
    $scope.quote_btn = 0;
    $scope.invoice_btn = 0;

    $scope.quotation_item_id;
    $scope.quotation_quantity;

    $http.get("http://localhost:3000/smob/dashboard/retailer/req/data/" +$scope.req_id)
            .then(function (response) {
                $scope.allItems = response.data;

                $scope.quotation_item_id = $scope.allItems[0].item_id;
                $scope.quotation_quantity = $scope.allItems[0].quantity;

                if($scope.allItems[0].status == "pending"){
                    $scope.acpt_btn = 1;
                }
                else if($scope.allItems[0].status == "request accepted"){
                    $scope.quote_btn = 1;    
                }
                else if($scope.allItems[0].status == "purchase order placed"){
                    $scope.invoice_btn = 1;  
                }
                else{
                    $scope.acpt_btn = 0;
                }
            });

            $http.get("http://localhost:3000/smob/dashboard/retailer/quotation/" +$scope.req_id)
            .then(function (response) {
                $scope.quo_datas = response.data;
                if($scope.quo_datas.length > 0){
                    $scope.quote = 1;
                }
            });


            $http.get("http://localhost:3000/smob/dashboard/retailer/order/"+$scope.req_id)
            .then(function (response) {
                $scope.order_datas = response.data;
                if($scope.order_datas.length > 0){
                    $scope.order = 1;
                }
            });
            
    
        $http.get("http://localhost:3000/smob/dashboard/retailer/invoice/" +$scope.req_id)
            .then(function (response) {
                $scope.invoice_datas = response.data;
                if($scope.invoice_datas.length > 0){
                   $scope.invoice = 1;
                }
            });

        $http.get("http://localhost:3000/smob/logistic/data/" +($scope.req_id + '555'))
            .then(function (response) {
                $scope.logistic_datas = response.data;
                if($scope.logistic_datas.length > 0 && $scope.invoice == 1){
                   $scope.logistic = 1;
                }
            });

        $http.get("http://localhost:3000/smob/dashboard/retailer/payment/" +$scope.req_id)
            .then(function (response) {
                $scope.pay_datas = response.data;
                if($scope.pay_datas.length > 0){
                    $scope.payment = 1;
                }
            });




    /////////////////////////////// ACCEPT & REJECT REQUEST FUNCTION  /////////////////////////////////
    $scope.acceptRequest = function(){

        let updatedData = { req_id:$scope.req_id, status:"request accepted" };
                $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $scope.done();

                });
          
              $scope.done = function(){
            $location.path('retailer_sent');
             }

    }

    $scope.rejectRequest = function(){

        let updatedData = { req_id:$scope.req_id, status:"request rejected" };
                $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $scope.done();

                });
          
              $scope.done = function(){
            $location.path('retailer_sent');
             }

    }

    /////////////////////////////////////////// QUOTATION MODAL  /////////////////////////////////////////

    $scope.quotationModal = function(){     
        $scope.totalPrice;

            $http.get("http://localhost:3000/smob/dashboard/manufacturer/inventory/data/"+$scope.quotation_item_id)
                .then(function (response) {
                    $scope.ItemData = response.data;
                    $scope.totalPrice = $scope.quotation_quantity * parseInt($scope.ItemData[0].price);
                    sessionStorage.setItem("totalPrice", $scope.totalPrice);

                });
    }

    $scope.quotationRaised = function(id,date,price,totalprice){

        var postdata = JSON.stringify({
              req_id: id,
              quotation_id : id,
              quotation_date : date,
              unit_price : price,
              total_price : totalprice.toString()
        });
        
        //console.log(postdata);
  
        $http({
          url: 'http://localhost:3000/postData/smob/retailer/quotation',
          method: 'POST',
          data: postdata
      }).then(function (httpResponse) {
          console.log('response:', httpResponse);
          alert("Quotation Raised Successfully !");
          $scope.updateStatus();
      })   

      $scope.updateStatus = function(){
      let updatedData = { req_id:$scope.req_id, status:"quotation raised" };
                $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $timeout(Done, 100);
                });
            }

        function Done(){
            $location.path('retailer_sent');
        }


}

///////////////////////////////////// Invoice Modal /////////////////////////////////////////////////

$scope.invoiceRaised = function(id,date,total){

    var postdata = JSON.stringify({
        order_id: id,
        invoice_id : id,
        invoice_date : date,
        total_price : total.toString()
    });
  
    console.log(postdata);

    $http({
        url: 'http://localhost:3000/postData/smob/retailer/invoice',
        method: 'POST',
        data: postdata
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
        alert("Invoice Raised Successfully !");
        $scope.updateNewStatus();
      })

      $scope.updateNewStatus = function(){
        let updatedData = { req_id:$scope.req_id, status:"invoice raised" };
                  $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                   console.log("1 DOCUMENT UPDATED");
                   $timeout(Done, 100);
                  });
              }
  
          function Done(){
              $location.path('retailer_sent');
          }

}


});


/////////////////////////////////////////////////////////////////////////////////////////////////////
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// ======================= RETAILER DASHBOARD ====================================

app.controller('retailer_dashboard', function ($scope, $http, $timeout) {

    $scope.userAddress = sessionStorage.getItem("userAddress");
    $scope.userName = sessionStorage.getItem("userName");

    $scope.showData = function () {
        $http.get("http://localhost:3000/smob/dashboard/manufacturer/inventory/data")
            .then(function (response) {
                $scope.allItems = response.data;
            });
    }


// ============================================================================

$scope.manufacturer_quantity;
$scope.manufacturer_name;
$scope.manufacturer_address;
$scope.new_request_id;


$http.get("http://localhost:3000/smob/dashboard/retailer/req/data")
        .then(function (response) {
            $scope.datas = response.data;
            $scope.new_request_id = parseInt($scope.datas[response.data.length-1].req_id)+1;
            $scope.new_request_id = $scope.new_request_id.toString();
            //console.log($scope.new_request_id);
        });


$scope.getSingle = function (data) {

    $scope.manu_id;
    //console.log(id);
    $http.get("http://localhost:3000/smob/dashboard/manufacturer/inventory/data/" + data.item_id)
        .then(function (response) {
            $scope.datas = response.data;
            $scope.manu_id = $scope.datas[0].manufacturer_id;
            $scope.manufacturer_quantity = $scope.datas[0].quantity;
            $timeout(callAtTimeout, 100);
            //console.log($scope.datas);
        });


    function callAtTimeout() {

        $http.get("http://localhost:3000/smob/dashboard/supplier/data/" + $scope.manu_id)
            .then(function (response) {
                $scope.manufacturer_data = response.data;
                $scope.manufacturer_name = $scope.manufacturer_data[0].user_name;
                $scope.manufacturer_address = $scope.manufacturer_data[0].address;
                //console.log($scope.supplier_data);
            });
    }

}



$scope.request = function (data, quantity, quote_date) {

    let new_date = new Date();
    let current_date = `${new_date.getDate()}/${(new_date.getMonth())+1}/${new_date.getFullYear()}`;

    if (quantity < 1 || quantity > $scope.manufacturer_quantity || quantity == null) {
        alert("Request Failed");
    } else {
        alert("Request Done");

        let post_data = JSON.stringify({
            req_id: $scope.new_request_id,
            item_id: data.item_id,
            item_name: data.item_name,
            quantity: quantity,
            current_date: current_date,
            quotation_date: quote_date,
            raised_by: $scope.userName,
            status: "pending",
            address: $scope.userAddress,
            manufacturer_name: $scope.manufacturer_name
        });

        console.log(post_data);

        $http({
            url: 'http://localhost:3000/postData/retailer/request',
            method: 'POST',
            data: post_data
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
        })

    }
}

// ============================================================================


});



// ======================= RETAILER REQUEST PAGE ====================================

app.controller('retailer_request', function ($scope, $http, $location) {

    $scope.showData = function () {
        $http.get("http://localhost:3000/smob/dashboard/retailer/req/data")
            .then(function (response) {
                $scope.allItems = response.data;
            });
    }

    $scope.SingleRequest = function(data){

        sessionStorage.setItem("Request", data.req_id);
        $location.path('/retailer_request_track');
    }

});


// ======================= RETAILER REQUEST TRACK PAGE ====================================
app.controller('retailer_request_track', function ($scope, $http, $location, $timeout) {

    $scope.current_date = sessionStorage.getItem("Current_Date");
    $scope.req_id = sessionStorage.getItem("Request");
    $scope.quote = 0;
    $scope.order = 0;
    $scope.invoice = 0;
    $scope.logistic = 0;
    $scope.payment = 0;

    $scope.acpt_btn = 0;
    $scope.PO_btn = 0;
    $scope.pay_btn = 0;

    $scope.quotation_item_id;
    $scope.quotation_quantity;

//  Hyperledger
    $scope.hfitem_name;
    $scope.hfraised_by;

// GEOLOCATION

    $scope.lat;
    $scope.long;

    $scope.geoLocation = function(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showLocation);
        } else{
            alert("Sorry, browser does not support geolocation!");
        }
    }

    function showLocation(position) {
        $scope.lat = position.coords.latitude;
        $scope.long = position.coords.longitude;
     }


    $http.get("http://localhost:3000/smob/dashboard/retailer/req/data/" +$scope.req_id)
            .then(function (response) {
                $scope.allItems = response.data;

                $scope.quotation_item_id = $scope.allItems[0].item_id;
                $scope.quotation_quantity = $scope.allItems[0].quantity;

                //  HF
                $scope.hfitem_name = $scope.allItems[0].item_name;
                $scope.hfraised_by = $scope.allItems[0].manufacturer_name;

                if($scope.allItems[0].status == "quotation raised"){
                    $scope.acpt_btn = 1;
                }
                else if($scope.allItems[0].status == "quotation accepted"){
                    $scope.PO_btn = 1;
                }
                //else if($scope.allItems[0].status == "invoice raised"){
                else if($scope.allItems[0].status == "order delivered"){
                    $scope.pay_btn = 1;
                }
                else{
                    $scope.acpt_btn = 0;
                }
            });

            $http.get("http://localhost:3000/smob/dashboard/retailer/quotation/" +$scope.req_id)
            .then(function (response) {
                $scope.quo_datas = response.data;
                if($scope.quo_datas.length > 0){
                    $scope.quote = 1;
                }
            });


            $http.get("http://localhost:3000/smob/dashboard/retailer/order/"+$scope.req_id)
            .then(function (response) {
                $scope.order_datas = response.data;
                if($scope.order_datas.length > 0){
                    $scope.order = 1;
                }
            });
            
    
        $http.get("http://localhost:3000/smob/dashboard/retailer/invoice/" +$scope.req_id)
            .then(function (response) {
                $scope.invoice_datas = response.data;
                if($scope.invoice_datas.length > 0){
                   $scope.invoice = 1;
                }
            });

            $http.get("http://localhost:3000/smob/logistic/data/" +($scope.req_id + '555'))
            .then(function (response) {
                $scope.logistic_datas = response.data;
                if($scope.logistic_datas.length > 0 && $scope.invoice == 1){
                   $scope.logistic = 1;
                }
            });

        $http.get("http://localhost:3000/smob/dashboard/retailer/payment/" +$scope.req_id)
            .then(function (response) {
                $scope.pay_datas = response.data;
                if($scope.pay_datas.length > 0){
                    $scope.payment = 1;
                }
            });

/////////////////////////////// ACCEPT & REJECT REQUEST FUNCTION  /////////////////////////////////
    $scope.acceptQuotation = function(){

        let updatedData = { req_id:$scope.req_id, status:"quotation accepted" };
                $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $scope.done();

                });
          
              $scope.done = function(){
            $location.path('retailer_request');
             }

    }

    $scope.rejectQuotation = function(){

        let updatedData = { req_id:$scope.req_id, status:"quotation rejected" };
                $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $scope.done();

                });
          
              $scope.done = function(){
            $location.path('retailer_request');
             }

    }

    // ============================ PURCHASE ORDER MODAL =======================================

    $scope.placeorderRaised = function(id,date){

        var postdata = JSON.stringify({
            req_id : id,
            order_id: id,
            order_date : date
        });
      
        //console.log(postdata);
    
        $http({
            url: 'http://localhost:3000/postData/smob/retailer/po',
            method: 'POST',
            data: postdata
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
            alert("Purchase Order placed Successfully !");
              $scope.updateStatus();
              $scope.initLogistics();
          })
    
          $scope.updateStatus = function(){
            let updatedData = { req_id:$scope.req_id, status:"purchase order placed" };
                      $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                       console.log("1 DOCUMENT UPDATED");
                       $timeout(Done, 100);
                      });
                  }
      
              function Done(){
                  $location.path('retailer_request');
              }

    }

    // ============================== Logistics =========================================================

    $scope.initLogistics = function(){

        let id = $scope.req_id + '555';
        let requester = sessionStorage.getItem("userName");
        let address = sessionStorage.getItem("userAddress");
    
        var postdata = JSON.stringify({
            id: id,
            current_date: $scope.current_date,
            expected_date : "Will be Updated Soon!",
            requester : requester,
            shipping_address : address,
            status : "order processing",
            lat: $scope.lat,
            long: $scope.long
        });
    
        //console.log(postdata);

        $http({
            url: 'http://localhost:3000/postData/smob/logistic/data',
            method: 'POST',
            data: postdata
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
        })
    
    }

    // ==================== Payment Modal ========================================

    $scope.paymentModal = function(){     
        $scope.totalPrice;

            $http.get("http://localhost:3000/smob/dashboard/manufacturer/inventory/data/"+$scope.quotation_item_id)
                .then(function (response) {
                    $scope.ItemData = response.data;
                    $scope.totalPrice = $scope.quotation_quantity * parseInt($scope.ItemData[0].price);
                    sessionStorage.setItem("totalPrice",$scope.totalPrice);
                });
    }

    $scope.Payment = function(id,date,mode,total){

        var postdata = JSON.stringify({
            invoice_id : id,
            payment_id: id,
            payment_date : date,
            payment_method : mode,
            total_price : total.toString()
        });
      
        console.log(postdata);

        $http({
            url: 'http://localhost:3000/postData/smob/retailer/payment',
            method: 'POST',
            data: postdata
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
            alert("Payment Done Successfully !");
             $scope.updateNewStatus();
             $scope.HyperledgerPost();
          })
    
          $scope.updateNewStatus = function(){
            let updatedData = { req_id:$scope.req_id, status:"request approved" };
                      $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', updatedData).then(function (response) {
                       console.log("1 DOCUMENT UPDATED");
                       $timeout(Done, 100);
                      });
                  }
      
              function Done(){
                  $location.path('retailer_request');
              }

            $scope.HyperledgerPost = function(){

                let price = sessionStorage.getItem("totalPrice");
                let userName = sessionStorage.getItem("userName");
                //let txid = 'TXNS' + $scope.req_id + '555';
                let txid = 'TXNS' + (+new Date());

                var hfdata = JSON.stringify({
                    txn_id : txid,
                    id: $scope.req_id,
                    material : $scope.hfitem_name,
                    quantity : $scope.quotation_quantity.toString(),
                    sender : $scope.hfraised_by,
                    receiver : userName,
                    date : $scope.current_date,
                    price: price
                });

                $http({
                    url: 'http://localhost:3000/api/hf/postData',
                    method: 'POST',
                    data: hfdata
                }).then(function (httpResponse) {
                    console.log('response:', httpResponse);
                    alert("Hyperledger Updated !");
                  })

            }

    }


});



/////////////////////////////////////////////////////////////////////////////////////////////////////
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



// ======================= SUPPLIER DASHBOARD ====================================


app.controller('supplier_dashboard', function ($scope, $http) {

    $scope.itemCount;

    $scope.showData = function () {
        $http.get("http://localhost:3000/smob/dashboard/inventory/data")
            .then(function (response) {
                $scope.allItems = response.data;
                $scope.itemCount = (parseInt($scope.allItems[$scope.allItems.length - 1].item_id))+1;
            });
    }

    $scope.addNewItem = function(id,sup_id,name,price,quantity,desc){

        var postdata = JSON.stringify({
              item_id: id.toString(),
              supplier_id : sup_id,
              item_name : name,
              price : price.toString(),
              quantity : quantity.toString(),
              description: desc
        });
        
        //console.log(postdata);
  
        $http({
          url: 'http://localhost:3000/postData/smob/supplier/dashboard/newData',
          method: 'POST',
          data: postdata
      }).then(function (httpResponse) {
          console.log('response:', httpResponse);
          $scope.showData();
        });

}

});

// ======================= SUPPLIER REQUEST PAGE ====================================

app.controller('supplier_request', function ($scope, $http, $location) {

    $scope.showData = function () {
        $http.get("http://localhost:3000/smob/dashboard/req/data")
            .then(function (response) {
                $scope.datas = response.data;
            });
    }

    $scope.SingleRequest = function(data){

        sessionStorage.setItem("Request", data.req_id);
        $location.path('supplier_request_track');
    }


});


// ======================= SUPPLIER REQUEST TRACK ====================================

app.controller('supplier_request_track', function ($rootScope, $scope, $http, $timeout, $location) {

    $scope.current_date = sessionStorage.getItem("Current_Date");
    $scope.req_id = sessionStorage.getItem("Request");
    $scope.new_order_id;
    $scope.new_invoice_id;
    
    $scope.quote = 0;
    $scope.order = 0;
    $scope.invoice = 0;
    $scope.logistic = 0;
    $scope.payment = 0;

    $scope.quotation_item_id;
    $scope.quotation_quantity;
    $scope.acpt_btn = 0;
    $scope.quote_btn = 0;
    $scope.invoice_btn = 0;
	
    
        $http.get("http://localhost:3000/smob/dashboard/req/data/" +$scope.req_id)
            .then(function (response) {
                $scope.req_datas = response.data;

                $scope.quotation_item_id = $scope.req_datas[0].item_id;
                $scope.quotation_quantity = $scope.req_datas[0].quantity;

                if($scope.req_datas[0].status == "pending"){
                    $scope.acpt_btn = 1;
                }
                else if($scope.req_datas[0].status == "request accepted"){
                    $scope.quote_btn = 1;    
                }
                else if($scope.req_datas[0].status == "purchase order accepted"){
                    $scope.invoice_btn = 1;   
                }
                else{
                    $scope.acpt_btn = 0;
                    $scope.quote_btn = 0;
                }
            });
    
        $http.get("http://localhost:3000/smob/dashboard/req/quotation/" +$scope.req_id)
            .then(function (response) {
                $scope.quo_datas = response.data;
                if($scope.quo_datas.length > 0){
                    $scope.quote = 1;
                }
                //console.log(response.data.length);
            });
    
        $http.get("http://localhost:3000/smob/dashboard/req/order/"+$scope.req_id)
            .then(function (response) {
                $scope.order_datas = response.data;
                //console.log($scope.order_datas);
                if($scope.order_datas.length > 0){
                    $scope.order = 1;
                    $scope.new_order_id = $scope.order_datas[0].order_id;
                    $timeout(timeoutInvoice, 100);
                }
            });
            
    
        function timeoutInvoice(){
    
        $http.get("http://localhost:3000/smob/dashboard/req/invoice/" +$scope.new_order_id)
            .then(function (response) {
                $scope.invoice_datas = response.data;
                //console.log($scope.invoice_datas);
                if($scope.invoice_datas.length > 0){
                   $scope.invoice = 1;
                   $scope.new_invoice_id = $scope.invoice_datas[0].invoice_id;
                   $timeout(timeoutLogistic, 100);
                }
            });
    
        }

        function timeoutLogistic(){
        $http.get("http://localhost:3000/smob/logistic/data/" +($scope.req_id + '777'))
            .then(function (response) {
                $scope.logistic_datas = response.data;
                if($scope.logistic_datas.length > 0 && $scope.invoice == 1){
                   $scope.logistic = 1;
                   $timeout(timeoutPayment, 100);
                }
            });
        }
    
        function timeoutPayment(){
    
        $http.get("http://localhost:3000/smob/dashboard/req/payment/" +$scope.new_invoice_id)
            .then(function (response) {
                $scope.pay_datas = response.data;
                //console.log($scope.pay_datas);
                if($scope.pay_datas.length > 0){
                    $scope.payment = 1;
                }
            });
    
        }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.accepted = function(){

                let updatedData = { req_id:$scope.req_id, status:"request accepted" };
                $http.put('http://localhost:3000/smob/updateData', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $scope.done();

                });
          
              $scope.done = function(){
            $location.path('supplier_request');
             }


        }
    
        $scope.rejected = function(){
            
            let updatedData = { req_id:$scope.req_id, status:"request rejected" };
                $http.put('http://localhost:3000/smob/updateData', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $scope.done();

                });
          
              $scope.done = function(){
            $location.path('supplier_request');
        }

        }


        $scope.quotationModal = function(){     
            $scope.totalPrice;

                $http.get("http://localhost:3000/smob/dashboard/inventory/data/"+$scope.quotation_item_id)
                    .then(function (response) {
                        $scope.ItemData = response.data;
                        $scope.totalPrice = $scope.quotation_quantity * parseInt($scope.ItemData[0].price);
                        sessionStorage.setItem("totalPrice", $scope.totalPrice);

                    });
        }

        $scope.quotationRaised = function(id,date,price,totalprice){

                var postdata = JSON.stringify({
                      req_id: id,
                      quotation_id : id,
                      quotation_date : date,
                      unit_price : price,
                      total_price : totalprice.toString()
                });
                
                //console.log(postdata);
          
                $http({
                  url: 'http://localhost:3000/postData/smob/supplier/track',
                  method: 'POST',
                  data: postdata
              }).then(function (httpResponse) {
                  console.log('response:', httpResponse);
                alert("Quotation Raised !");
                $scope.quotationDone();

              })   

              $scope.quotationDone = function(){
                let updatedData = { req_id:$scope.req_id, status:"quotation raised" };
                $http.put('http://localhost:3000/smob/updateData', updatedData).then(function (response) {
                 console.log("1 DOCUMENT UPDATED");
                 $timeout(Done, 100);
                });
              }

            function Done(){
                $location.path('supplier_request');
            }
        }


        $scope.invoiceRaised = function(id,date,pay_mode,total){

            var postdata = JSON.stringify({
                order_id: id,
                invoice_id : id,
                invoice_date : date,
                pay_method : pay_mode,
                total_price : total.toString()
            });
          
            //console.log(postdata);

            $http({
                url: 'http://localhost:3000/postData/smob/supplier/invoice/track',
                method: 'POST',
                data: postdata
            }).then(function (httpResponse) {
                console.log('response:', httpResponse);
                alert("Invoice Raised !");
                $scope.invoiceDone();
                
            })

            $scope.invoiceDone = function(){
                let updatedData = { req_id:$scope.req_id, status:"invoice raised" };
              $http.put('http://localhost:3000/smob/updateData', updatedData).then(function (response) {
               console.log("1 DOCUMENT UPDATED");
               $timeout(Done, 100);
              });
            }

            function Done(){
              $location.path('supplier_request');
          }


        }


});

// =============================== LOGISTICS =============================================

app.controller('logisticCtrl', function ($scope, $http, $timeout, $window) {

    $scope.pack = 0;
    $scope.ex_date = 0;
    $scope.dispatch = 0;
    $scope.deliver = 0;

    $scope.singleID;

    $http.get("http://localhost:3000/smob/logistic/data")
            .then(function (response) {
                $scope.datas = response.data;
    });

    $scope.getData = function(id){
 
        $scope.singleID = id;

        $http.get("http://localhost:3000/smob/logistic/data/" +id)
            .then(function (response) {
                $scope.singleData = response.data;

                sessionStorage.setItem("LogisticRequester", $scope.singleData[0].requester);

                var latlongvalue = $scope.singleData[0].lat + ","+ $scope.singleData[0].long;
                let img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlongvalue+"&amp;zoom=15&amp;size=600x300&amp;key=AIzaSyAa8HeLH2lQMbPeOiMlM9D1VxZ7pbGQq8o";
                document.getElementById("mapholder").innerHTML ="<img src='"+img_url+"'>";
        
                if($scope.singleData[0].status == "order processing"){
                    $scope.pack = 1;
                    $scope.class1 = "";
                    $scope.class2 = "";
                    $scope.class3 = "";
                    $scope.ex_date = 0;
                    $scope.dispatch = 0;
                    $scope.deliver = 0;
                }
                else if($scope.singleData[0].status == "order packed"){
                    $scope.class1 = "active";
                    $scope.class2 = "";
                    $scope.class3 = "";
                    $scope.ex_date = 1;
                    $scope.pack = 0;
                    $scope.dispatch = 0;
                    $scope.deliver = 0;
                }
                else if($scope.singleData[0].status == "order preparing to dispatch"){
                    $scope.dispatch = 1;
                    $scope.class1 = "active";
                    $scope.class2 = "";
                    $scope.class3 = "";
                    $scope.pack = 0;
                    $scope.ex_date = 0;
                    $scope.deliver = 0;

                }
                else if($scope.singleData[0].status == "order dispatched"){
                    $scope.class1 = "active";
                    $scope.class2 = "active";
                    $scope.class3 = "";

                    $scope.deliver = 1;
                    $scope.pack = 0;
                    $scope.ex_date = 0;
                    $scope.dispatch = 0;
                }
                else if($scope.singleData[0].status == "order delivered"){
                    $scope.class1 = "active";
                    $scope.class2 = "active";
                    $scope.class3 = "active";
                    $scope.pack = 0;
                    $scope.ex_date = 0;
                    $scope.dispatch = 0;
                    $scope.deliver = 0;
                }

            });

    }

    $scope.packed = function(){
        
        $scope.pack = 0;

        let updatedData = { id:$scope.singleID, status:"order packed" };
        $http.put('http://localhost:3000/smob/logistic/updateStatus', updatedData).then(function (response) {
         console.log("1 DOCUMENT UPDATED");
         alert("Order Packed !");
         $timeout(Done, 100);
        });

        function Done(){
            //$route.reload();
            $window.location.reload();
        }
    }

    $scope.exDate = function(date){

        $scope.ex_date = 0;

        let updatedData = { id:$scope.singleID, status:"order preparing to dispatch", expected_date:date };
        $http.put('http://localhost:3000/smob/logistic/updateStatusDate', updatedData).then(function (response) {
         console.log("1 DOCUMENT UPDATED");
         $timeout(Done, 100);
        });

        function Done(){
            $window.location.reload();
        }

    }

    $scope.dispatched = function(){

        $scope.dispatch = 0;

        let updatedData = { id:$scope.singleID, status:"order dispatched" };
        $http.put('http://localhost:3000/smob/logistic/updateStatus', updatedData).then(function (response) {
         console.log("1 DOCUMENT UPDATED");
         $timeout(Done, 100);
        });

        function Done(){
            $window.location.reload();
        }

    }
    $scope.delivered = function(){

        let getID = $scope.singleID;
        getID = getID.slice(0, -3);
        let LogisticRequester = sessionStorage.getItem("LogisticRequester");

        $scope.deliver = 0;

        let updatedData = { id:$scope.singleID, status:"order delivered" };
        $http.put('http://localhost:3000/smob/logistic/updateStatus', updatedData).then(function (response) {
         console.log("1 DOCUMENT UPDATED");
         alert("Order Delivered !");

        if(LogisticRequester == "DX"){
            $scope.updateSupplierStatus();
        }
        else{
            $scope.updateRetailerStatus();
        }

        });

        $scope.updateRetailerStatus = function(){
            let newupdatedData = { req_id:getID, status:"order delivered" };
                      $http.put('http://localhost:3000/smob/dashboard/retailer/req/track/update', newupdatedData).then(function (response) {
                       console.log("1 DOCUMENT UPDATED");
                       $timeout(Done, 100);
                      });
                  }

        $scope.updateSupplierStatus = function(){
            let newupdatedData = { req_id:getID, status:"order delivered" };
                $http.put('http://localhost:3000/smob/updateData', newupdatedData).then(function (response) {
                     console.log("1 DOCUMENT UPDATED");
                     $timeout(Done, 100);
                    });
        }

        function Done(){
            $window.location.reload();
        }
        
    }

});
