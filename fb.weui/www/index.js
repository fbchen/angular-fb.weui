/**
 * fb.WeUI App
 * 
 * @author fbchen
 * @version 1.0 2016-07-28
 */
(function () {
    'use strict';

    angular.module('App', [
        'fb.weui'
    ])
    
    .controller('IndexCtrl', ['$scope', '$timeout', '$window', '$weui', function($scope, $timeout, $window, $weui) {
        
        $scope.showToast = function() {
            $weui.showToast('You do it Right!');
        }
        
        $scope.showLoadingToast = function() {
            $weui.showLoadingToast();
            $timeout(function() {
                $weui.hideLoadingToast();
            }, 2000);
        }
        
        $scope.showSavingToast = function() {
            $weui.showSavingToast();
            $timeout(function() {
                $weui.hideLoadingToast();
            }, 2000);
        }
        
        $scope.showConfirmDialog = function() {
            $weui.confirm('Message', 'Are you sure to delete the files?').then(function() {
                $window.alert('Files are deleted!')
            }, function() {
                $window.alert('Files are still here!')
            });
        }
        
        $scope.showAlertDialog = function() {
            $weui.alert('Message', 'Hello there!').then(function() {
                $window.alert('Goodbye!')
            });
        }
        
        $scope.showActionsheet = function() {
            $weui.actionsheet([{
                text: 'Action Menu1', action: '1', somethingElse: 'foo'
            }, {
                text: 'Action Menu2', action: '2', somethingElse: 'bar'
            }, {
                text: 'Action Menu3', action: '3'
            }]).then(function(menu) {
                $window.alert('You hit ' + menu.text);
            }, function() {
                $window.alert('You hit Cancel!');
            });
        }
            
    }]);
        

})();