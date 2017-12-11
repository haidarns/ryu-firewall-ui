var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

	var updateView=function(){
		$scope.nr = {
			priority: null,
			in_port: null,
			dl_src: null,
			dl_dst: null,
			dl_type: null,
			nw_src: null,
			nw_dst: null,
			ipv6_src: null,
			ipv6_dst: null,
			nw_proto: null,
			tp_src: null,
			tp_dst: null,
			actions: null
		}

		$scope.nrswitch = 'all';
		$scope.nrvlan = '';

		$http.get('/fwstatus').success(function(response) {
			$scope.switches = response;
		});		
	};

	updateView();

	$scope.enableFirewall = function(sw_id) {
		$http.put('/fwenable/'+sw_id).success(function(response) {
			updateView();
		});
	}

	$scope.disableFirewall = function(sw_id) {
		$http.put('/fwdisable/'+sw_id).success(function(response) {
			updateView();
		});
	}

	$scope.modalFirewall = function(sw_id) {
		$http.get('/fwrules/'+sw_id).success(function(response) {
			$scope.rules = response[0];
			//console.log($scope.rules);
		});
	}

	$scope.saveRules = function(){
		if ($scope.nrvlan === null) {
			$http.post('/fwrules/'+$scope.nrswitch, $scope.nr).success(function(response) {
				console.log(response);
			});		
		} else {
			$http.post('/fwrules/'+$scope.nrswitch+'/'+$scope.nrvlan, $scope.nr).success(function(response) {
				console.log(response);
			});		
		}
		updateView();
		//console.log($scope.nr, $scope.nrswitch, $scope.nrvlan);
	}

	$scope.delRules = function(switchid, vlanid, ruleid){
		if (vlanid === null || vlanid === undefined) {
			$http.delete('/fwrules/'+switchid+'/'+ruleid).success(function(response) {
				console.log(response);
			});		
		} else {
			$http.delete('/fwrules/'+switchid+'/'+ruleid+'/'+vlanid).success(function(response) {
				console.log(response);
			});		
		}
		updateView();
		//console.log(switchid, vlanid, ruleid, param);
	}
}]);